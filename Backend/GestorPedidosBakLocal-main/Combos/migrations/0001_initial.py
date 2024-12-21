# Generated by Django 5.0.4 on 2024-12-20 18:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Producto', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoriasCombos',
            fields=[
                ('id_catcombo', models.AutoField(primary_key=True, serialize=False)),
                ('imagencategoria', models.BinaryField(null=True)),
                ('catnombre', models.CharField(max_length=300)),
                ('descripcion', models.CharField(max_length=500, null=True)),
                ('sestado', models.CharField(max_length=1)),
            ],
            options={
                'db_table': 'categoriascombos',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Combo',
            fields=[
                ('id_combo', models.AutoField(primary_key=True, serialize=False)),
                ('imagenc', models.BinaryField(null=True)),
                ('puntoscb', models.DecimalField(decimal_places=0, max_digits=3, null=True)),
                ('codprincipal', models.CharField(max_length=25)),
                ('nombrecb', models.CharField(max_length=300, null=True)),
                ('descripcioncombo', models.CharField(max_length=300, null=True)),
                ('preciounitario', models.DecimalField(decimal_places=2, max_digits=14)),
                ('iva', models.CharField(choices=[('0', '0'), ('1', '1')], max_length=1)),
                ('ice', models.CharField(choices=[('0', '0'), ('1', '1')], max_length=1)),
                ('irbpnr', models.CharField(choices=[('0', '0'), ('1', '1')], max_length=1)),
                ('id_catcombo', models.ForeignKey(db_column='id_catcombo', on_delete=django.db.models.deletion.CASCADE, to='Combos.categoriascombos')),
            ],
            options={
                'db_table': 'combos',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='DetalleCombo',
            fields=[
                ('id_detallecombo', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField()),
                ('id_combo', models.ForeignKey(db_column='id_combo', on_delete=django.db.models.deletion.CASCADE, to='Combos.combo')),
                ('id_producto', models.ForeignKey(db_column='id_producto', on_delete=django.db.models.deletion.CASCADE, to='Producto.producto')),
            ],
            options={
                'db_table': 'detallecombos',
                'managed': True,
            },
        ),
    ]
