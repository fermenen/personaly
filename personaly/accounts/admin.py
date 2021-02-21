from django.contrib import admin

from accounts.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id", "first_name", "last_name", "email", "contacts_created", "contacts_active", "note_active", "common_active",
        "music_active", "experience_active", "family_active", "date_joined", "last_login", "is_active",
        'validated_mail')
    ist_filter = ("is_active",)
