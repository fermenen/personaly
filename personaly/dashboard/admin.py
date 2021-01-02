from django.contrib import admin

# Register your models here.
from dashboard.models import Contact

from dashboard.models import *


admin.site.register(TagContact)
admin.site.register(NoteContact)
admin.site.register(ThingCommonContact)
admin.site.register(ExperienceContact)
admin.site.register(MusicContact)
admin.site.register(FamilyContact)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "surnames", "owner", "created_at", "active")
    list_filter = ("owner", "active")

