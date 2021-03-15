from django.contrib import admin

from dashboard.models import Contact, ThingCommonContact, MusicContact, FamilyContact, TagContact, NoteContact, \
    ExperienceContact, ReminderContact, ImageModel

admin.site.register(TagContact)
admin.site.register(ExperienceContact)
admin.site.register(ImageModel)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "surnames", "created_at", "active", "owner")
    list_filter = ("owner", "active")


@admin.register(ReminderContact)
class ReminderContact(admin.ModelAdmin):
    list_display = ("id", "text", "completed", "type", "deadline", "created_at", "active", "owner")
    list_filter = ("owner", "active", "completed", "recursive")


@admin.register(NoteContact)
class NoteContact(admin.ModelAdmin):
    list_display = ("id", "text", "created_at", "active", "owner")
    list_filter = ("owner", "active")


@admin.register(ThingCommonContact)
class CommonAdmin(admin.ModelAdmin):
    list_display = ("id", "text", "created_at", "active", "contact", "owner")
    list_filter = ("owner", "active")


@admin.register(MusicContact)
class MusicAdmin(admin.ModelAdmin):
    list_display = ("id", "id_artist", "name_artist", "created_at", "active", "contact", "owner")
    list_filter = ("owner", "active")


@admin.register(FamilyContact)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ("id", "relation_type", "created_at", "active", "contact", "owner")
    list_filter = ("owner", "active")
