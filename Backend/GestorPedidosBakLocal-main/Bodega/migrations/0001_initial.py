# Generated by Django 5.1.4 on 2025-01-07 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bodegas',
            fields=[
                ('id_bodega', models.AutoField(primary_key=True, serialize=False)),
                ('nombrebog', models.CharField(max_length=300)),
                ('descripcion', models.CharField(blank=True, max_length=500, null=True)),
                ('sestado', models.CharField(max_length=1)),
            ],
            options={
                'db_table': 'bodegas',
                'managed': True,
            },
        ),
    ]
