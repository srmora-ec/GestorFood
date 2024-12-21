# Generated by Django 5.0.4 on 2024-12-20 18:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Administrador', '0001_initial'),
        ('Empresa', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DetalleFactura',
            fields=[
                ('id_detallefactura', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.DecimalField(decimal_places=2, max_digits=10)),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('descuento', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'db_table': 'detallefactura',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Detallepedidos',
            fields=[
                ('id_detallepedido', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.DecimalField(decimal_places=65535, max_digits=65535)),
                ('precio_unitario', models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True)),
                ('impuesto', models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True)),
                ('descuento', models.DecimalField(blank=True, decimal_places=2, max_digits=9, null=True)),
            ],
            options={
                'db_table': 'detallepedidos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Factura',
            fields=[
                ('id_factura', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_emision', models.DateTimeField(blank=True, null=True)),
                ('total', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('iva', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('descuento', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('subtotal', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('a_pagar', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('codigo_factura', models.CharField(blank=True, max_length=15, null=True)),
                ('codigo_autorizacion', models.CharField(blank=True, max_length=49, null=True)),
                ('numero_factura_desde', models.CharField(blank=True, max_length=9, null=True)),
                ('numero_factura_hasta', models.CharField(blank=True, max_length=9, null=True)),
                ('estado', models.CharField(blank=True, max_length=1, null=True)),
            ],
            options={
                'db_table': 'factura',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='NotaCredito',
            fields=[
                ('id_notacredito', models.AutoField(primary_key=True, serialize=False)),
                ('id_factura', models.IntegerField()),
                ('fechaemision', models.DateTimeField()),
                ('motivo', models.CharField(max_length=500)),
                ('estado', models.CharField(choices=[('A', 'A'), ('C', 'C')], max_length=1)),
            ],
            options={
                'db_table': 'notacredito',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Pedidos',
            fields=[
                ('id_pedido', models.AutoField(primary_key=True, serialize=False)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=9)),
                ('tipo_de_pedido', models.CharField(max_length=1)),
                ('metodo_de_pago', models.CharField(max_length=1)),
                ('puntos', models.DecimalField(decimal_places=0, max_digits=3)),
                ('fecha_pedido', models.DateTimeField()),
                ('fecha_entrega', models.DateTimeField(blank=True, null=True)),
                ('estado_del_pedido', models.CharField(max_length=1)),
                ('observacion_del_cliente', models.CharField(blank=True, max_length=500, null=True)),
                ('estado_pago', models.CharField(blank=True, max_length=100, null=True)),
                ('imagen', models.BinaryField(blank=True, null=True)),
            ],
            options={
                'db_table': 'pedidos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Pedidosmesa',
            fields=[
                ('id_pmesa', models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'pedidosmesa',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Meseros',
            fields=[
                ('id_mesero', models.AutoField(primary_key=True, serialize=False)),
                ('telefono', models.CharField(max_length=10)),
                ('apellido', models.CharField(max_length=300)),
                ('nombre', models.CharField(max_length=300)),
                ('fecha_registro', models.DateTimeField()),
                ('sestado', models.CharField(max_length=1)),
                ('id_administrador', models.ForeignKey(db_column='id_administrador', on_delete=django.db.models.deletion.DO_NOTHING, to='Administrador.administrador')),
                ('id_cuenta', models.ForeignKey(blank=True, db_column='id_cuenta', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('id_sucursal', models.ForeignKey(db_column='id_sucursal', on_delete=django.db.models.deletion.DO_NOTHING, to='Empresa.sucursales')),
            ],
            options={
                'db_table': 'meseros',
                'managed': True,
            },
        ),
    ]
