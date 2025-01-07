from django.db import models
from Empresa.models import Sucursales, Horariossemanales
from decimal import Decimal

class TiposProductos(models.Model):
    id_tipoproducto = models.AutoField(primary_key=True)
    tpnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)
    sestado = models.CharField(max_length=1)
    class Meta: 
        managed = True
        db_table = 'tiposproductos'
class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(null=True)
    id_tipoproducto = models.ForeignKey(TiposProductos, on_delete=models.CASCADE, db_column='id_tipoproducto')
    catnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)
    sestado = models.CharField(max_length=1)
    mostracliente=models.BooleanField(default=False)
    class Meta: 
        managed = True
        db_table = 'categorias'
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey('Categorias', on_delete=models.CASCADE, db_column='id_categoria')
    id_um = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE,db_column='id_um')
    imagenp = models.BinaryField(null=True)
    puntosp = models.DecimalField(max_digits=3, decimal_places=0,default=0)
    codprincipal = models.CharField(max_length=25, null=True)
    nombreproducto = models.CharField(max_length=300)
    descripcionproducto = models.CharField(max_length=300, null=True, blank=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2)
    iva = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    ice = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    irbpnr = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'producto'
    def calcular_impuestos(self):
        # Precio unitario con todos los impuestos aplicados
        precio_base = self.preciounitario

        # Factores de impuestos en un diccionario
        impuestos_factor = {
            'iva': Decimal(1.15) if self.iva else Decimal(1),
            'ice': Decimal(1.50) if self.ice else Decimal(1),
            'irbpnr': Decimal(1.10) if self.irbpnr else Decimal(1)
        }

        # Factor total de impuestos
        impuesto_factor = impuestos_factor['iva'] * impuestos_factor['ice'] * impuestos_factor['irbpnr']

        # Calcular el precio base sin impuestos
        precio_base_sin_impuestos = precio_base / impuesto_factor

        # Calcular los impuestos individuales
        impuestos = {}
        for impuesto, factor in impuestos_factor.items():
            if factor != Decimal(1):
                impuestos[impuesto] = round(precio_base * (factor - 1), 2)

        return impuestos

class UnidadMedida(models.Model):
    idum = models.AutoField(primary_key=True)
    nombreum = models.CharField(max_length=100, null=False)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'unidadmedida'
class EnsambleUnidadMedida(models.Model):
    ideum = models.AutoField(primary_key=True)
    idump = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE, db_column='idump', related_name='ensambles_idump')
    idumc = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE, db_column='idumc', related_name='ensambles_idumc')
    cantidadconversion = models.DecimalField(max_digits=12, decimal_places=6)

    class Meta:
        managed = True
        db_table = 'ensambleunidadmedida'


class Componente(models.Model):
    id_componente = models.AutoField(primary_key=True, db_column='id_componente')
    nombre = models.CharField(max_length=255)
    id_categoria = models.ForeignKey('Categorias', on_delete=models.CASCADE, db_column='id_categoria')
    descripcion = models.TextField(null=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=100)
    id_um = models.ForeignKey(UnidadMedida, on_delete=models.CASCADE, db_column='id_um')
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'componente'

class EnsambleComponente(models.Model):
    id_ensamblec = models.AutoField(primary_key=True)
    id_componentepadre = models.ForeignKey('Componente', on_delete=models.CASCADE, db_column='id_componentepadre')
    padrecantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_umpadre = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE,db_column='id_umpadre')

    class Meta:
        managed = True
        db_table = 'ensamblecomponente'

class DetalleEnsambleComponente(models.Model):
    id_detalleensamblec = models.AutoField(primary_key=True)
    id_ensamblec = models.ForeignKey('EnsambleComponente', on_delete=models.CASCADE, db_column='id_ensamblec')
    id_componentehijo = models.ForeignKey('Componente', on_delete=models.CASCADE, db_column='id_componentehijo')
    cantidadhijo = models.DecimalField(max_digits=9, decimal_places=2)
    id_umhijo = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE,db_column='id_umhijo')

    class Meta:
        managed = True
        db_table = 'detalleensamblecomponente'
        
class EnsambleProducto(models.Model):
    id_emsamblep = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE, db_column='id_producto')
    padrecantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_um = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE, db_column='id_um')

    class Meta:
        managed = True
        db_table = 'ensambleproducto'

class DetalleEnsambleProducto(models.Model):
    id_detalleensamblep = models.AutoField(primary_key=True)
    id_emsamblep = models.ForeignKey('EnsambleProducto', on_delete=models.CASCADE, db_column='id_emsamblep')
    id_componentehijo = models.ForeignKey('Componente', on_delete=models.CASCADE, db_column='id_componentehijo')
    cantidadhijo = models.DecimalField(max_digits=9, decimal_places=2)
    id_umhijo = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE, db_column='id_umhijo')

    class Meta:
        managed = True
        db_table = 'detalleensambleproducto'


class CategoriasCombos(models.Model):
    id_catcombo = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(null=True)
    catnombre = models.CharField(max_length=300, null=False)
    descripcion = models.CharField(max_length=500, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'categoriascombo'

class Combo(models.Model):
    id_combo = models.AutoField(primary_key=True)
    id_catcombo = models.ForeignKey(CategoriasCombos, on_delete=models.CASCADE, db_column='id_catcombo')
    imagenc = models.BinaryField(null=True)
    puntoscb = models.DecimalField(max_digits=3, decimal_places=0, null=True)
    codprincipal = models.CharField(max_length=25, null=False)
    nombrecb = models.CharField(max_length=300, null=True)
    descripcioncombo = models.CharField(max_length=300, null=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2, null=False)
    iva = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    ice = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    irbpnr = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1')], null=False)
    sestado = models.CharField(max_length=1),

    class Meta:
        managed = True
        db_table = 'combo'
class DetalleCombo(models.Model):
    id_detallecombo = models.AutoField(primary_key=True)
    id_combo = models.ForeignKey(Combo, on_delete=models.CASCADE, db_column='id_combo')
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='id_producto')
    cantidad = models.IntegerField()
    class Meta:
        managed = True
        db_table = 'detallecombo'


# class HorarioProducto(models.Model):
#     id_horarioproducto = models.AutoField(primary_key=True, db_column='id_horarioproducto')
#     id_horarios = models.ForeignKey(Horariossemanales, on_delete=models.CASCADE, db_column='id_horarios')
#     id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE, db_column='id_sucursal')
#     id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='id_producto')

#     class Meta:
#         managed = False
#         db_table = 'horarioproducto'
