# Generated by Django 3.1.4 on 2021-01-02 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0020_auto_20210101_2107'),
    ]

    operations = [
        migrations.AlterField(
            model_name='familycontact',
            name='relation_type',
            field=models.CharField(choices=[('Relaciones amorosas', (('001', 'Esposo / esposa'), ('002', 'Amante'), ('003', 'Ex - novio / novia'))), ('Relaciones familiares', (('4', 'hijo / hija'), ('5', 'hermano / hermana'), ('6', 'abuelo / abuela'), ('7', 'nieto / nieta'), ('8', 'tío / tía'), ('9', 'sobrino / sobrina'), ('10', 'primo / prima'), ('11', 'padrino / madrina'), ('12', 'ahijado / ahijada'), ('13', 'padrastro / madrastra'), ('14', 'hijastro / hijastra'))), ('Relaciones de amistad', (('15', 'amigo / amiga'), ('16', 'mejor amigo / amiga'), ('17', 'ex - novio'))), ('Relaciones de laborales', (('18', 'compañero / compañera'), ('19', 'jefe / jefa')))], max_length=3),
        ),
    ]
