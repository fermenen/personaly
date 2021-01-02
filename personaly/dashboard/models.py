from django.db import models

from phone_field import PhoneField
from django.utils.text import slugify
from accounts.models import User
import os
from uuid import uuid4
from PIL import Image
import uuid
from django.utils.translation import ugettext_lazy as _


class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField()
    surnames = models.TextField()
    location = models.TextField(blank=True)
    phone = PhoneField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    url = models.SlugField(blank=True, max_length=255)
    image_contact = models.ImageField(blank=True, upload_to='images_contacts', null=True, verbose_name='imagecontact')
    active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        user = User.objects.get(id=self.owner.id)
        self.url = slugify(f"{self.name}-{self.surnames}-{user.contacts_created}")
        if self.image_contact:
            self.image_contact = self.get_transform_image()
        super(Contact, self).save(*args, **kwargs)

    def get_transform_image(self):
        basewidth = 400
        quality = 75
        img = Image.open(self.image_contact)
        wpercent = (basewidth / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img_new = img.resize((basewidth, hsize))
        image_name = '{}.{}'.format(uuid4().hex, 'jpg')
        img_new.save(os.path.join('media/images_contacts', image_name), quality=quality, optimize=True)
        return os.path.join('/images_contacts', image_name)

    def __str__(self):
        return f"{self.name} {self.surnames}"


class TagContact(models.Model):
    icon = models.CharField(blank=False, max_length=10)
    text = models.TextField(blank=False, max_length=20)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)

    def __str__(self):
        return f"({self.icon} - {self.text})"


class NoteContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)


class ThingCommonContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
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

    def get_list_tags(self):
        return self.tags.split(";")

    def __str__(self):
        return f"{self.name_artist} - CONTACT({self.contact}) - OWNER({self.owner})"


class ExperienceContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    tittle = models.TextField()
    location = models.TextField()
    date = models.DateTimeField(blank=True)
    list_photos = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def get_list_photos(self):
        return self.list_photos.split(";")


class FamilyContact(models.Model):
    relation_choices = (
        (_('Relaciones amorosas'), (
            ('001', _('Esposo / esposa')),
            ('002', _('Amante')),
            ('003', _('Ex - novio / novia')),
        )
         ),
        ('Relaciones familiares', (
            ('4', 'hijo / hija'),
            ('5', 'hermano / hermana'),
            ('6', 'abuelo / abuela'),
            ('7', 'nieto / nieta'),
            ('8', 'tío / tía'),
            ('9', 'sobrino / sobrina'),
            ('10', 'primo / prima'),
            ('11', 'padrino / madrina'),
            ('12', 'ahijado / ahijada'),
            ('13', 'padrastro / madrastra'),
            ('14', 'hijastro / hijastra'),
        )
         ),
        ('Relaciones de amistad', (
            ('15', 'amigo / amiga'),
            ('16', 'mejor amigo / amiga'),
            ('17', 'ex - novio'),
        )
         ),
        ('Relaciones de laborales', (
            ('18', 'compañero / compañera'),
            ('19', 'jefe / jefa'),
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

