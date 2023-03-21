from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Project(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="creator")
    project_id = models.CharField(max_length=12)
    name = models.CharField(max_length=128)
    start = models.DateField()
    finish = models.DateField(null=True)
    duration = models.IntegerField(null=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __self__(self):
        return f"{self.project_id} {self.name}"


class Activity(models.Model):
    project = models.ForeignKey("Project", on_delete=models.CASCADE, related_name="activities")
    activity_id = models.CharField(max_length=16)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True)
    original_duration = models.IntegerField(default=5)
    remaining_duration = models.IntegerField(default=5)
    actual_duration = models.IntegerField(default=5)
    total_float = models.IntegerField(default=0)
    free_float = models.IntegerField(default=0)  
    start = models.DateField()
    finish = models.DateField()
    late_start = models.DateField( null=True)
    late_finish = models.DateField( null=True)
    actual_start = models.DateField( null=True)
    actual_finish = models.DateField( null=True)
    progress = models.IntegerField(default=0)
    critical = models.BooleanField(default=False)

class Relation(models.Model):  
    activity = models.ForeignKey("Activity", on_delete=models.CASCADE, related_name="relations")
    predecessor = models.ForeignKey("Activity", on_delete=models.CASCADE, related_name="successors", null=True)
    relation = models.CharField(max_length=2, default='FS')
    lag = models.IntegerField(default=0)

class Code(models.Model):
    activity = models.ForeignKey("Activity", on_delete=models.CASCADE, related_name="activityfor_code")   
    wbs = models.CharField(max_length=16)
    code = models.CharField(max_length=16)

