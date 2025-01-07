# Generated by Django 5.1.4 on 2025-01-07 02:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Administrador', '0001_initial'),
        ('Cliente', '0001_initial'),
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
                ('id_administrador', models.ForeignKey(db_column='id_administrador', on_delete=django.db.models.deletion.CASCADE, to='Administrador.administrador')),
            ],
            options={
                'db_table': 'mesas',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Reservaciones',
            fields=[
                ('id_reservacion', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_reserva', models.DateField()),
                ('hora_reserva', models.TimeField()),
                ('estado', models.CharField(choices=[('E', 'E'), ('D', 'D'), ('F', 'F')], max_length=1)),
                ('id_cliente', models.ForeignKey(db_column='id_cliente', on_delete=django.db.models.deletion.CASCADE, to='Cliente.clientes')),
                ('id_mesa', models.ForeignKey(db_column='id_mesa', on_delete=django.db.models.deletion.CASCADE, to='Mesa.mesas')),
            ],
            options={
                'db_table': 'reservaciones',
                'managed': True,
            },
        ),
    ]
