from django.contrib import admin

from .models import User, Project, Activity, Relation, Code

class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "project_id", "name", "user", "date_created")

class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "project_name",
        "activity_id",
        "name",
        "original_duration",
        "remaining_duration",
        "actual_duration",
        "total_float",
        "free_float",
        "start",
        "finish",
        "late_start",
        "late_finish",
        "actual_start",
        "actual_finish",
        "progress",
    )
    
    def project_name(self, obj):
        return obj.project.name

    project_name.short_description = 'Project Name'

class CodeAdmin(admin.ModelAdmin):
    list_display = ("id","project_name", "activity_id", "activity_name", "wbs", "code",)
    
    def project_name(self, obj):
        return obj.project.name
    def activity_id(self, obj):
        return obj.activity.activity_id
    def activity_name(self, obj):
        return obj.activity.name

    project_name.short_description = 'Project Name'
    activity_id.short_description = 'Activit Id'
    activity_name.short_description = 'Activity Name'


class RelationAdmin(admin.ModelAdmin):
    
    list_display = ("id", "project_name", "activity_id", "activity_name", "predecessor_id", "predecessor_name", "relation", "lag")

    def project_name(self, obj):
        return obj.activity.project.name
    
    def activity_name(self, obj):
        return obj.activity.name

    def activity_id(self, obj):
        return obj.activity.activity_id

    def predecessor_id(self, obj):
        return obj.predecessor.activity_id
    
    def predecessor_name(self, obj):
        return obj.predecessor.name

    project_name.short_description = 'Project Name'
    activity_id.short_description = 'Activit Id'
    activity_name.short_description = 'Activity Name'


# Register models here
admin.site.register(User)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(Relation, RelationAdmin)
admin.site.register(Code, CodeAdmin)