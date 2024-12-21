from django.db import models
from Empresa.models import Sucursales
from Administrador.models import Administrador
from Login.models import Cuenta

# Create your models here.
class JefeCocina(models.Model):
    id_jefecocina = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey(Sucursales, on_delete=models.CASCADE,db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, on_delete=models.CASCADE,db_column='id_administrador')
    nombre = models.CharField(max_length=300)
    apellido = models.CharField(max_length=300)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE,db_column='id_cuenta')
    sestado = models.CharField(max_length=1)
    class Meta:
        managed = True
        db_table = 'jefecocina'