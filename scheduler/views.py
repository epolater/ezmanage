import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages
from datetime import datetime
from django.core import serializers
from datetime import date, timedelta

from. models import User, Project, Activity, Relation, Code

# STANDART VIEWS ----------------------------------------

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "scheduler/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "scheduler/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "scheduler/register.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "scheduler/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "scheduler/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def index(request):

    bottom_tabs = {"General"}
    

    if request.user.is_authenticated:
        try:
            projects = Project.objects.filter(user=request.user)
        except Project.DoesNotExist:
            projects = {}

        return render(request, "scheduler/projects.html", {
            "bottom_tabs": bottom_tabs,
            "projects": projects,
            "section_display": "projects",
        })
    else:
        return HttpResponseRedirect(reverse("login")) 

def test(request):


    activity=Activity.objects.get(activity_id="A0020")
    s_relations = Relation.objects.filter(predecessor=activity)

    result=[]
    for s_relation in s_relations:
    
        result.append(len(s_relation.activity.successors.all()))

    return render(request, "scheduler/test.html",{
        "result": result
    })


# NON-STANDART VIEWS ----------------------------------------

#Add new project from layout.html form
@login_required
def addnewproject(request):
    if request.method == 'POST':
        project_id = request.POST["projectid"]
        projectname = request.POST["projectname"]
        start = request.POST["projectstart"]

        # Creating new project
        newproject = Project(
            project_id = project_id,
            name = projectname,
            start = start,
            finish = datetime.strptime(start, "%Y-%m-%d") + timedelta(days=4),
            duration = 5,
            user = request.user
        )
        newproject.save()

        # Creating first activity for new project
        new_activity = Activity(
            project = newproject,
            activity_id = "A0010",
            name = "New Activity A0010",
            start = start,
            finish = datetime.strptime(start, "%Y-%m-%d") + timedelta(days=4),
            #late_start = start,
            #late_finish = start,
            #actual_start = start,
            #actual_finish = start,
        )
        new_activity.save()

        Code.objects.create(activity=new_activity)

    return HttpResponseRedirect(reverse("index"))

@login_required
def deleteproject(request):
    if request.method == "POST":
        project_id = json.loads(request.body).get("project_id", "")

        try:
            project = Project.objects.get(project_id=project_id)
            project.delete()
            return JsonResponse({"message":f"Project id no {project_id} deleted"}, status=201)
        
        except Project.DoesNotExist:
            return JsonResponse({"message":"PASSED"}, status=201)

def editproject(request):
    if request.method == "POST":
        project_id = json.loads(request.body).get("project_id", "")
        contenttoedit = json.loads(request.body).get("contenttoedit", "")
        content = json.loads(request.body).get("content", "")

        project = Project.objects.get(project_id=project_id)


        if contenttoedit == "project_id":
            project.project_id = content
            project.save()
        
        elif contenttoedit == "name":
            project.name = content
            project.save()
        
    
    return JsonResponse({"message":"Project edited"}, status=201)

#Open Project
@login_required
def activities(request, project_id):

    bottom_tabs = {
        "Generals",
        "Relationships",
        "Codes",
        }
    activity_headers = {
        "1":"Activity Id",
        "2":"Activity Name",
        "3":"Original Duration",
        "4":"Remaining Duration",
        "5":"Start",
        "6":"Finish",
        "7":"Total Float",
        "8":"Free Float",
        "9":"Late Start",
        "10":"Late Finish",
        "11":"Actual Duration",
        "12":"Actual Start",
        "13":"Actual Finish",
        "14":"WBS",
        "15":"Code",
        }

    if request.method == "GET":
        project = Project.objects.get(project_id=project_id)
        activities = Activity.objects.filter(project=project)

        start = project.start
        project_duration = project.duration

        daterange = []
        for i in range(project_duration):
            daterange.append(start + timedelta(days=i))
        
        if activities.exists():
            #First and Last dates of project
            #first_activity=activities.earliest('start')
            last_activity = activities.latest('finish')
            
            #earliestdate = first_activity.start
            latestdate = last_activity.finish
            
            return render(request, "scheduler/activities.html", {
                "activity_headers": activity_headers,
                "bottom_tabs": bottom_tabs,
                "activities" : activities,
                "last_activity": last_activity,
                "project": project,
                "start": start,
                "section_display": "activities",
                "project_duration": project_duration,
                "daterange": daterange,
                "latestdate": latestdate,
            })
        
        else:
            return render(request, "scheduler/activities.html", {
                "activity_headers": activity_headers,
                "bottom_tabs": bottom_tabs,
                "activities" : activities,
                "project": project,
                "start": start,
                "section_display": "activities",
                "project_duration": project_duration,
                "daterange": daterange,
            })

@login_required
def addnewactivity(request):
    if request.method == "POST":
        project_id = json.loads(request.body).get("project_id", "")
        project = Project.objects.get(project_id=project_id)
        start = project.start
        
        # Setting new activity id by incrementing last activity's id
        new_id = ""
        last_activity = Activity.objects.last()
        if last_activity != None:
            try:
                last_two_character = int(last_activity.activity_id.strip()[-2:])
                other_characters = last_activity.activity_id.strip()[:-2]
                new_id = f"{other_characters}{last_two_character + 10}"
            except ValueError:
                new_id = f"{last_activity.activity_id}10"
        else:
            new_id = "A0010"

        # Creating activity
        new_activity = Activity(
            project = project,
            activity_id = new_id,
            name = f"New Activity {new_id}",
            start = start,
            finish = start + timedelta(days=5),
            #late_start = start,
            #late_finish = start + timedelta(days=5),
            #actual_start = start ,
            #actual_finish = start + timedelta(days=5),
        )
        new_activity.save()

        code = Code(activity=new_activity)
        code.save()
        
        response = serializers.serialize('json', [new_activity, code])

        return JsonResponse(response, safe=False)

def deleteactivity(request):
    if request.method == "POST":
        project_id = json.loads(request.body).get("project_id", "")
        activty_id = json.loads(request.body).get("activity_id", "")
        project = Project.objects.get(project_id=project_id)
        activty = Activity.objects.get(activity_id=activty_id, project=project)
        activty.delete()

        return JsonResponse({"message": f"Activiy Id: {activty_id} is deleted"}, status=201)

@login_required
def showcontent(request):
    if request.method == 'POST':
        project_id = json.loads(request.body).get("project_id", "")
        activity_id = json.loads(request.body).get("activity_id", "")
        
        project = Project.objects.get(project_id=project_id) 
        activity = Activity.objects.get(activity_id=activity_id, project=project)
        code = Code.objects.get(activity=activity)


        response = serializers.serialize('json', [project, activity, code])

        return JsonResponse(response, safe=False)

@login_required
def showrelations(request):
    if request.method == 'POST':
        project_id = json.loads(request.body).get("project_id", "")
        activity_id = json.loads(request.body).get("activity_id", "")
        
        project = Project.objects.get(project_id = project_id)
        activity = Activity.objects.get(activity_id=activity_id, project=project)
        relations_predecessor = Relation.objects.filter(activity=activity)
        relations_successor = Relation.objects.filter(predecessor=activity)

        # Create Predecessors List
        predecessors = []
        for relation in relations_predecessor:
            predecessor = {}
            predecessor['description'] = 'predecessor'
            predecessor['activity_id'] = relation.predecessor.activity_id
            predecessor['name'] = relation.predecessor.name
            predecessor['start'] = relation.predecessor.start
            predecessor['finish'] = relation.predecessor.finish
            predecessor['critical'] = relation.predecessor.critical
            predecessor['relation'] = relation.relation
            predecessor['lag'] = relation.lag
            predecessor['id'] = relation.id

            predecessors.append(predecessor)

        # Create Successors List
        successors = []
        for relation in relations_successor:
            successor = {}
            successor['description'] = 'successor'
            successor['activity_id'] = relation.activity.activity_id
            successor['name'] = relation.activity.name
            successor['start'] = relation.activity.start
            successor['finish'] = relation.activity.finish
            successor['critical'] = relation.activity.critical
            successor['relation'] = relation.relation
            successor['lag'] = relation.lag
            successor['id'] = relation.id

            successors.append(successor)
        
        # Create Combined List
        relations_list = predecessors + successors

        #response = serializers.serialize('json', predecessors) 

        return JsonResponse(relations_list, safe=False)

@login_required
def assignpredecessor(request):
    if request.method == 'POST':
        # Get data from Fetch
        project_id = json.loads(request.body).get("project_id", "")
        activity_id = json.loads(request.body).get("activity_id", "")
        predecessor_id = json.loads(request.body).get("predecessor_id", "")
        project = Project.objects.get(project_id=project_id)

        # Get activity objects from model 
        activity = Activity.objects.get(activity_id=activity_id, project=project)
        predecessor = Activity.objects.get(activity_id=predecessor_id, project=project)

        # Aassign relation
        new_relation = Relation(activity = activity, predecessor = predecessor)
        new_relation.save()

        response = serializers.serialize('json', [predecessor])

        return JsonResponse(response, safe=False)
    
@login_required
def assignsuccessor(request):
    if request.method == 'POST':
        # Get data from Fetch
        project_id = json.loads(request.body).get("project_id", "")
        activity_id = json.loads(request.body).get("activity_id", "")
        successor_id = json.loads(request.body).get("successor_id", "")
        project = Project.objects.get(project_id=project_id)

        # Get activity objects from model 
        activity = Activity.objects.get(activity_id=activity_id, project=project)
        successor = Activity.objects.get(activity_id=successor_id, project=project)

        # Aassign relation
        new_relation = Relation(activity = successor, predecessor = activity)
        new_relation.save()

        response = serializers.serialize('json', [successor])

        return JsonResponse(response, safe=False)

@login_required
def deleterelation(request):
    if request.method == 'POST':
        # Get data from Fetch
        #activity_id = json.loads(request.body).get("activity_id", "")
        #predecessor_id = json.loads(request.body).get("predecessor_id", "")
        #relationtype = json.loads(request.body).get("relationtype", "")
        relation_id = json.loads(request.body).get("relation_id", "")

        # Get activity objects from model
        #activity = Activity.objects.get(activity_id=activity_id)
        #predecessor = Activity.objects.get(activity_id=predecessor_id)
        relation = Relation.objects.get(pk=relation_id)#(activity=activity, predecessor=predecessor, relation=relationtype)
        relation.delete()

        return JsonResponse(
            {"message": f"Relation Id: {relation_id} is removed from predecessors"},
            status=201
        )


def editrelation(request):
    if request.method == "POST":
        #activity_id = json.loads(request.body).get("activity_id", "")
        #predecessor_id = json.loads(request.body).get("predecessor_id", "")
        relation_type = json.loads(request.body).get("relation_type", "")
        relation_id = json.loads(request.body).get("relation_id", "")
        lag = json.loads(request.body).get("lag", "")

        #activity=Activity.objects.get(activity_id=activity_id)
        #predecessor = Activity.objects.get(activity_id=predecessor_id)

        relation = Relation.objects.get(pk=relation_id)
        
        if relation_type != "":
            relation.relation = relation_type
        elif lag != '':
            relation.lag = lag
        
        relation.save()

        return JsonResponse({"message":"Relation or lag is edited"})


def editactivity(request):
    if request.method == "POST":
        project_id = json.loads(request.body).get("project_id", "")
        activity_id = json.loads(request.body).get("activity_id", "")
        contenttoedit = json.loads(request.body).get("contenttoedit", "")
        content = json.loads(request.body).get("content", "")

        project = Project.objects.get(project_id=project_id)
        activity = Activity.objects.get(activity_id=activity_id, project=project)

        if contenttoedit == "activity_id":
            activity.activity_id = content
            activity.save()
        
        elif contenttoedit == "name":
            activity.name = content
            activity.save()
        
        elif contenttoedit == "original_duration":
            activity.original_duration = content
            activity.save()
        
        elif contenttoedit == "remaining_duration":
            activity.remaining_duration = content
            activity.save()
    
    return JsonResponse({"message":"Activity content edited"}, status=201)


@login_required
def runschedule(request):
    if request.method == 'POST':
        project_id = json.loads(request.body).get("project_id", "")
        project = Project.objects.get(project_id=project_id)

        activities = Activity.objects.filter(project=project)

        if activities.exists():
            
            # FORWARD PASS (for Start and Finish Dates)
            # Looping through all activities in project
            for activity in activities:
                # Getting all relations for each activity that has predecessors
                relations = Relation.objects.filter(activity=activity)
                # If there are predecessors
                if relations.exists():
                    # Looping through all relations for activity
                    activity_starts = []
                    for relation in relations:
                            # Checking relationship types for "Activity Start Date"
                            if relation.relation == "FS":
                                start = relation.predecessor.finish + timedelta(days=relation.lag + 1)
                                activity_starts.append(start)

                            elif relation.relation == "SS":
                                start = relation.predecessor.start + timedelta(days=relation.lag)
                                activity_starts.append(start)

                            elif relation.relation == "FF":
                                finish = relation.predecessor.finish + timedelta(days=relation.lag)
                                start = finish - timedelta(days=activity.remaining_duration)
                                activity_starts.append(start)
                                
                    activity.start = max(activity_starts)
                    if activity.original_duration == 0:
                        activity.finish = activity.start
                    else:
                        activity.finish = activity.start + timedelta(days=activity.remaining_duration - 1)
                    activity.save()
                
                # If there are no predecessors
                else:
                    activity.start = project.start
                    if activity.original_duration == 0:
                        activity.finish = activity.start
                    else:
                        activity.finish = activity.start + timedelta(days=activity.remaining_duration - 1)
                    activity.save()

            # BACKWARD Pass for Late Start and Late Finish Dates (sonra bitis tarihleri en gec olan birden fazla aktivite icin guncellencek bu kisim)
            latest_activity = activities.latest('finish')
            latest_activity.late_start = latest_activity.start
            latest_activity.late_finish = latest_activity.finish
            latest_activity.total_float = (latest_activity.late_finish - latest_activity.finish).days
            latest_activity.save()

            # Backward for Activities w/o sucessor
            # Find activities w/o successor
            activities_openended = []
            for activity in activities:
                successor_relations = Relation.objects.filter(predecessor=activity)
                if Relation():
                    pass
                else:
                    activities_openended.append(activity)
            # Backward Pass
            if len(activities_openended) > 0:
                for activity in activities_openended:
                    activity.late_start = latest_activity.start
                    activity.late_finish = latest_activity.finish
                    activity.total_float = (latest_activity.late_finish - activity.finish).days
                    activity.save()

            # Calculation all predecessors' LS, LF and total floats (recursive function)
            latedates(latest_activity, project_id)
            
            # Setting Project Finish and Duration
            project.finish = latest_activity.finish
            project.duration = (latest_activity.finish - project.start).days + 1
            project.save()

            # Free Float Calculation
            for activity in activities:
                successor_relations = activity.successors.all()
                free_floats = []

                if successor_relations.exists():
                    for successor in successor_relations:
                        if successor.relation == "FS":
                            free_floats.append((successor.activity.start - activity.finish).days - successor.lag - 1)
                        elif successor.relation == "SS":
                            free_floats.append((successor.activity.start - activity.start).days - successor.lag)
                        elif successor.relation == "FF":
                            free_floats.append((successor.activity.finish - activity.finish).days - successor.lag)
                    
                    activity.free_float = min(free_floats)
                    activity.save()
                
                else:
                    activity.free_float = activity.total_float
                    activity.save()
                

            # Find Critical Activities
            criticalpath(project_id)


            return JsonResponse({"message":"Schedule run finished"}, status=201)
        
        else:
            return JsonResponse({"message":"No Activities to schedule"}, status=201)


# UTILS ----------------
def latedates(activity_n, project_id):
    project = Project.objects.get(project_id=project_id)
    
    # 1 Find activty's all predecessors
    p_relations = Relation.objects.filter(activity=activity_n)
    
    if len(p_relations) == 0:
        pass
    
    else:
        predecessors = []
        for p_relation in p_relations:
            predecessors.append(p_relation.predecessor)

        # 2 Find all successors of each predecessor
        successors = []
        latest_activity = project.activities.latest('finish')
        for predecessor in predecessors:
            late_finishes = []
            
            s_relations = Relation.objects.filter(predecessor=predecessor)
            
            for s_relation in s_relations:
                # If there is no successor of successor, LF is LF of latest activity
                if len(s_relation.activity.successors.all()) == 0:
                    s_relation.activity.late_finish = latest_activity.late_finish
                    s_relation.activity.late_start = s_relation.activity.late_finish - timedelta(days=s_relation.activity.remaining_duration - 1)
                    s_relation.activity.total_float = (s_relation.activity.late_finish - s_relation.activity.finish).days
                    s_relation.activity.save()

                successors.append(s_relation.activity)

                # 3 Calculate each predecessor's LF and LS according to successor's LS, LF
                if s_relation.relation == "FS":
                    late_finish = s_relation.activity.late_start - timedelta(days=(s_relation.lag - 1))
                    late_finishes.append(late_finish)
                
                elif s_relation.relation == "SS":
                    late_start = s_relation.activity.late_start - timedelta(days=s_relation.lag)
                    late_finish = late_start + timedelta(days=predecessor.remaining_duration)
                    late_finishes.append(late_finish)

                elif s_relation.relation == "FF":
                    late_finish = s_relation.activity.late_finish - timedelta(days=s_relation.lag)
                    late_finishes.append(late_finish)


            predecessor.late_finish = min(late_finishes)
            if predecessor.original_duration == 0:
                predecessor.late_start = predecessor.late_finish
            else:
                predecessor.late_start = predecessor.late_finish - timedelta(days=predecessor.remaining_duration)
            predecessor.total_float = (predecessor.late_finish - predecessor.finish).days
            predecessor.save()
            
            # 4 Repeat the function for predecessor
            latedates(predecessor, project_id)

    
        # If there is no sucessor and predecessor then LF = latest activity's LF
        if len(successors) == 0 and len(predecessors) == 0:
            activity_n.late_finish = latest_activity.late_finish
            activity_n.late_start = latest_activity.late_finish - timedelta(days=activity_n.remaining_duration - 1)
            activity_n.save()

def criticalpath(project_id):
    project = Project.objects.get(project_id=project_id)
    activities = Activity.objects.filter(project=project)
    for activity in activities:
        if activity.total_float <= 0:
            activity.critical = True
            activity.save()
        else:
            activity.critical = False
            activity.save()





    