from django.db import models

from phone_field import PhoneField
from datetime import date
from django.utils.text import slugify
from accounts.models import User
import uuid
from django.utils.translation import ugettext_lazy as _
from encrypted_fields import fields


class ImageModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)


class Contact(models.Model):
    in_touch = [
        ('001', _('Cada semana')),
        ('001', _('Cada dos semana')),
        ('003', _('Una vez al mes')),
        ('004', _('Cada dos meses')),
        ('000', _('No recordar')),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = fields.EncryptedTextField(max_length=200)
    surnames = fields.EncryptedTextField(blank=True, max_length=200)
    image_contact = fields.EncryptedTextField(blank=True, null=True)
    location = fields.EncryptedTextField(blank=True, null=True)
    phone = PhoneField(blank=True)
    email = fields.EncryptedEmailField(blank=True, null=True)
    birthday = fields.EncryptedDateField(blank=True, null=True)
    remember_birthday = models.BooleanField(default=False)
    keep_in_touch = models.CharField(max_length=3, choices=in_touch)
    url = models.SlugField(blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        user = User.objects.get(id=self.owner.id)
        self.url = slugify(f"{self.name}-{self.surnames}-{user.contacts_created}")
        super(Contact, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} {self.surnames}"


class ReminderContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField(blank=False, max_length=255)
    completed = models.BooleanField(default=False)
    deadline = models.DateField(blank=True, null=True)
    contact = models.ForeignKey(Contact, related_name='contact', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    @property
    def days(self):
        if self.deadline is not None:
            return (self.deadline - date.today()).days
        else:
            return None

    @property
    def past(self):
        if self.deadline is not None:
            return self.days < 0
        else:
            return None

    @property
    def today(self):
        if self.deadline is not None:
            return self.days == 0
        else:
            return None

    @property
    def future(self):
        if self.deadline is not None:
            return self.days > 0
        else:
            return None


class TagContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.CharField(blank=False, max_length=10)
    text = models.TextField(blank=False, max_length=20)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, related_name='contact_tag', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def delete(self, using=None, keep_parents=False):
        self.active = False
        self.save()

    def __str__(self):
        return f"({self.icon} - {self.text})"


class NoteContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = fields.EncryptedTextField()
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)


class ThingCommonContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField()
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.text} - {self.contact} - {self.owner}"


class ExperienceContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    tittle = models.TextField()
    location = models.TextField()
    date = models.DateField(blank=True)
    images = models.ManyToManyField(ImageModel, related_name='images', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)


class MusicContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    id_artist = models.TextField(blank=True)
    name_artist = models.TextField()
    photo_artist = models.TextField(blank=True)
    url_artist = models.TextField(blank=True)
    tags = models.TextField(blank=True)
    popularity = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    @property
    def get_list_tags(self):
        return self.tags.split(";")

    def __str__(self):
        return f"{self.name_artist} - CONTACT({self.contact}) - OWNER({self.owner})"


# Family Contact_001 Model
class FamilyContact(models.Model):
    relation_choices = (
        (_('Relaciones amorosas'), (
            ('001', _('Esposo / esposa')),
            ('002', _('Amante')),
            ('003', _('Ex - novio / novia')),
        )
         ),
        (_('Relaciones familiares'), (
            ('4', _('Hijo / hija')),
            ('5', _('Hermano / hermana')),
            ('6', _('Abuelo / abuela')),
            ('7', _('Nieto / nieta')),
            ('8', _('Tío / tía')),
            ('9', _('Sobrino / sobrina')),
            ('10', _('Primo / prima')),
            ('11', _('Padrino / madrina')),
            ('12', _('Ahijado / ahijada')),
            ('13', _('Padrastro / madrastra')),
            ('14', _('Hijastro / hijastra')),
        )
         ),
        (_('Relaciones de amistad'), (
            ('15', _('Amigo / amiga')),
            ('16', _('Mejor amigo / amiga')),
            ('17', _('Ex - novio')),
        )
         ),
        (_('Relaciones de laborales'), (
            ('18', _('Compañero / compañera')),
            ('19', _('Jefe / jefa')),
        )
         )
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)
    name = models.TextField()
    surnames = models.TextField(blank=True)
    relation_type = models.CharField(max_length=3, choices=relation_choices)

    @property
    def relation_name(self):
        return self.get_relation_type_display()
