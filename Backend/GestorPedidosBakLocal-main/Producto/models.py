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
class Impuestos(models.Model):
    id_impuesto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2)  # Por ejemplo, 15.00 para un 15%
    
    class Meta:
        managed = True
        db_table = 'impuestos'
        verbose_name = 'Impuesto'
        verbose_name_plural = 'Impuestos'
    
    def __str__(self):
        return f"{self.nombre} ({self.porcentaje}%)"

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey('Categorias', on_delete=models.CASCADE, db_column='id_categoria')
    id_um = models.ForeignKey('UnidadMedida', on_delete=models.CASCADE, db_column='id_um')
    imagenp = models.BinaryField(null=True)
    puntosp = models.DecimalField(max_digits=3, decimal_places=0, default=0)
    codprincipal = models.CharField(max_length=25, null=True)
    nombreproducto = models.CharField(max_length=300)
    descripcionproducto = models.CharField(max_length=300, null=True, blank=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'producto'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
    
    def calcular_impuestos(self):
        precio_base = self.preciounitario
        impuestos = {}
        total_impuestos = Decimal(0)

        # Recuperar los impuestos asociados al producto
        for relacion in self.productoimpuestos_set.all():
            impuesto = relacion.id_impuesto
            impuesto_calculado = precio_base * (impuesto.porcentaje / Decimal(100))
            impuestos[impuesto.nombre] = round(impuesto_calculado, 2)
            total_impuestos += impuesto_calculado

        # Si no hay impuestos, asignar "0"
        if not impuestos:
            total_impuestos = Decimal(0)

        # Calcular precio final
        precio_final = precio_base + total_impuestos
        return {
            'impuestos_detalle': impuestos,
            'total_impuestos': round(total_impuestos, 2),
            'precio_final': round(precio_final, 2)
        }


class ProductoImpuestos(models.Model):
    id_producto = models.ForeignKey(Producto, on_delete=models.CASCADE, db_column='id_producto')
    id_impuesto = models.ForeignKey(Impuestos, on_delete=models.CASCADE, db_column='id_impuesto')
    
    class Meta:
        managed = True
        db_table = 'producto_impuestos'
        unique_together = ('id_producto', 'id_impuesto')
        verbose_name = 'Relación Producto-Impuesto'
        verbose_name_plural = 'Relaciones Producto-Impuestos'
    
    def __str__(self):
        return f"{self.id_producto.nombreproducto} -> {self.id_impuesto.nombre}"

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
