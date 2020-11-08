from django.db import models

from phone_field import PhoneField
from django.utils.text import slugify
from accounts.models import User
import os
from uuid import uuid4
from PIL import Image


class Contact(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField()
    surnames = models.TextField()
    city = models.TextField()
    phone = PhoneField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    url = models.SlugField(blank=True, max_length=255)

    image_contact = models.ImageField(upload_to='images_contacts', blank=True, null=True, verbose_name='imagecontact', default='images_contacts/placeholder.jpg')

    def save(self, *args, **kwargs):
        user = User.objects.get(id=self.owner.id)
        user.contacts_created += 1
        user.save()
        self.url = slugify(f"{self.name}-{self.surnames}-{user.contacts_created}")
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
        return f"({self.owner} - {self.owner_id}) {self.name} {self.surnames}"


