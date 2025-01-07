from django.db import models
from Empresa.models import Sucursales

# Create your models here.
class Bodegas(models.Model):
    id_bodega = models.AutoField(primary_key=True)
    nombrebog = models.CharField(max_length=300)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE, db_column='id_sucursal')
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = True
        db_table = 'bodegas'