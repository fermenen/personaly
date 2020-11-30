from django.contrib import admin

from accounts.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "email", "contacts_created", "date_joined", "last_login",
                    "is_active", 'validated_mail', 'code_validated_mail')
    ist_filter = ("is_active",)

