from django.db import models

# Create your models here.
from phone_field import PhoneField
from django.utils.text import slugify
from accounts.models import User


class Contact(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField()
    surnames = models.TextField()
    city = models.TextField()
    phone = PhoneField(blank=True)

    created = models.DateTimeField(auto_now_add=True)
    url = models.SlugField(blank=True, max_length=255)

    # image_avatar = models.ImageField(upload_to='avatars', blank=True, null=True, verbose_name='Photo')

    def save(self, *args, **kwargs):
        user = User.objects.get(id=self.owner.id)
        print(user)
        user.contacts_created += 1
        user.save()
        self.url = slugify(f"{self.name}-{self.surnames}-{user.contacts_created}")
        super(Contact, self).save(*args, **kwargs)



    def __str__(self):
        return f"({self.owner} - {self.owner_id }) {self.name} {self.surnames}"
