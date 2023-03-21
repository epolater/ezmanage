from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("test", views.test, name="test"),
    path("addnewproject", views.addnewproject, name="addnewproject"),
    path("deleteproject", views.deleteproject, name="deleteproject"),
    path("editproject", views.editproject, name="editproject"),
    path("activities/<str:project_id>", views.activities, name="activities"),
    path("addnewactivity", views.addnewactivity, name="addnewactivity"),
    path("deleteactivity", views.deleteactivity, name="deleteactivity"),
    path("showcontent", views.showcontent, name="showcontent"),
    path("showrelations", views.showrelations, name="showrelations"),
    path("assignpredecessor", views.assignpredecessor, name="assignpredecessor"),
    path("assignsuccessor", views.assignsuccessor, name="assignsuccessor"),
    path("deleterelation", views.deleterelation, name="deleterelation"),
    path("runschedule", views.runschedule, name="runschedule"),
    path("editrelation", views.editrelation, name="editrelation"),
    path("editactivity", views.editactivity, name="editactivity"),

]