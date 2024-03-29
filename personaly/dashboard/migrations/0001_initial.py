# Generated by Django 3.1.4 on 2021-02-03 11:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import encrypted_fields.fields
import phone_field.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', encrypted_fields.fields.EncryptedTextField(max_length=200)),
                ('surnames', encrypted_fields.fields.EncryptedTextField(blank=True, max_length=200)),
                ('image_contact', encrypted_fields.fields.EncryptedTextField(blank=True, null=True)),
                ('location', encrypted_fields.fields.EncryptedTextField(blank=True, null=True)),
                ('phone', phone_field.models.PhoneField(blank=True, max_length=31)),
                ('email', encrypted_fields.fields.EncryptedEmailField(blank=True, max_length=254, null=True)),
                ('birthday', encrypted_fields.fields.EncryptedDateField(blank=True, null=True)),
                ('remember_birthday', models.BooleanField(default=False)),
                ('keep_in_touch', models.CharField(choices=[('001', 'Cada semana'), ('001', 'Cada dos semana'), ('003', 'Una vez al mes'), ('004', 'Cada dos meses'), ('000', 'No recordar')], max_length=3)),
                ('url', models.SlugField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ThingCommonContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TagContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('icon', models.CharField(max_length=10)),
                ('text', models.TextField(max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact_tag', to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ReminderContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.TextField(max_length=255)),
                ('completed', models.BooleanField(default=False)),
                ('deadline', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact', to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='NoteContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', encrypted_fields.fields.EncryptedTextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MusicContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id_artist', models.TextField(blank=True)),
                ('name_artist', models.TextField()),
                ('photo_artist', models.TextField(blank=True)),
                ('url_artist', models.TextField(blank=True)),
                ('tags', models.TextField(blank=True)),
                ('popularity', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FamilyContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('name', models.TextField()),
                ('surnames', models.TextField(blank=True)),
                ('relation_type', models.CharField(choices=[('Relaciones amorosas', (('001', 'Esposo / esposa'), ('002', 'Amante'), ('003', 'Ex - novio / novia'))), ('Relaciones familiares', (('4', 'Hijo / hija'), ('5', 'Hermano / hermana'), ('6', 'Abuelo / abuela'), ('7', 'Nieto / nieta'), ('8', 'Tío / tía'), ('9', 'Sobrino / sobrina'), ('10', 'Primo / prima'), ('11', 'Padrino / madrina'), ('12', 'Ahijado / ahijada'), ('13', 'Padrastro / madrastra'), ('14', 'Hijastro / hijastra'))), ('Relaciones de amistad', (('15', 'Amigo / amiga'), ('16', 'Mejor amigo / amiga'), ('17', 'Ex - novio'))), ('Relaciones de laborales', (('18', 'Compañero / compañera'), ('19', 'Jefe / jefa')))], max_length=3)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ExperienceContact',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('tittle', models.TextField()),
                ('location', models.TextField()),
                ('date', models.DateTimeField(blank=True)),
                ('list_photos', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('active', models.BooleanField(default=True)),
                ('contact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.contact')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
