# Generated by Django 3.1.3 on 2020-11-14 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_auto_20201114_1109'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='image_contact',
            field=models.ImageField(blank=True, null=True, upload_to='images_contacts', verbose_name='imagecontact'),
        ),
    ]