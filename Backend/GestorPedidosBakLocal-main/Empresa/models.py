from django.db import models
from Ubicaciones.models import Ubicaciones, Geosectores, DetalleGeosector
from Login.models import Cuenta

class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    enombre = models.CharField(max_length=200,default="Nombre de Empresa")
    direccion = models.CharField(max_length=300, blank=True, null=True)
    etelefono = models.CharField(max_length=10, blank=True, null=True)
    correoelectronico = models.CharField(max_length=256, blank=True, null=True)
    fechafundacion = models.DateField()
    sitioweb = models.CharField(max_length=2000, blank=True, null=True)
    eslogan = models.CharField(max_length=300, blank=True, null=True)
    elogo = models.BinaryField(blank=True, null=True)
    edescripcion = models.CharField(max_length=800, blank=True, null=True)
    docmenu = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'empresa'
    
    def crear_sucursal(self, srazon_social, sruc, sestado, scorreo, sdireccion, id_horarios=None, 
                       id_geosector=None, stelefono=None, scapacidad=None, snombre=None, 
                       firmaelectronica=None, id_ubicacion=None, imagensucursal=None, id_cuenta=None):
        """
        Método para crear una sucursal asociada a esta empresa.
        """
        
        sucursal = Sucursales.objects.create(
            srazon_social=srazon_social,
            sruc=sruc,
            sestado=sestado,
            scorreo=scorreo,
            sdireccion=sdireccion,
            id_horarios=id_horarios,
            id_geosector=id_geosector,
            stelefono=stelefono,
            scapacidad=scapacidad,
            snombre=snombre,
            firmaelectronica=firmaelectronica,
            id_empresa=self,
            id_ubicacion=id_ubicacion,
            imagensucursal=imagensucursal,
            id_cuenta=id_cuenta
        )
        return sucursal
# Create your models here.
class Horariossemanales(models.Model):
    id_horarios = models.AutoField(primary_key=True)
    hordescripcion = models.CharField(max_length=500, blank=True, null=True)
    tipohorario = models.CharField(max_length=1)
    nombreh = models.CharField(max_length=200)

    class Meta:
        managed = True
        db_table = 'horariossemanales'
class DetalleHorariosSemanales(models.Model):
    id_dethorarios = models.AutoField(primary_key=True)
    id_horarios =models.ForeignKey(Horariossemanales, on_delete=models.CASCADE, db_column='id_horarios')
    dia = models.CharField(max_length=1, choices=[('L', 'Lunes'), ('M', 'Martes'), ('X', 'Miércoles'), ('J', 'Jueves'), ('V', 'Viernes'), ('S', 'Sábado'), ('D', 'Domingo')])
    horainicio = models.TimeField()
    horafin = models.TimeField()

    class Meta:
        managed = True
        db_table = 'detallehorariossemanales'
class Sucursales(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    srazon_social = models.CharField(max_length=300)
    sruc = models.CharField(max_length=20)
    sestado = models.CharField(max_length=1)
    scapacidad = models.CharField(max_length=1, blank=True, null=True)
    scorreo = models.CharField(max_length=300)
    stelefono = models.CharField(max_length=300, blank=True, null=True)
    sdireccion = models.CharField(max_length=300)
    snombre = models.CharField(max_length=300, blank=True, null=True)
    fsapertura = models.DateTimeField(auto_now_add=True)
    id_horarios = models.ForeignKey(Horariossemanales, on_delete=models.CASCADE, db_column='id_horarios',related_name='sucursales_horarios',null=True)
    id_geosector = models.ForeignKey(Geosectores, models.DO_NOTHING, db_column='id_geosector', blank=True, null=True,related_name='sucursales_geosector')
    firmaelectronica = models.BinaryField(blank=True, null=True)
    id_empresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='id_empresa',related_name='sucursales_empresa')
    id_ubicacion = models.ForeignKey(Ubicaciones, models.DO_NOTHING, db_column='id_ubicacion', blank=True, null=True,related_name='sucursales_ubicacion')
    imagensucursal = models.BinaryField(blank=True, null=True)
    id_cuenta = models.ForeignKey(Cuenta, on_delete=models.CASCADE, null=True,related_name='sucursales_cuenta')

    class Meta: 
        managed = True
        db_table = 'sucursales'
    def agg_ubicacion(self,latitudx, longitudx):
        """
        Método para crear una sucursal asociada a esta empresa.
        """
        ubicacion = Ubicaciones.objects.create(latitud=latitudx, longitud=longitudx,sestado=1) if latitudx is not None and longitudx is not None else None
        self.id_ubicacion=ubicacion
        self.save()
        return ubicacion
    
    def crear_geosector(self, secnombre, secdescripcion, datos_geosector):
        """
        Método para crear un geosector asociado a esta sucursal.
        """
        from django.utils import timezone
        geosector = Geosectores.objects.create(
            secnombre=secnombre,
            secdescripcion=secdescripcion,
            fechacreaciong=timezone.now(),
            secestado=1,
            sectipo='C',
            sestado=1
        )
        geosector.save()

        # Crear ubicaciones asociadas al geosector
        for ubicacion_data in datos_geosector:
            ubicacion = Ubicaciones.objects.create(
                latitud=ubicacion_data['latitude'],
                longitud=ubicacion_data['longitude'],
                sestado=1
            )
            DetalleGeosector.objects.create(
                id_geosector=geosector,
                id_ubicacion=ubicacion
            )
        geosector.save()
        self.id_geosector=geosector
        self.save()

        return geosector

