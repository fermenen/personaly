# Generated by Django 3.1.4 on 2021-01-10 10:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0028_auto_20210110_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='remember_birthday',
            field=models.BooleanField(null=True),
        ),
    ]
