# Generated by Django 3.1.6 on 2021-02-21 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0009_auto_20210220_2006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experiencecontact',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images', to='dashboard.ImageModel'),
        ),
    ]
