# Generated by Django 3.1.4 on 2021-01-10 10:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0024_auto_20210109_1401'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='birthday',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='contact',
            name='image_contact',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='contact',
            name='location',
            field=models.TextField(null=True),
        ),
    ]
