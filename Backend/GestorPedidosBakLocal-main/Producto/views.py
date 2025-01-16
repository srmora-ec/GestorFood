from django.http import JsonResponse
from django.db.models import Max, ExpressionWrapper, IntegerField
from django.views import View
from .models import *
from Login.models import Cuenta
from Bodega.models import Bodegas
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from PIL import Image, UnidentifiedImageError
from Login.models import Cuenta
# from Combos.models import Combo
from django.db import transaction
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator,EmptyPage
from Empresa.models import Horariossemanales
from Inventario.models import Inventario
import json
from django.db.models import Max, F
from django.core.serializers import serialize
from decimal import Decimal
import traceback
from django.db import transaction
from Inventario.models import MovimientoInventario, DetalleMovimientoInventario
from Login.models import Cuenta
from Empleados.Mesero.models import Pedidos
from utils import autenticarUsuario
import jwt

#------ Tipo producto
#------ Crear------------------------------------------------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class CrearTipoProducto(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear un tipo de producto'}, status=403)
            # Obtener y validar el token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para crear un usuario'}, status=400)
            data = json.loads(request.body)
            tp_nombre = data.get('tp_nombre')
            descripcion = data.get('descripcion')

            tipo_producto = TiposProductos.objects.create(tpnombre=tp_nombre, descripcion=descripcion,sestado=1)
            tipo_producto.save()

            return JsonResponse({'mensaje': 'Tipo de producto creado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
#-----------Existe-----------------------------
@method_decorator(csrf_exempt, name='dispatch')
class tipoProductoExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            tpnombre = data.get('tpnombre')

            obt=TiposProductos.objects.filter(tpnombre=tpnombre).first()
            if obt is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
#--------devolver-----------
@method_decorator(csrf_exempt, name='dispatch')
class ListaTiposProductos(View):
    def get(self, request, *args, **kwargs):
        try:
            tipos_productos = TiposProductos.objects.filter(sestado=1)
            data = []
            for tipo_producto in tipos_productos:
                tipo_producto_data = {
                    'id_tipoproducto': tipo_producto.id_tipoproducto,
                    'tpnombre': tipo_producto.tpnombre,
                    'descripcion': tipo_producto.descripcion,
                }

                data.append(tipo_producto_data)

            return JsonResponse({'tipos_productos': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
#-----------editar------------------------------------
#@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarTipoProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Obtener y validar el token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para crear un usuario'}, status=400)
            tipo_producto_id = kwargs.get('tipo_producto_id') 
            tipo_producto = TiposProductos.objects.get(id_tipoproducto=tipo_producto_id)
            tipo_producto.tpnombre = request.POST.get('tpnombre', tipo_producto.tpnombre)
            tipo_producto.descripcion = request.POST.get('descripcion', tipo_producto.descripcion)
            if(request.POST.get('sestado')):
                tipo_producto.sestado = request.POST.get('sestado')
            tipo_producto.save()

            return JsonResponse({'mensaje': 'Tipo de producto editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
#-----------CATEGORIA--------------------------------
#------------Crear-----------------------------------

@method_decorator(csrf_exempt, name='dispatch')
class CrearCategoria(View):
    permission_classes = (IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
                #return JsonResponse({'error': 'No tienes permisos para crear una categoría'}, status=403)
            # Obtener y validar el token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para crear un usuario'}, status=400)
            id_tipo_producto = request.POST.get('id_tipoproducto')
            cat_nombre = request.POST.get('catnombre')
            descripcion = request.POST.get('descripcion')
            mcliente = request.POST.get('muestracliente')

            imagen_archivo = request.FILES.get('imagencategoria')  # Cambiado a request.FILES
            image_64_encode=None
            if imagen_archivo:
                try:
                    image_read = imagen_archivo.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

            tipo_producto = TiposProductos.objects.get(id_tipoproducto=id_tipo_producto)
            if mcliente in ['true', 'false']:
                mcliente = True if mcliente == 'true' else False

            if descripcion=="":
                descripcion=None

            categoria = Categorias(
                id_tipoproducto=tipo_producto,
                catnombre=cat_nombre,
                descripcion=descripcion,
                imagencategoria=image_64_encode,
                sestado=1,
                mostracliente=mcliente
            )
            categoria.save()

            return JsonResponse({'mensaje': 'Categoría creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

#------existe?--------------------
@method_decorator(csrf_exempt, name='dispatch')
class CategoriaExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            catnombre = data.get('catnombre')

            obt=Categorias.objects.filter(catnombre=catnombre).first()
            if obt is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
#------------devolver------------------------------

@method_decorator(csrf_exempt, name='dispatch')
class ListaCategorias(View):
    def get(self, request, *args, **kwargs):
        # Obtener y validar el token
        user=None
        token = request.headers.get('Authorization', '').split('Bearer ')[-1]
        if token:
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)

        try:
            # Filtrar categorías según el rol del usuario
            if user:
                if user.rol == 'A':
                    categorias = Categorias.objects.filter(sestado=1)  # Todas las categorías activas
            else:
                categorias = Categorias.objects.filter(sestado=1, mostracliente=True)  # Solo las visibles al cliente

            data = []

            for categoria in categorias:
                imagencategoria = categoria.imagencategoria
                imagencategoria_base64 = None

                if imagencategoria:
                    try:
                        byteImg = base64.b64decode(imagencategoria)
                        imagencategoria_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")

                # tipo_producto_data = {
                #     'id_tipoproducto': categoria.id_tipoproducto.id_tipoproducto,
                # }

                categoria_data = {
                    'id_categoria': categoria.id_categoria,
                    'imagencategoria': imagencategoria_base64,
                    'catnombre': categoria.catnombre,
                    'descripcion': categoria.descripcion,
                    'id_tipoproducto': categoria.id_tipoproducto.id_tipoproducto,
                    'muestracliente': categoria.mostracliente,
                }

                data.append(categoria_data)

            return JsonResponse({'categorias': data})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
#--------------Devolver-------------------------
#@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class EditarCategoria(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Obtener y validar el token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para editar una categoría'}, status=400)
            categoria_id = kwargs.get('categoria_id')
            categoria = Categorias.objects.get(id_categoria=categoria_id)
            imagencategoria = request.FILES.get('imagencategoria')
            nombre= request.POST.get('catnombre')
            if(nombre):
                categoria.catnombre =nombre
            descripcion = request.POST.get('descripcion')
            if(descripcion):
                categoria.descripcion=descripcion
            estado= request.POST.get('sestado')
            if(estado):
                categoria.sestado =estado
            tipo= request.POST.get('id_tipoproducto', categoria.id_tipoproducto.id_tipoproducto)
            if tipo:
                categoria.id_tipoproducto=TiposProductos.objects.get(id_tipoproducto=tipo)
            if imagencategoria:
                try:
                    image_read = imagencategoria.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                    categoria.imagencategoria=image_64_encode
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
            mcliente = request.POST.get('muestracliente')
            if mcliente:
                categoria.mostracliente=mcliente
            
            categoria.save()
            return JsonResponse({'mensaje': 'Categoría editada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

#------------ Producto---------------------------
#---------------Crear---------------------
#--------------Existe---------------
#-----------devolver--------------
#-----eliminmar----------------
@method_decorator(csrf_exempt, name='dispatch')
class EliminarProducto(View):
    def post(self, request, *args, **kwargs):
        try:
            # Obtener y validar el token
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para eliminar un producto'}, status=400)
            id_producto = request.POST.get('id_producto')
            producto = Producto.objects.get(id_producto=id_producto)
            producto.sestado = 0
            producto.save()
            return JsonResponse({'mensaje': 'Producto eliminado con éxito'})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
#----UNIDAD DE MEDIDA------------------
#----CREAR-------------------
@method_decorator(csrf_exempt, name='dispatch')
class CrearUnidadMedida(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
           #if cuenta.rol != 'S':
            #    return JsonResponse({'error': 'No tienes permisos para crear una unidad de medida'}, status=403)
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            data = json.loads(request.body)
            nombre_um = data.get('nombre_um')
            unidad_medida = UnidadMedida.objects.create(nombreum=nombre_um,sestado=1)
            unidad_medida.save()
            return JsonResponse({'mensaje': 'Unidad de medida creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
#---------Listar--------------------------
@method_decorator(csrf_exempt, name='dispatch')
class ListarUnidadesMedida(View):
    def get(self, request, *args, **kwargs):
        try:
            unidades_medida = UnidadMedida.objects.filter(sestado=1)
            data = []

            for unidad in unidades_medida:
                unidad_data = {
                    'id_um': unidad.idum,
                    'nombre_um': unidad.nombreum,
                }

                data.append(unidad_data)

            return JsonResponse({'unidades_medida': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

#---------editar-------------------------
@method_decorator(csrf_exempt, name='dispatch')
#@method_decorator(login_required, name='dispatch')
class EditarUnidadMedida(View):
    @transaction.atomic
    def post(self, request, unidad_id, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            #if cuenta.rol != 'S':
                #return JsonResponse({'error': 'No tienes permisos para editar una unidad de medida'}, status=403)
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            unidad = UnidadMedida.objects.get(idum=unidad_id)

            unidad.nombreum = request.POST.get('nombreum', unidad.nombreum)
            unidad.sestado = request.POST.get('sestado', unidad.sestado)
            unidad.save()

            return JsonResponse({'mensaje': 'Unidad de medida editada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

#---------------PRODUCTO----------------------
#-------------crear-------------------------

@method_decorator(csrf_exempt, name='dispatch')
class CrearProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                token = request.headers.get('Authorization', '').split('Bearer ')[-1]
                if not token:
                    return JsonResponse({'error': 'Token no proporcionado'}, status=400)
                try:
                    user = autenticarUsuario(token)  # Valida y decodifica el token
                except jwt.ExpiredSignatureError:
                    return JsonResponse({'error': 'Token ha expirado'}, status=400)
                except jwt.InvalidTokenError:
                    return JsonResponse({'error': 'Token inválido'}, status=400)
                if user.rol != 'A':
                    return JsonResponse({'error': 'No tienes permiso para crear un producto'}, status=400)

                id_categoria = request.POST.get('id_categoria')
                id_um = request.POST.get('id_um')
                imagen_p = request.FILES.get('imagen_p')
                puntosp = request.POST.get('puntos_p')
                nombreproducto = request.POST.get('nombre_producto')
                descripcionproducto = request.POST.get('descripcion_producto')
                preciounitario = request.POST.get('precio_unitario')
                image_64_encode = None
                
                if imagen_p:
                    try:
                        image_read = imagen_p.read()
                        image_64_encode = base64.b64encode(image_read)
                        image_encoded = image_64_encode.decode('utf-8')
                    except UnidentifiedImageError as img_error:
                        return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

                # Crear el producto
                categoria = Categorias.objects.get(id_categoria=id_categoria)
                unidad_medida = UnidadMedida.objects.get(idum=id_um)
                producto = Producto.objects.create(
                    id_categoria=categoria,
                    id_um=unidad_medida,
                    imagenp=image_64_encode,
                    puntosp=puntosp,
                    codprincipal=obtener_siguiente_codprincipal(),
                    nombreproducto=nombreproducto,
                    descripcionproducto=descripcionproducto,
                    preciounitario=preciounitario,
                    sestado='1'  # Asegúrate de que el estado del producto sea correcto
                )
                
                # Asociar los impuestos al producto
                impuestos_seleccionados = json.loads(request.POST.get('impuestos', '[]'))
                for impuesto_id in impuestos_seleccionados:
                    try:
                        impuesto = Impuestos.objects.get(id_impuesto=impuesto_id)
                        ProductoImpuestos.objects.create(id_producto=producto, id_impuesto=impuesto)
                    except Impuestos.DoesNotExist:
                        return JsonResponse({'error': f'Impuesto con id {impuesto_id} no encontrado'}, status=400)

                # Si hay un ensamblaje de componentes, guardarlo
                detalle_comp = json.loads(request.POST.get('detalle_comp', '[]'))
                if detalle_comp:
                    cantidadpadre = Decimal(request.POST.get('cantidad', 0))
                    ensambleproducto = EnsambleProducto.objects.create(
                        id_producto=producto,
                        padrecantidad=cantidadpadre,
                        id_um=unidad_medida
                    )
                    for detalle_data in detalle_comp:
                        componente_hijo = Componente.objects.get(id_componente=detalle_data['id'])
                        um = componente_hijo.id_um
                        DetalleEnsambleProducto.objects.create(
                            id_emsamblep=ensambleproducto,
                            id_componentehijo=componente_hijo,
                            cantidadhijo=detalle_data['cantidad'],
                            id_umhijo=um
                        )
                
                # Guardar el producto final
                producto.save()

                return JsonResponse({'mensaje': 'Producto creado con éxito'})

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400)


#---------- Listar para productos-------------------------
@method_decorator(csrf_exempt, name='dispatch')
class ListaCategoriasConProductos(View):
    """
    Devuelve las categorías con mostrarcliente=True, incluyendo los productos asociados.
    """
    def get(self, request, *args, **kwargs):
        try:
            # Obtener categorías con mostrarcliente=True
            categorias = Categorias.objects.filter(mostracliente=True)

            # Formatear datos
            resultado = []
            for categoria in categorias:
                productos = Producto.objects.filter(id_categoria=categoria.id_categoria)
                
                productos_formateados = []
                for producto in productos:
                    imagen_base64 = None
                    if producto.imagenp:
                        try:
                            # Intentar decodificar y luego codificar la imagen a base64
                            byteImg = base64.b64decode(producto.imagenp)
                            imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                        except Exception as img_error:
                            print(f"Error al procesar imagen: {str(img_error)}")
                    
                    productos_formateados.append({
                        "id_producto": producto.id_producto,
                        "nombre_producto": producto.nombreproducto,
                        "descripcion_producto": producto.descripcionproducto,
                        "precio_unitario": float(producto.preciounitario),
                        "puntos": float(producto.puntosp),
                        "estado": producto.sestado,
                        "imagenp": imagen_base64,  # Devuelve la imagen en base64 o None
                        "impuesto":producto.calcular_impuestos()
                    })
                
                resultado.append({
                    "id_categoria": categoria.id_categoria,
                    "nombre_categoria": categoria.catnombre,
                    "productos": productos_formateados
                })

            return JsonResponse({'mensaje': resultado})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)#----------editar--------------------------


@method_decorator(csrf_exempt, name='dispatch')
#@method_decorator(login_required, name='dispatch')
class EditarProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para editar un producto'}, status=400)
            
            producto_id = kwargs.get('producto_id')
            producto = Producto.objects.get(id_producto=producto_id)

            # Actualización de los datos del producto
            producto.id_categoria = Categorias.objects.get(id_categoria=request.POST.get('id_categoria', producto.id_categoria.id_categoria))
            producto.id_um = UnidadMedida.objects.get(idum=request.POST.get('id_um', producto.id_um.idum))
            producto.puntosp = request.POST.get('puntosp', producto.puntosp)
            producto.codprincipal = request.POST.get('codprincipal', producto.codprincipal)
            producto.nombreproducto = request.POST.get('nombreproducto', producto.nombreproducto)
            producto.descripcionproducto = request.POST.get('descripcionproducto', producto.descripcionproducto)
            producto.preciounitario = request.POST.get('preciounitario', producto.preciounitario)

            # Manejo de los impuestos (Recibimos los impuestos seleccionados en un JSON)
            impuestos_seleccionados = request.POST.get('impuestos', None)
            if impuestos_seleccionados:
                impuestos_seleccionados = json.loads(impuestos_seleccionados)
                
                # Limpiar las relaciones de impuestos actuales
                producto.productoimpuestos_set.all().delete()

                # Agregar los nuevos impuestos seleccionados
                for impuesto_id in impuestos_seleccionados:
                    impuesto = Impuestos.objects.get(id_impuesto=impuesto_id)
                    ProductoImpuestos.objects.create(id_producto=producto, id_impuesto=impuesto)

            # Manejo de la imagen
            imagen_producto = request.FILES.get('imagenp')
            if imagen_producto:
                try:
                    image_read = imagen_producto.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                    producto.imagenp = image_64_encode
                except Exception as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

            producto.save()
            return JsonResponse({'mensaje': 'Producto editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)



@method_decorator(csrf_exempt, name='dispatch')
class ListaTiposYCategorias(View):
    def get(self, request, *args, **kwargs):
        try:
            tipos_productos = TiposProductos.objects.filter(sestado=1)
            data = []

            for tipo_producto in tipos_productos:
                categorias = Categorias.objects.filter(id_tipoproducto=tipo_producto)
                categorias_data = []

                for categoria in categorias:
                    imagencategoria = categoria.imagencategoria
                    imagencategoria_base64 = None

                    if imagencategoria:
                        imagencategoria_base64 = self.convertir_imagen_a_base64(imagencategoria)

                    categoria_data = {
                        'id_categoria': categoria.id_categoria,
                        'imagencategoria': imagencategoria_base64,
                        'catnombre': categoria.catnombre,
                        'descripcion': categoria.descripcion
                    }

                    categorias_data.append(categoria_data)

                tipo_producto_data = {
                    'id_tipoproducto': tipo_producto.id_tipoproducto,
                    'tpnombre': tipo_producto.tpnombre,
                    'descripcion': tipo_producto.descripcion,
                    'sestado':tipo_producto.sestado,
                    'categorias': categorias_data
                }

                data.append(tipo_producto_data)

            return JsonResponse({'tipos_y_categorias': data})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def convertir_imagen_a_base64(self, imagen):
        # Convierte la imagen a base64 y devuelve la cadena resultante
        return base64.b64encode(imagen).decode('utf-8') if imagen else None







# @method_decorator(csrf_exempt, name='dispatch')
# #@method_decorator(login_required, name='dispatch')
# class EditarProducto(View):
#     @transaction.atomic
#     def post(self, request, *args, **kwargs):
#         try:
#             producto_id = kwargs.get('producto_id')
#             producto = Producto.objects.get(id_producto=producto_id)
#             producto.id_categoria = Categorias.objects.get(id_categoria=request.POST.get('id_categoria', producto.id_categoria.id_categoria))
#             producto.id_um = UnidadMedida.objects.get(idum=request.POST.get('id_um', producto.id_um.idum))
#             producto.puntosp = request.POST.get('puntosp', producto.puntosp)
#             producto.codprincipal = request.POST.get('codprincipal', producto.codprincipal)
#             producto.nombreproducto = request.POST.get('nombreproducto', producto.nombreproducto)
#             producto.descripcionproducto = request.POST.get('descripcionproducto', producto.descripcionproducto)
#             producto.preciounitario = request.POST.get('preciounitario', producto.preciounitario)
#             producto.iva = request.POST.get('iva', producto.iva)
#             producto.ice = request.POST.get('ice', producto.ice)
#             producto.irbpnr = request.POST.get('irbpnr', producto.irbpnr)

#             # Manejo de la imagen
#             imagen_producto = request.FILES.get('imagenp')
#             if imagen_producto:
#                 try:
#                     image_read = imagen_producto.read()
#                     image_64_encode = base64.b64encode(image_read)
#                     image_encoded = image_64_encode.decode('utf-8')
#                     producto.imagenp = image_64_encode
#                 except Exception as img_error:
#                     return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
#             producto.save()
#             return JsonResponse({'mensaje': 'Producto editado con éxito'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#-------COMPONENTE----------------------
#--crear------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class CrearComponente(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if user.rol != 'A':
                return JsonResponse({'error': 'No tienes permiso para crear un componente'}, status=400)
            
            nombre = request.POST.get('nombre')
            descripcion = request.POST.get('descripcion')
            costo = request.POST.get('costo')
            tipo = request.POST.get('tipo')
            id_um = request.POST.get('id_um')
            id_categoria = request.POST.get('id_categoria')

            # Verificar que la unidad de medida exista
            unidad_medida = UnidadMedida.objects.get(idum=id_um)
            categoria = Categorias.objects.get(id_categoria=id_categoria)
            
            if tipo == 'N':
                componente = Componente.objects.create(
                    nombre=nombre,
                    descripcion=descripcion,
                    costo=costo,
                    tipo=tipo,
                    id_um=unidad_medida,
                    id_categoria=categoria,
                    sestado=1
                )
                return JsonResponse({'mensaje': 'Componente creado con éxito'})
            cantidadpadre = Decimal(request.POST.get('cantidad', 0))
            if tipo == 'F' and cantidadpadre > 0:
                detalle_comp = json.loads(request.POST.get('detalle_comp', '[]'))
                componente = Componente.objects.create(
                    nombre=nombre,
                    descripcion=descripcion,
                    costo=costo,
                    tipo=tipo,
                    id_um=unidad_medida,
                    id_categoria=categoria,
                    sestado=1
                )
                ensamblecomponente = EnsambleComponente.objects.create(
                    id_componentepadre=componente,
                    padrecantidad=cantidadpadre,
                    id_umpadre=unidad_medida  # Ajusta esta línea según tu lógica
                )
                for detalle_data in detalle_comp:
                    componente_hijo = Componente.objects.get(id_componente=detalle_data['id'])
                    um = componente_hijo.id_um
                    detalleensamblecomponente = DetalleEnsambleComponente.objects.create(
                        id_ensamblec=ensamblecomponente,
                        id_componentehijo=componente_hijo,
                        cantidadhijo=detalle_data['cantidad'],
                        id_umhijo=um
                    )

            return JsonResponse({'mensaje': 'Componente creado con éxito'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        

#---------listar------------------------------
class ListarComponentes(View):
    def get(self, request, *args, **kwargs):
        try:
            componentes = Componente.objects.filter(sestado=1)
            lista_componentes = []
            for componente in componentes:
                tipo_producto_data = {
                    'id_categoria': componente.id_categoria.id_categoria,
                    'catnombre': componente.id_categoria.catnombre,
                }
                ensambleexi = EnsambleComponente.objects.filter(id_componentepadre=componente)
                if (ensambleexi.exists()):
                    ensamble=EnsambleComponente.objects.get(id_componentepadre=componente)
                    detallesensamble=DetalleEnsambleComponente.objects.filter(id_ensamblec=ensamble)
                    lista_detalle = []
                    for detalle in detallesensamble:
                        hijo={
                            'id':detalle.id_componentehijo.id_componente,
                            'nombre':detalle.id_componentehijo.nombre
                        }
                        um={
                            'id':detalle.id_umhijo.idum,
                            'nombre':detalle.id_umhijo.nombreum
                        }
                        ensamble_data = {
                            'id_componentehijo':hijo,
                            'cantidadhijo': detalle.cantidadhijo,
                            'um':um
                        }
                        lista_detalle.append(ensamble_data)
                    compdata={
                        'padrecant':ensamble.padrecantidad,
                        'detalle':lista_detalle
                    }
                    componente_data = {
                        'id_componente': componente.id_componente,
                        'nombre': componente.nombre,
                        'descripcion': componente.descripcion,
                        'costo': str(componente.costo).replace('€', '').replace('$', ''),
                        'tipo': componente.tipo,
                        'id_um': componente.id_um.idum,
                        'id_categoria': tipo_producto_data,
                        'nombre_um': componente.id_um.nombreum,
                        'detalle':compdata,
                    }
                    lista_componentes.append(componente_data)
                else:
                    componente_data = {
                        'id_componente': componente.id_componente,
                        'nombre': componente.nombre,
                        'descripcion': componente.descripcion,
                        'costo': str(componente.costo).replace('€', '').replace('$', ''),
                        'tipo': componente.tipo,
                        'id_um': componente.id_um.idum,
                        'id_categoria': tipo_producto_data,
                        'nombre_um': componente.id_um.nombreum,
                    }
                    lista_componentes.append(componente_data)
            return JsonResponse({'componentes': lista_componentes})
        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)
        

#------editar-------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class EditarComponentex(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                user = autenticarUsuario(token)  # Valida y decodifica el token
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            # Obtener el ID del componente a editar de los argumentos de la URL
            id_componente = kwargs.get('id_componente')
            componente = Componente.objects.get(id_componente=id_componente)
            '''
            detalle_comp = json.loads(request.POST.get('detalle_comp', '[]'))
            return JsonResponse({'mensaje': detalle_comp})
            '''
            #hasta aca
            componente.nombre = request.POST.get('nombre')
            componente.costo = None
            tipo = request.POST.get('tipo')
            componente.tipo=tipo
            descripcion = request.POST.get('descripcion')
            costo_str = request.POST.get('costo')
            if(descripcion):
                componente.descripcion=descripcion
            if costo_str:
                componente.costo = Decimal((costo_str.replace(',', '.')))
            id_um = request.POST.get('id_um')
            if id_um and id_um != str(componente.id_um.idum):
                ensambles = DetalleEnsambleComponente.objects.filter(id_componentehijo=componente)
                if ensambles.exists():
                    return JsonResponse({'error': 'Este artículo forma parte de otros ensambles, no se puede cambiar la unidad de medida'}, status=400)
                if id_um:
                    componente.id_um = UnidadMedida.objects.get(idum=id_um)
            categoria = request.POST.get('categoria')
            if(categoria):
                componente.categoria=Categorias.objects.get(id_categoria=categoria)
            if tipo == 'N':
                componente.tipo=tipo
                componente.save()
                return JsonResponse({'mensaje': 'Componente editado con éxito'})
            cantidadpadre = Decimal(request.POST.get('cantidad', 0))
            if(tipo=='F' and cantidadpadre > 0):
                componente.tipo='F'
                ensamble=EnsambleComponente.objects.filter(id_componentepadre=componente)
                cantidadpadre = Decimal(request.POST.get('cantidad', 0))
                detalle_comp = json.loads(request.POST.get('detalle_comp', '[]'))
                if(ensamble.count()==0):
                    ensamblecomponente = EnsambleComponente.objects.create(
                        id_componentepadre=componente,
                        padrecantidad=cantidadpadre,
                        id_umpadre=UnidadMedida.objects.get(idum=request.POST.get('id_um'))
                    )
                    for detalle_data in detalle_comp:
                        componente_hijo = Componente.objects.get(id_componente=detalle_data['id'])
                        um = componente_hijo.id_um
                        detalleensamblecomponente = DetalleEnsambleComponente.objects.create(
                            id_ensamblec=ensamblecomponente,
                            id_componentehijo=componente_hijo,
                            cantidadhijo=detalle_data['cantidad'],
                            id_umhijo=um
                        )
                    componente.save()
                    return JsonResponse({'mensaje': 'Componente editado con éxito'})
                if(ensamble.count()>0):
                    detalles_actuales = DetalleEnsambleComponente.objects.filter(id_ensamblec=EnsambleComponente.objects.get(id_componentepadre=componente))           
                    i=0
                    for det in detalle_comp:
                        componente_hijo = Componente.objects.get(id_componente=det['id'])
                        um = componente_hijo.id_um
                        if i < len(detalles_actuales):
                            detalle_actual = detalles_actuales[i]
                            detalle_actual.id_componentehijo = componente_hijo
                            detalle_actual.cantidadhijo = det['cantidad']
                            detalle_actual.id_umhijo = um
                            detalle_actual.save()
                        else:
                            ensamble = EnsambleComponente.objects.get(id_componentepadre=componente)
                            DetalleEnsambleComponente.objects.create(
                                id_ensamblec=ensamble,
                                id_componentehijo=componente_hijo,
                                cantidadhijo=det['cantidad'],
                                id_umhijo=um
                            )
                        i = i + 1
                    while(i<len(detalles_actuales)):
                        detalle_actual = detalles_actuales[i]
                        detalle_actual.delete()
                        i=i+1
            componente.save()
            return JsonResponse({'mensaje': 'Se edito correctamente'})
        except Componente.DoesNotExist:
            return JsonResponse({'error': 'Componente no encontrado'}, status=404)
        except UnidadMedida.DoesNotExist:
            return JsonResponse({'error': 'Unidad de medida no encontrada'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)












@method_decorator(csrf_exempt, name='dispatch')
class EliminarComponentex(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            id_componente = request.POST.get('id_componente')
            componente = Componente.objects.get(id_componente=id_componente)
            componente.costo=None
            componente.sestado = 0
            ensamble=DetalleEnsambleComponente.objects.filter(id_componentehijo=componente)
            if(ensamble.exists()):
                return JsonResponse({'error': 'Este artículo ensambla otros productos, no se puede eliminar'},status=400)
            ensamble= EnsambleComponente.objects.filter(id_componentepadre=id_componente)
            ensamble.delete()
            componente.save()

            return JsonResponse({'mensaje': 'Artículo eliminado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class ComponentesDisponibles(View):
    def post(self, request, *args, **kwargs):
        try:
            id_componente = request.POST.get('id_componente')
            cantxensamble = Decimal(request.POST.get('cantxensamble'))
            catngenensamble = Decimal(request.POST.get('catngenensamble'))
            id_componentegen = request.POST.get('id_componentegen')
            cantxfabricar = Decimal(request.POST.get('cantxfabricar'))
            componentepadre= Componente.objects.get(id_componente=id_componentegen)
            componentehijo= Componente.objects.get(id_componente=id_componente)
            id_bodega = Bodegas.objects.get(id_bodega=(request.POST.get('id_bodega')))
            ensamble = EnsambleComponente.objects.get(id_componentepadre=componentepadre)
            detalle = DetalleEnsambleComponente.objects.filter(id_ensamblec=ensamble, id_componentehijo=componentehijo)
            
            cantnecesaria = (cantxensamble * cantxfabricar) / catngenensamble
            
            inventario = Inventario.objects.get(id_componente=componentehijo, id_bodega=id_bodega)
            print(cantnecesaria)
            print('<=')
            print(float(inventario.cantidad_disponible))
            if float(cantnecesaria) <= float(inventario.cantidad_disponible):
                print(1)
                return JsonResponse({'mensaje': 1})
            else:
                print('Cantidad de fabricar: '+request.POST.get('cantxfabricar'))
                print(0)
                return JsonResponse({'mensaje': 0})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class ComponentesDisponiblesPro(View):
    def post(self, request, *args, **kwargs):
        try:
            id_componente = request.POST.get('id_componente')
            cantxensamble = Decimal(request.POST.get('cantxensamble'))
            catngenensamble = Decimal(request.POST.get('catngenensamble'))
            id_productogen = request.POST.get('id_productogen')
            cantxfabricar = Decimal(request.POST.get('cantxfabricar'))
            productopadre= Producto.objects.get(id_producto=id_productogen)
            componentehijo= Componente.objects.get(id_componente=id_componente)
            id_bodega = Bodegas.objects.get(id_bodega=(request.POST.get('id_bodega')))
            ensamble = EnsambleProducto.objects.get(id_producto=productopadre)
            detalle = DetalleEnsambleProducto.objects.filter(id_emsamblep=ensamble, id_componentehijo=componentehijo)
            
            cantnecesaria = (cantxensamble * cantxfabricar) / catngenensamble
            
            inventario = Inventario.objects.get(id_componente=componentehijo, id_bodega=id_bodega)
            print(cantnecesaria)
            print('<=')
            print(float(inventario.cantidad_disponible))
            if float(cantnecesaria) <= float(inventario.cantidad_disponible):
                print(1)
                return JsonResponse({'mensaje': 1})
            else:
                print('Cantidad de fabricar: '+request.POST.get('cantxfabricar'))
                print(0)
                return JsonResponse({'mensaje': 0})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class FabricarComponente(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                lista_componentes = json.loads(request.POST.get('lista_componentes'))
                cantidad_fabricar = Decimal(request.POST.get('cantidad_fabricar'))
                id_componente_generado = request.POST.get('id_componente_generado')
                id_bodega = request.POST.get('id_bodega')
                bodega= Bodegas.objects.get(id_bodega=id_bodega)
                componente= Componente.objects.get(id_componente=id_componente_generado)
                newmovimiento=MovimientoInventario.objects.create(
                    id_cuenta=Cuenta.objects.get(id_cuenta=1),
                    tipomovimiento='P',
                    sestado=1,
                    id_bodega=bodega
                )
                for compo in lista_componentes:
                    print('Recorrer lista?')
                    detalle_componente = compo
                    id_componente = detalle_componente.get('key')
                    componentedet=Componente.objects.get(id_componente=id_componente)
                    cantidad_restar = Decimal(detalle_componente.get('quantity'))

                    inventario_componente = Inventario.objects.get(id_componente=componentedet, id_bodega=bodega)
                    inventario_componente.cantidad_disponible -= cantidad_restar
                    inventario_componente.save()
                    newdetalle = DetalleMovimientoInventario.objects.create(
                        id_movimientoinventario = newmovimiento,
                        id_articulo = componentedet,
                        cantidad = cantidad_restar,
                        tipo = 'S'
                    )
                inventario_generado = Inventario.objects.filter(id_componente=componente, id_bodega=bodega)
                newdetalle = DetalleMovimientoInventario.objects.create(
                    id_movimientoinventario = newmovimiento,
                    id_articulo = componente,
                    cantidad = cantidad_fabricar,
                    tipo = 'E'
                )
                if(inventario_generado.count()>0):
                    print('Esto pasa cuando sdfas?')
                    inventario_gen = Inventario.objects.get(id_componente=componente, id_bodega=bodega)
                    inventario_gen.cantidad_disponible += cantidad_fabricar
                    inventario_gen.save()
                else:
                    print('Esto sucede?')
                    inventariocre= Inventario.objects.create(
                        id_bodega = bodega,
                        id_componente =  componente,
                        id_um = componente.id_um,
                        stock_minimo = '1',
                        cantidad_disponible = cantidad_fabricar
                    )
                print('Funciono?')
                return JsonResponse({'mensaje': 'Operación exitosa'})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
@method_decorator(csrf_exempt, name='dispatch')
class FabricarProducto(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                lista_componentes = json.loads(request.POST.get('lista_componentes'))
                cantidad_fabricar = Decimal(request.POST.get('cantidad_fabricar'))
                id_producto_generado = request.POST.get('id_producto_generado')
                id_bodega = request.POST.get('id_bodega')
                bodega= Bodegas.objects.get(id_bodega=id_bodega)
                producto= Producto.objects.get(id_producto=id_producto_generado)
                newmovimiento=MovimientoInventario.objects.create(
                    id_cuenta=Cuenta.objects.get(id_cuenta=1),
                    tipomovimiento='P',
                    sestado='1'
                )
                for compo in lista_componentes:
                    print('Recorrer lista?')
                    detalle_componente = compo
                    id_componente = detalle_componente.get('key')
                    componentedet=Componente.objects.get(id_componente=id_componente)
                    cantidad_restar = Decimal(detalle_componente.get('quantity'))

                    inventario_componente = Inventario.objects.get(id_componente=componentedet, id_bodega=bodega)
                    inventario_componente.cantidad_disponible -= cantidad_restar
                    inventario_componente.save()
                    newdetalle = DetalleMovimientoInventario.objects.create(
                        id_movimientoinventario = newmovimiento,
                        id_articulo = componentedet,
                        cantidad = cantidad_restar,
                        tipo = 'S'
                    )
                inventario_generado = Inventario.objects.filter(id_producto=producto, id_bodega=bodega)
                newdetalle = DetalleMovimientoInventario.objects.create(
                    id_movimientoinventario = newmovimiento,
                    id_producto = producto,
                    cantidad = cantidad_fabricar,
                    tipo = 'E'
                )
                if(inventario_generado.count()>0):
                    print('Esto pasa cuando sdfas?')
                    inventario_gen = Inventario.objects.get(id_producto=producto, id_bodega=bodega)
                    inventario_gen.cantidad_disponible += cantidad_fabricar
                    inventario_gen.save()
                else:
                    print('Esto sucede?')
                    inventariocre= Inventario.objects.create(
                        id_bodega = bodega,
                        id_producto =  producto,
                        id_um = producto.id_um,
                        stock_minimo = '1',
                        cantidad_disponible = cantidad_fabricar
                    )
                print('Funciono?')
                return JsonResponse({'mensaje': 'Operación exitosa'})
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
class ListarImpuestos(View):
    def get(self, request, *args, **kwargs):
        try:
            # Parámetros de paginación y búsqueda
            page = int(request.GET.get('page', 1))
            size = int(request.GET.get('size', 10))
            search = request.GET.get('search', '')

            # Filtrar impuestos por término de búsqueda
            impuestos = Impuestos.objects.filter(nombre__icontains=search)

            # Configurar la paginación
            paginator = Paginator(impuestos, size)

            try:
                # Obtener la página actual
                impuestos_pagina = paginator.page(page)
            except EmptyPage:
                # Si la página está fuera de rango, devolver una lista vacía
                impuestos_pagina = []

            # Convertir impuestos a formato JSON
            lista_impuestos = []
            for impuesto in impuestos_pagina:
                datos_impuesto = {
                    'id_impuesto': impuesto.id_impuesto,
                    'nombre': impuesto.nombre,
                    'porcentaje': str(impuesto.porcentaje),
                }
                lista_impuestos.append(datos_impuesto)

            return JsonResponse({'impuestos': lista_impuestos, 'total': paginator.count}, safe=False)

        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)

class ListarProductos(View):
      def get(self, request, *args, **kwargs):
        try:
            # Parámetros de paginación y búsqueda
            page = int(request.GET.get('page', 1))
            size = int(request.GET.get('size', 10))
            search = request.GET.get('search', '')

            # Filtrar productos por término de búsqueda
            productos = Producto.objects.filter(nombreproducto__icontains=search, sestado=1)

            # Configurar la paginación
            paginator = Paginator(productos, size)

            try:
                # Obtener la página actual
                productos_pagina = paginator.page(page)
            except EmptyPage:
                # Si la página está fuera de rango, devolver una lista vacía
                productos_pagina = []

            # Convertir productos a formato JSON
            lista_productos = []
            for producto in productos_pagina:
                # Procesar la imagen
                imagen_base64 = None
                if producto.imagenp:
                    try:
                        byteImg = base64.b64decode(producto.imagenp)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                
                # Obtener los impuestos asociados al producto
                impuestos = producto.productoimpuestos_set.select_related('id_impuesto')
                impuestos_detalle = [
                    {'id_impuesto': impuesto.id_impuesto.id_impuesto,
                     'nombre': impuesto.id_impuesto.nombre,
                     'porcentaje': str(impuesto.id_impuesto.porcentaje)}
                    for impuesto in impuestos
                ]

                # Verificar si tiene ensamble
                ensambleexi = EnsambleProducto.objects.filter(id_producto=producto)
                if ensambleexi.exists():
                    ensamble = EnsambleProducto.objects.get(id_producto=producto)
                    detallesensamble = DetalleEnsambleProducto.objects.filter(id_emsamblep=ensamble)
                    lista_detalle = [
                        {
                            'id_componentehijo': {
                                'id': detalle.id_componentehijo.id_componente,
                                'nombre': detalle.id_componentehijo.nombre,
                            },
                            'cantidadhijo': detalle.cantidadhijo,
                            'um': {
                                'id': detalle.id_umhijo.idum,
                                'nombre': detalle.id_umhijo.nombreum,
                            },
                        } for detalle in detallesensamble
                    ]
                    compdata = {
                        'padrecant': ensamble.padrecantidad,
                        'detalle': lista_detalle,
                    }
                else:
                    compdata = None

                # Agregar datos del producto
                datos_producto = {
                    'id_producto': producto.id_producto,
                    'id_categoria': producto.id_categoria.id_categoria,
                    'id_um': producto.id_um.idum,
                    'puntosp': producto.puntosp,
                    'codprincipal': producto.codprincipal,
                    'nombreproducto': producto.nombreproducto,
                    'descripcionproducto': producto.descripcionproducto,
                    'preciounitario': str(producto.preciounitario),
                    'impuestos': impuestos_detalle,
                    'imagenp': imagen_base64,
                    'detalle': compdata,
                }
                lista_productos.append(datos_producto)

            return JsonResponse({'productos': lista_productos, 'total': paginator.count}, safe=False)

        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)
def obtener_siguiente_codprincipal():
    max_cod_producto = Producto.objects.aggregate(max_cod=Max(ExpressionWrapper(F('codprincipal'), output_field=IntegerField())))

    # Obtener el CodPrincipal más alto de Combo
    max_cod_combo = Combo.objects.aggregate(max_cod=Max(ExpressionWrapper(F('codprincipal'), output_field=IntegerField())))

    # Obtener el máximo entre los dos y calcular el siguiente número
    ultimo_numero = max(int(max_cod_producto['max_cod'] or 0), int(max_cod_combo['max_cod'] or 0))
    siguiente_numero = ultimo_numero + 1

    # Formatear el siguiente número como CodPrincipal
    siguiente_codprincipal = f'{siguiente_numero:025d}'

    return siguiente_codprincipal
@method_decorator(csrf_exempt, name='dispatch')
class procesar_productos(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # Obtén la lista de productos y cantidades
                productos_str = request.POST.getlist('productos[]')
                print('La bodega es ')
                print(request.POST.get('id_bodega'))
                id_bodega = int(request.POST.get('id_bodega'))
                id_ped=int(request.POST.get('id_pedido'))
                pedido=Pedidos.objects.get(id_pedido=id_ped)
                if productos_str:
                    productos = [json.loads(producto) for producto in productos_str]
                    for producto in productos:
                        id_producto = int(producto['id_producto'])
                        cantidad = int(producto['cantidad'])
                        if(self.procesar_producto(id_producto, cantidad, id_bodega,pedido)==0):
                            return JsonResponse({'error': 'fallo'}, status=400)
                pedido.estado_del_pedido='P'
                print("aqui llegamos")
                pedido.save()
                response_data = {'status': 'success', 'message': 'Productos procesados correctamente.'}
                return JsonResponse(response_data, status=200)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400)
    @transaction.atomic
    def procesar_producto(self, id_pro, cantidad, idbodega,idpedido):
        print('holi')
        try:
            with transaction.atomic():
                producto = Producto.objects.get(id_producto=id_pro)
                # Verificar si existe un ensamble para el producto
                ensambles = EnsambleProducto.objects.filter(id_producto=producto)
                bodega = Bodegas.objects.get(id_bodega=idbodega)
                if not ensambles.exists():
                    newmovimiento = MovimientoInventario.objects.create(
                        id_cuenta=Cuenta.objects.get(id_cuenta=1),
                        tipomovimiento='P',
                        id_pedido=idpedido,
                        id_bodega=bodega,
                        sestado='1'
                    )
                    inventario_producto = Inventario.objects.get(id_producto=producto, id_bodega=bodega)
                    detalle= DetalleMovimientoInventario.objects.create(
                        id_movimientoinventario=newmovimiento,
                        id_producto=producto,
                        cantidad=cantidad,
                        tipo='S'
                    )
                    inventario_producto.cantidad_disponible -= cantidad
                    inventario_producto.save()
                    return 1

                # Si hay ensamble, proceder con el procesamiento
                ensamble = ensambles.first()
                detalles = DetalleEnsambleProducto.objects.filter(id_emsamblep=ensamble)
                newmovimiento = MovimientoInventario.objects.create(
                    id_cuenta=Cuenta.objects.get(id_cuenta=1),
                    tipomovimiento='P',
                    id_pedido=idpedido,
                    id_bodega=bodega,
                    sestado='1'
                )

                for detalle in detalles:
                    print('holixd')
                    print('Cantidad:')
                    print(cantidad)
                    detallem= DetalleMovimientoInventario.objects.create(
                        id_movimientoinventario=newmovimiento,
                        id_articulo=detalle.id_componentehijo,
                        cantidad=detalle.cantidadhijo * cantidad,
                        tipo='S'
                    )
                    componente = detalle.id_componentehijo
                    cantidaddet = detalle.cantidadhijo * cantidad
                    print('busca:')
                    print(componente.nombre)
                    inventario_componente = Inventario.objects.get(id_componente=componente, id_bodega=bodega)
                    print("Tenemos:")
                    print(inventario_componente.cantidad_disponible)
                    print("Queremos quitar:")
                    print(cantidaddet * cantidad)
                    print("Ya que")
                    print(cantidaddet)
                    print("*")
                    print(cantidad)
                    inventario_componente.cantidad_disponible -= cantidaddet
                    inventario_componente.save()
                invent = Inventario.objects.filter(id_producto=producto, id_bodega=bodega)
                if not invent.exists:
                    invent2=Inventario.objects.create(
                        id_bodega = bodega,
                        id_producto = producto,
                        costo_unitario = 0,
                        id_um = producto.id_um,
                        stock_minimo = 0,
                        cantidad_disponible = 0
                    )
                detentradaProducto= DetalleMovimientoInventario.objects.create(
                    id_movimientoinventario=newmovimiento,
                    id_producto=producto,
                    cantidad=cantidad,
                    tipo='E'
                )
                detSalidaProducto= DetalleMovimientoInventario.objects.create(
                    id_movimientoinventario=newmovimiento,
                    id_producto=producto,
                    cantidad=cantidad,
                    tipo='S'
                )
                return 1
                print(f'Procesando producto con ID {producto} y cantidad {cantidad}')
        except Exception as e:
            traceback.print_exc()
            return 0
@method_decorator(csrf_exempt, name='dispatch')
class CrearEnsambleUnidadMedida(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            idump = request.POST.get('idump')
            idumc = request.POST.get('idumc')
            cantidadconversion = request.POST.get('cantidadconversion')
            if Decimal(cantidadconversion) != 0:
                cantidadconversioninv = 1 / Decimal(cantidadconversion)
                print(cantidadconversioninv)
            else:
                print('Dividio por cero xd')
                return JsonResponse({'error': 'Dividir por cero'}, status=400)
            unidapadre=UnidadMedida.objects.get(idum=idump)
            unidahijo=UnidadMedida.objects.get(idum=idumc)
            ensamble_existente = EnsambleUnidadMedida.objects.filter(idump=unidapadre, idumc=unidahijo).first()
            if ensamble_existente:
                ensamble_existente.cantidadconversion = cantidadconversion
                ensamble_existente.save()
            else:
                unidad_medida_padre = UnidadMedida.objects.get(idum=idump)
                unidad_medida_hijo = UnidadMedida.objects.get(idum=idumc)
                EnsambleUnidadMedida.objects.create(
                    idump=unidad_medida_padre,
                    idumc=unidad_medida_hijo,
                    cantidadconversion=cantidadconversion
                )
            inverso_existente = EnsambleUnidadMedida.objects.filter(idump=unidahijo, idumc=unidapadre).first()
            if inverso_existente:
                inverso_existente.cantidadconversion = cantidadconversioninv
                inverso_existente.save()
            else:
                unidad_medida_padre = UnidadMedida.objects.get(idum=idump)
                unidad_medida_hijo = UnidadMedida.objects.get(idum=idumc)
                EnsambleUnidadMedida.objects.create(
                    idump=unidad_medida_hijo,
                    idumc=unidad_medida_padre,
                    cantidadconversion=cantidadconversioninv
                )


            return JsonResponse({'mensaje': 'Ensamble de unidad de medida creado o actualizado con éxito'})

        except UnidadMedida.DoesNotExist as e:
            return JsonResponse({'error': 'Una o ambas unidades de medida no existen'}, status=400)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400)
class ListaConversiones(View):
    def get(self, request, *args, **kwargs):
        try:
            # Obtener todas las conversiones
            conversiones = EnsambleUnidadMedida.objects.all()

            # Crear una lista para almacenar los resultados
            lista_conversiones = []

            # Iterar sobre cada ensamble de unidad de medida
            for conversion in conversiones:
                # Obtener los detalles de la unidad de medida padre
                unidad_padre = UnidadMedida.objects.get(idum=conversion.idump_id)
                nombre_unidad_padre = unidad_padre.nombreum

                # Obtener los detalles de la unidad de medida hijo
                unidad_hijo = UnidadMedida.objects.get(idum=conversion.idumc_id)
                nombre_unidad_hijo = unidad_hijo.nombreum

                # Crear un diccionario con los detalles de la conversión
                detalle_conversion = {
                    'id_conversion': conversion.ideum,
                    'unidad_padre': {
                        'id_um': conversion.idump_id,
                        'nombre_um': nombre_unidad_padre,
                    },
                    'unidad_hijo': {
                        'id_um': conversion.idumc_id,
                        'nombre_um': nombre_unidad_hijo,
                    },
                    'cantidad_conversion': conversion.cantidadconversion,
                }

                # Agregar el diccionario a la lista de conversiones
                lista_conversiones.append(detalle_conversion)

            return JsonResponse({'conversiones': lista_conversiones})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
class ListarProductosPorCategoria(View):
    def get(self, request, categoria_id, *args, **kwargs):
        try:
            # Parámetros de paginación y búsqueda
            page = int(request.GET.get('page', 1))
            size = int(request.GET.get('size', 10))
            search = request.GET.get('search', '')

            # Filtrar productos por término de búsqueda y categoría
            productos = Producto.objects.filter(nombreproducto__icontains=search,
                                                 id_categoria=categoria_id,
                                                 sestado=1)

            # Configurar la paginación
            paginator = Paginator(productos, size)

            try:
                # Obtener la página actual
                productos_pagina = paginator.page(page)
            except EmptyPage:
                # Si la página está fuera de rango, devolver una lista vacía
                productos_pagina = []

            # Inicializar la lista de productos
            lista_productos = []

            for producto in productos_pagina:
                imagen_base64 = None
                if producto.imagenp:
                    try:
                        byteImg = base64.b64decode(producto.imagenp)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                
                # Agregar los datos del producto a la lista de productos
                datos_producto = {
                    'id_producto': producto.id_producto,
                    'catnombre': producto.id_categoria.catnombre,
                    'id_um': producto.id_um.idum,
                    'puntosp': producto.puntosp,
                    'codprincipal': producto.codprincipal,
                    'nombreproducto': producto.nombreproducto,
                    'descripcionproducto': producto.descripcionproducto,
                    'preciounitario': str(producto.preciounitario),
                    'iva': producto.iva,
                    'ice': producto.ice,
                    'irbpnr': producto.irbpnr,
                    'imagenp': imagen_base64,
                }
                lista_productos.append(datos_producto)

            return JsonResponse({'productos': lista_productos, 'total': paginator.count}, safe=False)

        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)
class ListarTodosLosProductos(View):
    def get(self, request, *args, **kwargs):
        try:
            # Parámetros de paginación y búsqueda
            page = int(request.GET.get('page', 1))
            size = int(request.GET.get('size', 10))
            search = request.GET.get('search', '')

            # Filtrar productos por término de búsqueda
            productos = Producto.objects.filter(nombreproducto__icontains=search, sestado=1)

            # Configurar la paginación
            paginator = Paginator(productos, size)

            try:
                # Obtener la página actual
                productos_pagina = paginator.page(page)
            except EmptyPage:
                # Si la página está fuera de rango, devolver una lista vacía
                productos_pagina = []

            # Inicializar la lista de productos
            lista_productos = []

            for producto in productos_pagina:
                imagen_base64 = None
                if producto.imagenp:
                    try:
                        byteImg = base64.b64decode(producto.imagenp)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                
                # Agregar los datos del producto a la lista de productos
                datos_producto = {
                    'id_producto': producto.id_producto,
                    'catnombre': producto.id_categoria.catnombre,
                    'id_um': producto.id_um.idum,
                    'puntosp': producto.puntosp,
                    'codprincipal': producto.codprincipal,
                    'nombreproducto': producto.nombreproducto,
                    'descripcionproducto': producto.descripcionproducto,
                    'preciounitario': str(producto.preciounitario),
                    'iva': producto.iva,
                    'ice': producto.ice,
                    'irbpnr': producto.irbpnr,
                    'imagenp': imagen_base64,
                }
                lista_productos.append(datos_producto)

            return JsonResponse({'productos': lista_productos, 'total': paginator.count}, safe=False)

        except Exception as e:
            # Manejar errores aquí
            return JsonResponse({'error': str(e)}, status=500)
