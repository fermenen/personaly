from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField('email address', unique=True)

    contacts_created = models.IntegerField(default=0)

    validated_mail = models.BooleanField(default=False)
    code_validated_mail = models.SmallIntegerField(blank=True, null=True)



    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.id} - {self.email} "
