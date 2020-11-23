from django.contrib import admin

# Register your models here.
from dashboard.models import Contact

from dashboard.models import TagContact, NoteContact


admin.site.register(TagContact)

admin.site.register(NoteContact)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "surnames", "owner", "created_at", "active")
    list_filter = ("owner", "active")

