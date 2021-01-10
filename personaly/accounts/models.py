from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # username = None
    email = models.EmailField('email address', unique=True)

    validated_mail = models.BooleanField(default=False)
    code_validated_mail = models.SmallIntegerField(blank=True, null=True)

    contacts_created = models.IntegerField(default=0, editable=False)

    contacts_active = models.IntegerField(default=0, editable=False)
    note_active = models.IntegerField(default=0, editable=False)
    common_active = models.IntegerField(default=0, editable=False)
    music_active = models.IntegerField(default=0, editable=False)
    family_active = models.IntegerField(default=0, editable=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.id} - {self.email} "
