# Generated by Django 3.1.3 on 2020-11-23 16:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dashboard', '0010_thingcommoncontact'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperienceContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('tittle', models.TextField()),
                ('location', models.TextField()),
                ('date', models.DateTimeField(blank=True)),
                ('list_photos', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
