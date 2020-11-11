from django.contrib import admin

# Register your models here.
from dashboard.models import Contact

from dashboard.models import TagContact

admin.site.register(Contact)
admin.site.register(TagContact)
