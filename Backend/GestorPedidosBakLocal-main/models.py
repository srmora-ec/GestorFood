# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models



class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Avisosprincipales(models.Model):
    id_aviso = models.AutoField(primary_key=True)
    id_empresa = models.ForeignKey('Empresa', models.DO_NOTHING, db_column='id_empresa')
    titulo = models.CharField(max_length=150)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    imagen = models.BinaryField()
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'avisosprincipales'


class Bodegas(models.Model):
    id_bodega = models.AutoField(primary_key=True)
    nombrebog = models.CharField(max_length=300)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'bodegas'


class Casillero(models.Model):
    id_casillero = models.AutoField(primary_key=True)
    id_motorizado = models.ForeignKey('Motorizados', models.DO_NOTHING, db_column='id_motorizado', blank=True, null=True)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    nombre = models.CharField(max_length=300)
    fecha_creacion = models.DateTimeField()
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    cantidad_actual = models.DecimalField(max_digits=9, decimal_places=2)
    caja = models.CharField(max_length=1)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'casillero'


class Categorias(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(blank=True, null=True)
    id_tipoproducto = models.ForeignKey('Tiposproductos', models.DO_NOTHING, db_column='id_tipoproducto')
    catnombre = models.CharField(max_length=300)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'categorias'


class Categoriascombos(models.Model):
    id_catcombo = models.AutoField(primary_key=True)
    imagencategoria = models.BinaryField(blank=True, null=True)
    catnombre = models.CharField(unique=True, max_length=300)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'categoriascombos'


class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    crazon_social = models.CharField(max_length=300, blank=True, null=True)
    ctelefono = models.CharField(unique=True, max_length=300)
    tipocliente = models.CharField(max_length=2, blank=True, null=True)
    cregistro = models.DateTimeField()
    snombre = models.CharField(max_length=300, blank=True, null=True)
    capellido = models.CharField(max_length=300, blank=True, null=True)
    cpuntos = models.DecimalField(max_digits=3, decimal_places=0)
    id_ubicacion1 = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion1', blank=True, null=True)
    id_ubicacion2 = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion2', related_name='clientes_id_ubicacion2_set', blank=True, null=True)
    id_ubicacion3 = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion3', related_name='clientes_id_ubicacion3_set', blank=True, null=True)
    id_cuenta = models.ForeignKey('Cuenta', models.DO_NOTHING, db_column='id_cuenta', blank=True, null=True)
    ruc_cedula = models.CharField(unique=True, max_length=300, blank=True, null=True)
    ccorreo_electronico = models.CharField(max_length=300, blank=True, null=True)
    ubicacion = models.CharField(max_length=300, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'clientes'


class Codigoautorizacion(models.Model):
    id_codigosauto = models.AutoField(primary_key=True)
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador', blank=True, null=True)
    codigo_autorizacion = models.CharField(max_length=49, blank=True, null=True)
    fecha_vencimiento = models.DateField(blank=True, null=True)
    fecha_autorizacion = models.DateField(blank=True, null=True)
    ruc = models.CharField(max_length=13, blank=True, null=True)
    nombre = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'codigoautorizacion'


class Codigosri(models.Model):
    id_codigosri = models.AutoField(primary_key=True)
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador', blank=True, null=True)
    numero_factura_desde = models.CharField(max_length=9, blank=True, null=True)
    numero_factura_hasta = models.CharField(max_length=9, blank=True, null=True)
    rango_desde = models.CharField(max_length=9, blank=True, null=True)
    rango_hasta = models.CharField(max_length=9, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'codigosri'
        unique_together = (('numero_factura_desde', 'numero_factura_hasta'),)


class Combo(models.Model):
    id_combo = models.AutoField(primary_key=True)
    id_catcombo = models.ForeignKey(Categoriascombos, models.DO_NOTHING, db_column='id_catcombo')
    imagenc = models.BinaryField(blank=True, null=True)
    puntoscb = models.DecimalField(max_digits=3, decimal_places=0, blank=True, null=True)
    codprincipal = models.CharField(max_length=25)
    nombrecb = models.CharField(max_length=300, blank=True, null=True)
    descripcioncombo = models.CharField(max_length=300, blank=True, null=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2)
    iva = models.CharField(max_length=1)
    ice = models.CharField(max_length=1)
    irbpnr = models.CharField(max_length=1)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'combo'


class Componente(models.Model):
    id_componente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=300)
    id_categoria = models.ForeignKey(Categorias, models.DO_NOTHING, db_column='id_categoria')
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    costo = models.TextField(blank=True, null=True)  # This field type is a guess.
    tipo = models.CharField(max_length=1)
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um')
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'componente'


class Compras(models.Model):
    id_compra = models.AutoField(primary_key=True)
    id_proveedor = models.ForeignKey('Proveedores', models.DO_NOTHING, db_column='id_proveedor')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    fechacompra = models.DateTimeField()
    id_procesamiento = models.ForeignKey('Procesamiento', models.DO_NOTHING, db_column='id_procesamiento')

    class Meta:
        managed = False
        db_table = 'compras'


class Cuenta(models.Model):
    id_cuenta = models.AutoField(primary_key=True)
    nombreusuario = models.CharField(unique=True, max_length=300)
    contrasenia = models.CharField()
    fechacreacion = models.DateTimeField()
    fechafin = models.DateTimeField(blank=True, null=True)
    observacion = models.CharField(max_length=500, blank=True, null=True)
    fotoperfil = models.BinaryField(blank=True, null=True)
    estadocuenta = models.CharField(max_length=1)
    rol = models.CharField(max_length=1)
    correorecuperacion = models.CharField(max_length=256, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cuenta'


class DetalleGeosector(models.Model):
    id_detallegeosector = models.AutoField(primary_key=True)
    id_geosector = models.ForeignKey('Geosectores', models.DO_NOTHING, db_column='id_geosector', blank=True, null=True)
    id_ubicacion = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalle_geosector'


class Detallecombo(models.Model):
    id_detallecombo = models.AutoField(primary_key=True)
    id_combo = models.ForeignKey(Combo, models.DO_NOTHING, db_column='id_combo')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')
    cantidad = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detallecombo'


class Detallecompra(models.Model):
    id_detallecompra = models.AutoField(primary_key=True)
    id_compra = models.ForeignKey(Compras, models.DO_NOTHING, db_column='id_compra')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    id_componente = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componente', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    precio = models.DecimalField(max_digits=9, decimal_places=2)
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um')

    class Meta:
        managed = False
        db_table = 'detallecompra'


class Detalleensamblecomponente(models.Model):
    id_detalleensamblec = models.AutoField(primary_key=True)
    id_ensamblec = models.ForeignKey('Ensamblecomponente', models.DO_NOTHING, db_column='id_ensamblec')
    id_componentehijo = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componentehijo')
    cantidadhijo = models.DecimalField(max_digits=9, decimal_places=2)
    id_umhijo = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_umhijo')

    class Meta:
        managed = False
        db_table = 'detalleensamblecomponente'


class Detalleensambleproducto(models.Model):
    id_detalleensamblep = models.AutoField(primary_key=True)
    id_emsamblep = models.ForeignKey('Ensambleproducto', models.DO_NOTHING, db_column='id_emsamblep')
    id_componentehijo = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componentehijo')
    cantidadhijo = models.DecimalField(max_digits=9, decimal_places=2)
    id_umhijo = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_umhijo')

    class Meta:
        managed = False
        db_table = 'detalleensambleproducto'


class Detallefactura(models.Model):
    id_detallefactura = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey('Factura', models.DO_NOTHING, db_column='id_factura', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    id_combo = models.ForeignKey(Combo, models.DO_NOTHING, db_column='id_combo', blank=True, null=True)
    id_promocion = models.ForeignKey('Promociones', models.DO_NOTHING, db_column='id_promocion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detallefactura'


class Detallehorariossemanales(models.Model):
    id_dethorarios = models.AutoField(primary_key=True)
    id_horarios = models.ForeignKey('Horariossemanales', models.DO_NOTHING, db_column='id_horarios')
    dia = models.CharField(max_length=1)
    horainicio = models.TimeField()
    horafin = models.TimeField()

    class Meta:
        managed = False
        db_table = 'detallehorariossemanales'


class Detallemovimientoinventario(models.Model):
    id_detallemovimiento = models.AutoField(primary_key=True)
    id_movimientoinventario = models.ForeignKey('Movimientoinventario', models.DO_NOTHING, db_column='id_movimientoinventario')
    id_articulo = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_articulo', blank=True, null=True)
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    tipo = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'detallemovimientoinventario'


class Detallepedidoproveedor(models.Model):
    id_detallepedidoproveedor = models.AutoField(primary_key=True)
    id_pedidoproveedor = models.ForeignKey('Pedidosproveedor', models.DO_NOTHING, db_column='id_pedidoproveedor')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    id_componente = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componente', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    costounitario = models.DecimalField(max_digits=9, decimal_places=2)
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um')

    class Meta:
        managed = False
        db_table = 'detallepedidoproveedor'


class Detallepedidos(models.Model):
    id_detallepedido = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    id_combo = models.ForeignKey(Combo, models.DO_NOTHING, db_column='id_combo', blank=True, null=True)
    id_promocion = models.ForeignKey('Promociones', models.DO_NOTHING, db_column='id_promocion', blank=True, null=True)
    cantidad = models.DecimalField(max_digits=65535, decimal_places=65535)
    precio_unitario = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    impuesto = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detallepedidos'


class Detalleprocesamiento(models.Model):
    id_detallep = models.AutoField(primary_key=True)
    id_procesamientos = models.ForeignKey('Procesamiento', models.DO_NOTHING, db_column='id_procesamientos')
    id_inventario = models.ForeignKey('Inventario', models.DO_NOTHING, db_column='id_inventario')
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido', blank=True, null=True)
    id_inventariogenerado = models.ForeignKey('Inventario', models.DO_NOTHING, db_column='id_inventariogenerado', related_name='detalleprocesamiento_id_inventariogenerado_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalleprocesamiento'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    enombre = models.CharField(max_length=200)
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
        managed = False
        db_table = 'empresa'


class Ensamblecomponente(models.Model):
    id_ensamblec = models.AutoField(primary_key=True)
    id_componentepadre = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componentepadre')
    padrecantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_umpadre = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_umpadre')

    class Meta:
        managed = False
        db_table = 'ensamblecomponente'


class Ensambleproducto(models.Model):
    id_emsamblep = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')
    padrecantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um')

    class Meta:
        managed = False
        db_table = 'ensambleproducto'


class Ensambleunidadmedida(models.Model):
    ideum = models.AutoField(primary_key=True)
    idump = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='idump', blank=True, null=True)
    idumc = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='idumc', related_name='ensambleunidadmedida_idumc_set', blank=True, null=True)
    cantidadconversion = models.DecimalField(max_digits=12, decimal_places=6)

    class Meta:
        managed = False
        db_table = 'ensambleunidadmedida'


class Envios(models.Model):
    id_envio = models.AutoField(primary_key=True)
    fecha_de_envio = models.DateTimeField()
    estado = models.CharField(max_length=1)
    fecha_de_entrega = models.DateTimeField(blank=True, null=True)
    id_motorizado = models.ForeignKey('Motorizados', models.DO_NOTHING, db_column='id_motorizado')

    class Meta:
        managed = False
        db_table = 'envios'


class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido', blank=True, null=True)
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente', blank=True, null=True)
    id_mesero = models.ForeignKey('Meseros', models.DO_NOTHING, db_column='id_mesero', blank=True, null=True)
    fecha_emision = models.DateTimeField(blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    iva = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    a_pagar = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    codigo_factura = models.CharField(max_length=15, blank=True, null=True)
    codigo_autorizacion = models.CharField(max_length=49, blank=True, null=True)
    numero_factura_desde = models.CharField(max_length=9, blank=True, null=True)
    numero_factura_hasta = models.CharField(max_length=9, blank=True, null=True)
    estado = models.CharField(max_length=1, blank=True, null=True)
    id_punto_facturacion = models.ForeignKey('Puntofacturacion', models.DO_NOTHING, db_column='id_punto_facturacion', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'factura'


class Geosectores(models.Model):
    id_geosector = models.AutoField(primary_key=True)
    fechacreaciong = models.DateTimeField()
    secnombre = models.CharField(max_length=300)
    secdescripcion = models.CharField(max_length=500, blank=True, null=True)
    sectipo = models.CharField(max_length=1)
    secestado = models.CharField(max_length=1)
    tarifa = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'geosectores'


class Horarioproducto(models.Model):
    id_horarioproducto = models.AutoField(primary_key=True)
    id_horarios = models.ForeignKey('Horariossemanales', models.DO_NOTHING, db_column='id_horarios')
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')

    class Meta:
        managed = False
        db_table = 'horarioproducto'


class Horariosproductossemana(models.Model):
    id_horxproducto = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')
    id_horarios = models.ForeignKey('self', models.DO_NOTHING, db_column='id_horarios')

    class Meta:
        managed = False
        db_table = 'horariosproductossemana'


class Horariossemanales(models.Model):
    id_horarios = models.AutoField(primary_key=True)
    hordescripcion = models.CharField(max_length=500, blank=True, null=True)
    tipohorario = models.CharField(max_length=1)
    nombreh = models.CharField(max_length=200)

    class Meta:
        managed = False
        db_table = 'horariossemanales'


class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    id_bodega = models.ForeignKey(Bodegas, models.DO_NOTHING, db_column='id_bodega')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto', blank=True, null=True)
    id_componente = models.ForeignKey(Componente, models.DO_NOTHING, db_column='id_componente', blank=True, null=True)
    costo_unitario = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um', blank=True, null=True)
    stock_minimo = models.DecimalField(max_digits=9, decimal_places=2, blank=True, null=True)
    cantidad_disponible = models.DecimalField(max_digits=9, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'inventario'


class Jefecocina(models.Model):
    id_jefecocina = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    nombre = models.CharField(max_length=300)
    apellido = models.CharField(max_length=300)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateTimeField()
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta', blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'jefecocina'


class Mesas(models.Model):
    id_mesa = models.AutoField(primary_key=True)
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    observacion = models.CharField(max_length=500, blank=True, null=True)
    estado = models.CharField(max_length=1)
    activa = models.CharField(max_length=1)
    maxpersonas = models.SmallIntegerField()
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'mesas'


class Meseros(models.Model):
    id_mesero = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    telefono = models.CharField(max_length=10)
    apellido = models.CharField(max_length=300)
    nombre = models.CharField(max_length=300)
    fecha_registro = models.DateTimeField()
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta', blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'meseros'


class Motorizados(models.Model):
    id_motorizado = models.AutoField(primary_key=True)
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    nombre = models.CharField(max_length=300)
    apellido = models.CharField(max_length=300)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    fecha_registro = models.DateTimeField()
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta', blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'motorizados'


class Movimientoinventario(models.Model):
    id_movimientoinventario = models.AutoField(primary_key=True)
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta')
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido', blank=True, null=True)
    id_pedidoproveedor = models.ForeignKey('Pedidosproveedor', models.DO_NOTHING, db_column='id_pedidoproveedor', blank=True, null=True)
    id_bodega = models.ForeignKey(Bodegas, models.DO_NOTHING, db_column='id_bodega', blank=True, null=True)
    observacion = models.CharField(max_length=500, blank=True, null=True)
    fechahora = models.DateTimeField(blank=True, null=True)
    tipomovimiento = models.CharField(max_length=1)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'movimientoinventario'


class Movimientoscasilleros(models.Model):
    id_movimiento = models.AutoField(primary_key=True)
    tipomovimiento = models.CharField(max_length=1)
    id_casillero = models.ForeignKey(Casillero, models.DO_NOTHING, db_column='id_casillero')
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta')
    observacion = models.CharField(max_length=500, blank=True, null=True)
    id_casilleros = models.ForeignKey(Casillero, models.DO_NOTHING, db_column='id_casilleros', related_name='movimientoscasilleros_id_casilleros_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'movimientoscasilleros'


class Pagos(models.Model):
    id_pago = models.AutoField(primary_key=True)
    idempleado = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='idempleado')
    cantidad = models.DecimalField(max_digits=8, decimal_places=2)
    tipopago = models.CharField(max_length=1)
    idperiodo = models.ForeignKey('Periodo', models.DO_NOTHING, db_column='idperiodo')
    horadepago = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'pagos'


class Pagosefectivo(models.Model):
    id_pagoefectivo = models.AutoField(primary_key=True)
    estado = models.CharField(max_length=1)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    cantidadentregada = models.DecimalField(max_digits=9, decimal_places=2)
    cambioeentregado = models.DecimalField(max_digits=9, decimal_places=2)
    hora_de_pago = models.DateTimeField()
    id_cuentacobrador = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuentacobrador')
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido')

    class Meta:
        managed = False
        db_table = 'pagosefectivo'


class Pagosfraccionados(models.Model):
    id_pagofraccionado = models.AutoField(primary_key=True)
    id_pagoefectivo = models.ForeignKey(Pagosefectivo, models.DO_NOTHING, db_column='id_pagoefectivo')
    id_pagotransferencia = models.ForeignKey('Pagostransferencia', models.DO_NOTHING, db_column='id_pagotransferencia')
    id_pagopasarela = models.ForeignKey('Pagospasarela', models.DO_NOTHING, db_column='id_pagopasarela')
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    hora_de_pago = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'pagosfraccionados'


class Pagospasarela(models.Model):
    id_pagopasarela = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido')
    estado = models.CharField(max_length=1)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    hora_de_pago = models.DateTimeField()
    codigo_unico = models.BinaryField()

    class Meta:
        managed = False
        db_table = 'pagospasarela'


class Pagostransferencia(models.Model):
    id_pagotransferencia = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey('Pedidos', models.DO_NOTHING, db_column='id_pedido')
    estado = models.CharField(max_length=1)
    cantidad = models.DecimalField(max_digits=9, decimal_places=2)
    hora_de_pago = models.DateTimeField()
    id_cuentacobrador = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuentacobrador', blank=True, null=True)
    comprobante = models.BinaryField()
    hora_confirmacion_pago = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagostransferencia'


class Pedidos(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente')
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_de_pedido = models.CharField(max_length=1)
    metodo_de_pago = models.CharField(max_length=1)
    puntos = models.DecimalField(max_digits=3, decimal_places=0)
    fecha_pedido = models.DateTimeField()
    fecha_entrega = models.DateTimeField(blank=True, null=True)
    estado_del_pedido = models.CharField(max_length=1)
    observacion_del_cliente = models.CharField(max_length=500, blank=True, null=True)
    imagen = models.BinaryField(blank=True, null=True)
    estado_pago = models.CharField(max_length=100, blank=True, null=True)
    id_ubicacion = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion', blank=True, null=True)
    id_sucursal = models.ForeignKey('Sucursales', models.DO_NOTHING, db_column='id_sucursal', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedidos'


class Pedidosmesa(models.Model):
    id_pmesa = models.AutoField(primary_key=True)
    id_mesero = models.ForeignKey(Meseros, models.DO_NOTHING, db_column='id_mesero')
    id_mesa = models.ForeignKey(Mesas, models.DO_NOTHING, db_column='id_mesa')
    id_pedido = models.ForeignKey(Pedidos, models.DO_NOTHING, db_column='id_pedido')

    class Meta:
        managed = False
        db_table = 'pedidosmesa'


class Pedidosproveedor(models.Model):
    id_pedidoproveedor = models.AutoField(primary_key=True)
    id_proveedor = models.ForeignKey('Proveedores', models.DO_NOTHING, db_column='id_proveedor')
    id_bodega = models.ForeignKey(Bodegas, models.DO_NOTHING, db_column='id_bodega')
    fechapedido = models.DateTimeField()
    fechaentregaesperada = models.DateTimeField(blank=True, null=True)
    estado = models.CharField(max_length=1)
    observacion = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pedidosproveedor'


class Periodo(models.Model):
    id_periodo = models.AutoField(primary_key=True)
    rol = models.CharField(max_length=1)
    desde = models.DateTimeField()
    hasta = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'periodo'


class Procesamiento(models.Model):
    id_procesamientos = models.AutoField(primary_key=True)
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta')
    tipo_de_proceso = models.CharField(max_length=1)
    observacion = models.CharField(max_length=500, blank=True, null=True)
    fecha_de_procesamiento = models.DateTimeField()
    id_bodega = models.ForeignKey(Bodegas, models.DO_NOTHING, db_column='id_bodega')

    class Meta:
        managed = False
        db_table = 'procesamiento'


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey(Categorias, models.DO_NOTHING, db_column='id_categoria')
    id_um = models.ForeignKey('Unidadmedida', models.DO_NOTHING, db_column='id_um')
    imagenp = models.BinaryField(blank=True, null=True)
    puntosp = models.DecimalField(max_digits=3, decimal_places=0)
    codprincipal = models.CharField(max_length=25)
    nombreproducto = models.CharField(unique=True, max_length=300)
    descripcionproducto = models.CharField(max_length=300, blank=True, null=True)
    preciounitario = models.DecimalField(max_digits=14, decimal_places=2)
    iva = models.CharField(max_length=1)
    ice = models.CharField(max_length=1)
    irbpnr = models.CharField(max_length=1)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'producto'


class Promociones(models.Model):
    id_promocion = models.AutoField(primary_key=True)
    id_combo = models.ForeignKey(Combo, models.DO_NOTHING, db_column='id_combo')
    nombrepromocion = models.CharField(max_length=300, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'promociones'


class Proveedores(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    nombreproveedor = models.CharField(max_length=300)
    direccionproveedor = models.CharField(max_length=300, blank=True, null=True)
    telefonoproveedor = models.CharField(max_length=10, blank=True, null=True)
    correoproveedor = models.CharField(max_length=256, blank=True, null=True)
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador', blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'proveedores'


class Puntofacturacion(models.Model):
    id_puntofacturacion = models.AutoField(primary_key=True)
    nombrepunto = models.CharField(max_length=100)
    id_mesero = models.ForeignKey(Meseros, models.DO_NOTHING, db_column='id_mesero', blank=True, null=True)
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador', blank=True, null=True)
    codigo = models.CharField(max_length=3)
    sestado = models.CharField(max_length=1)
    ruc = models.CharField(max_length=13, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'puntofacturacion'


class Recompensascombos(models.Model):
    id_recompensacombo = models.AutoField(primary_key=True)
    id_combo = models.OneToOneField(Combo, models.DO_NOTHING, db_column='id_combo')
    puntos_recompensa_combo = models.DecimalField(max_digits=3, decimal_places=0)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'recompensascombos'


class Recompensasproductos(models.Model):
    id_recompensaproducto = models.AutoField(primary_key=True)
    id_producto = models.OneToOneField(Producto, models.DO_NOTHING, db_column='id_producto')
    puntos_recompensa_producto = models.DecimalField(max_digits=3, decimal_places=0)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'recompensasproductos'


class Redes(models.Model):
    id_red = models.AutoField(primary_key=True)
    id_empresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='id_empresa')
    nombre = models.CharField(max_length=50)
    url = models.CharField(max_length=2000)
    rlogo = models.BinaryField()

    class Meta:
        managed = False
        db_table = 'redes'


class Reservaciones(models.Model):
    id_reservacion = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Clientes, models.DO_NOTHING, db_column='id_cliente')
    id_mesa = models.ForeignKey(Mesas, models.DO_NOTHING, db_column='id_mesa')
    fecha_reserva = models.DateField()
    hora_reserva = models.TimeField()
    estado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'reservaciones'


class Reversionmovimientoinventario(models.Model):
    id_reversion = models.AutoField(primary_key=True)
    id_movimientoinventario = models.ForeignKey(Movimientoinventario, models.DO_NOTHING, db_column='id_movimientoinventario')
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta')
    fechahora = models.DateTimeField(blank=True, null=True)
    motivo = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reversionmovimientoinventario'


class Rutasprogramadas(models.Model):
    id_rutaprogramada = models.AutoField(primary_key=True)
    id_motorizado = models.ForeignKey(Motorizados, models.DO_NOTHING, db_column='id_motorizado')
    id_administrador = models.ForeignKey(Administrador, models.DO_NOTHING, db_column='id_administrador')
    id_geosector = models.ForeignKey(Geosectores, models.DO_NOTHING, db_column='id_geosector')
    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rutasprogramadas'


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
    fsapertura = models.DateField(blank=True, null=True)
    id_horarios = models.ForeignKey(Horariossemanales, models.DO_NOTHING, db_column='id_horarios', blank=True, null=True)
    id_geosector = models.ForeignKey(Geosectores, models.DO_NOTHING, db_column='id_geosector', blank=True, null=True)
    firmaelectronica = models.BinaryField(blank=True, null=True)
    id_empresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='id_empresa')
    id_ubicacion = models.ForeignKey('Ubicaciones', models.DO_NOTHING, db_column='id_ubicacion', blank=True, null=True)
    imagensucursal = models.BinaryField(blank=True, null=True)
    id_cuenta = models.ForeignKey(Cuenta, models.DO_NOTHING, db_column='id_cuenta', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sucursales'


class Tipopago(models.Model):
    id_tipopago = models.AutoField(primary_key=True)
    idempresa = models.ForeignKey(Empresa, models.DO_NOTHING, db_column='idempresa')
    rol = models.CharField(max_length=1)
    tipopago = models.CharField(max_length=1)
    cantidad = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'tipopago'


class Tiposproductos(models.Model):
    id_tipoproducto = models.AutoField(primary_key=True)
    tpnombre = models.CharField(max_length=300)
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'tiposproductos'


class TokenBlacklistBlacklistedtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    id = models.BigAutoField(primary_key=True)
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey(AuthUser, models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'


class Ubicaciones(models.Model):
    id_ubicacion = models.AutoField(primary_key=True)
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)
    udescripcion = models.CharField(max_length=500, blank=True, null=True)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'ubicaciones'


class Unidadmedida(models.Model):
    idum = models.AutoField(primary_key=True)
    nombreum = models.CharField(max_length=100)
    sestado = models.CharField(max_length=1)

    class Meta:
        managed = False
        db_table = 'unidadmedida'
