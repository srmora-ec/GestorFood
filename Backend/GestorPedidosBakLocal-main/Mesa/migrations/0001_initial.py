# Generated by Django 5.0.4 on 2024-12-20 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Mesas',
            fields=[
                ('id_mesa', models.AutoField(primary_key=True, serialize=False)),
                ('observacion', models.CharField(blank=True, max_length=500, null=True)),
                ('estado', models.CharField(choices=[('D', 'D'), ('R', 'R'), ('U', 'U'), ('A', 'A')], default='D', max_length=1)),
                ('activa', models.CharField(choices=[('0', '0'), ('1', '1')], default='0', max_length=1)),
                ('maxpersonas', models.SmallIntegerField()),
                ('sestado', models.CharField(max_length=1)),
            ],
            options={
                'db_table': 'mesas',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Reservaciones',
            fields=[
                ('id_reservacion', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_reserva', models.DateField()),
                ('hora_reserva', models.TimeField()),
                ('estado', models.CharField(choices=[('E', 'E'), ('D', 'D'), ('F', 'F')], max_length=1)),
            ],
            options={
                'db_table': 'reservaciones',
                'managed': False,
            },
        ),
    ]
