from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from Empleados.models import *
from django.db import transaction
from PIL import Image,UnidentifiedImageError
import base64
from io import BytesIO
import json
import traceback
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from Empresa.models import Horariossemanales,DetalleHorariosSemanales
from Ubicaciones.models import Geosectores,DetalleGeosector
import jwt
import datetime
from django.conf import settings
from utils import autenticarUsuario


from .models import Empresa,Sucursales

@method_decorator(csrf_exempt, name='dispatch')
class EmpresaDatosView(View):
    def post(self, request, *args, **kwargs):
        try:

            empresa = Empresa.objects.first()
            imagen_base64 = None
            if empresa:
                if empresa.elogo:
                    try:
                        byteImg = base64.b64decode(empresa.elogo)
                        imagen_base64 = base64.b64encode(byteImg).decode('utf-8')
                    except Exception as img_error:
                        print(f"Error al procesar imagen: {str(img_error)}")
                empresa_info = {
                    'id_empresa': empresa.id_empresa if empresa.id_empresa else '',
                    'enombre': empresa.enombre if empresa.enombre else '',
                    'direccion': empresa.direccion if empresa.direccion else '',
                    'etelefono': empresa.etelefono if empresa.etelefono else '',
                    'correoelectronico': empresa.correoelectronico if empresa.correoelectronico else '',
                    'fechafundacion': empresa.fechafundacion if empresa.fechafundacion else None,
                    'sitioweb': empresa.sitioweb if empresa.sitioweb else '',
                    'eslogan': empresa.eslogan if empresa.eslogan else '',
                    'empleados': cantidaEmp(0) if cantidaEmp(0) else 0,
                    'edescripcion': empresa.edescripcion if empresa.edescripcion else '',
                    'docmenu': empresa.docmenu if empresa.docmenu else None,
                    'elogo': imagen_base64,
                }
            else:
                empresa_info = {
                    'id_empresa': None,
                    'enombre':None,
                    'direccion': None,
                    'etelefono':None,
                    'correoelectronico': None,
                    'fechafundacion': None,
                    'sitioweb': None,
                    'eslogan': None,
                    'empleados': 0,
                    'edescripcion': None,
                    'docmenu': None,
                    'elogo': None,
                }
                # Devuelve la información como respuesta JSON
            return JsonResponse({'mensaje': 'Datos de la empresa', 'empresa_info': empresa_info})
        except Exception as e:
            error_trace = traceback.format_exc()  # Obtiene el traceback como cadena
            print(error_trace)

            return JsonResponse({
                'error': str(e),
                'traceback': error_trace
            }, status=500)
def cantidaEmp(ids):
        if ids:
            # = JefeCocina.objects.filter(id_sucursal=ids).count()
            #motorizados = Motorizado.objects.filter(id_sucursal=ids).count()
            # administradores = Administrador.objects.filter(id_sucursal=ids).count()
            administradores=0
            #meseros = Mesero.objects.filter(id_sucursal=ids).count()
        else:
            #jefes_cocina = JefeCocina.objects.all().count()
            #motorizados = Motorizado.objects.all().count()
            administradores = Administrador.objects.all().count()
            #meseros = Mesero.objects.all().count()
        return administradores 

@method_decorator(csrf_exempt, name='dispatch')
class EditarEmpresaDatosView(View):
    def post(self, request, *args, **kwargs):
        # Verifica si existe una empresa, si no, crea una
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
        
        empresa, created = Empresa.objects.get_or_create(
            id_empresa=1,  # Puedes definir un valor fijo para asegurar la unicidad
            defaults={
                'enombre': 'Nueva Empresa',
                'direccion': '',
                'etelefono': '',
                'correoelectronico': '',
                'fechafundacion': '2000-01-01',  # Fecha por defecto
                'sitioweb': '',
                'eslogan': '',
                'edescripcion': '',
            }
        )

        # Actualiza los datos de la empresa con los valores del POST
        empresa.enombre = request.POST.get('enombre', empresa.enombre)
        empresa.direccion = request.POST.get('direccion', empresa.direccion)
        empresa.etelefono = request.POST.get('etelefono', empresa.etelefono)
        empresa.correoelectronico = request.POST.get('correoelectronico', empresa.correoelectronico)
        empresa.fechafundacion = request.POST.get('fechafundacion', empresa.fechafundacion)
        empresa.sitioweb = request.POST.get('sitioweb', empresa.sitioweb)
        empresa.eslogan = request.POST.get('eslogan', empresa.eslogan)
        empresa.edescripcion = request.POST.get('edescripcion', empresa.edescripcion)
        empresa.docmenu = request.FILES.get('docmenu', empresa.docmenu)

        # Procesa la imagen si se envía
        imagen_p = request.FILES.get('elogo')
        if imagen_p:
            try:
                image_read = imagen_p.read()
                image_64_encode = base64.b64encode(image_read)
                empresa.elogo = image_64_encode
            except UnidentifiedImageError as img_error:
                return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

        empresa.save()

        if created:
            mensaje = 'Empresa creada y datos actualizados correctamente.'
        else:
            mensaje = 'Datos de la empresa actualizados correctamente.'

        return JsonResponse({'mensaje': mensaje})
    
@method_decorator(csrf_exempt, name='dispatch')
class Crearsucursal(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Obtener el token de los encabezados de la solicitud
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

            # Continuar con la creación de la sucursal
            razon_social = request.POST.get('razonsocial')
            ruc = request.POST.get('sruc')
            capacidad = request.POST.get('capacidad')
            correo = request.POST.get('scorreo')
            telefono = request.POST.get('ctelefono')
            direccion = request.POST.get('sdireccion')
            nombre = request.POST.get('snombre')
            firmaelectronica = request.POST.get('firma')

            image_64_encode = None
            imagen_p = request.FILES.get('imagen')
            if imagen_p:
                try:
                    image_read = imagen_p.read()
                    image_64_encode = base64.b64encode(image_read)
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)


            empresa = Empresa.objects.first()  # O la lógica que uses para obtener la empresa
            cuenta = user  # Usamos el usuario autenticado

            # Crear la sucursal
            empresa.crear_sucursal(
                srazon_social=razon_social,
                sruc=ruc,
                sestado='1',
                scapacidad=capacidad,
                scorreo=correo,
                stelefono=telefono,
                sdireccion=direccion,
                snombre=nombre,
                firmaelectronica=firmaelectronica,
                imagensucursal=image_64_encode,
                id_cuenta=cuenta
            )

            return JsonResponse({'mensaje': 'Sucursal creada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

class SucursalesListView(View):
    def get(self, request, *args, **kwargs):
        try:
            #comentario
            sucursales = Sucursales.objects.all().order_by('id_sucursal')
            paginator = Paginator(sucursales, 200) 
            page = request.POST.get('pageSize')

            try:
                sucursales_list = paginator.page(page)
            except PageNotAnInteger:
                sucursales_list = paginator.page(1)
            except EmptyPage:
                sucursales_list = paginator.page(paginator.num_pages)

            serialized_sucursales = []
            for sucursal in sucursales_list:
                # Código para redimensionar la imagen
                if sucursal.imagensucursal:
                    img = Image.open(BytesIO(base64.b64decode(sucursal.imagensucursal)))
                    img = img.resize((500, 500))
                    buffered = BytesIO()
                    img.save(buffered, format="PNG")
                    imagen_base64_resized = base64.b64encode(buffered.getvalue()).decode('utf-8')
                else:
                    imagen_base64_resized = None
                
                # Información sobre ubicación
                ubicacion_info = {
                    'id_ubicacion': sucursal.id_ubicacion.id_ubicacion if sucursal.id_ubicacion else None,
                    'latitud': sucursal.id_ubicacion.latitud if sucursal.id_ubicacion else None,
                    'longitud': sucursal.id_ubicacion.longitud if sucursal.id_ubicacion else None,
                    'udescripcion': sucursal.id_ubicacion.udescripcion if sucursal.id_ubicacion else None,
                }

                # Información sobre horario
                horario_info = None
                if sucursal.id_horarios:
                    horario = Horariossemanales.objects.get(id_horarios=sucursal.id_horarios.id_horarios)
                    detalles_horario = DetalleHorariosSemanales.objects.filter(id_horarios=horario)
                    horario_info = {
                        'nombreh': horario.nombreh,
                        'detalles': [
                            {
                                'dia': detalle.dia,
                                'horainicio': detalle.horainicio.strftime('%H:%M:%S'),
                                'horafin': detalle.horafin.strftime('%H:%M:%S'),
                            }
                            for detalle in detalles_horario
                        ],
                    }
                sucursal_info = {
                    'id_sucursal': sucursal.id_sucursal,
                    'srazon_social': sucursal.srazon_social,
                    'sruc': sucursal.sruc,
                    'sestado': sucursal.sestado,
                    'scapacidad': sucursal.scapacidad,
                    'scorreo': sucursal.scorreo,
                    'stelefono': sucursal.stelefono,
                    'sdireccion': sucursal.sdireccion,
                    'snombre': sucursal.snombre,
                    'fsapertura': sucursal.fsapertura.strftime('%Y-%m-%d') if sucursal.fsapertura else None,
                    'id_horarios': horario_info,
                    'id_geosector': getattr(sucursal.id_geosector, 'id_geosector', None),
                    'firmaelectronica': sucursal.firmaelectronica,
                    'id_empresa': sucursal.id_empresa_id,
                    'id_ubicacion': ubicacion_info,
                    'cantidadempleados':cantidaEmp(sucursal.id_sucursal),
                    'imagensucursal': imagen_base64_resized,
                    'horario': horario_info,
                }
                serialized_sucursales.append(sucursal_info)
            return JsonResponse({'sucursales': serialized_sucursales}, safe=False)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class sucursalExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            srazon_social = data.get('srazon_social')
            sruc = data.get('sruc')
            snombre = data.get('snombre')
            if srazon_social is not None:
                if Sucursales.objects.filter(srazon_social=srazon_social).first():
                    return JsonResponse({'mensaje': '1'})
            if sruc is not None:
                if Sucursales.objects.filter(sruc=sruc).first():
                    return JsonResponse({'mensaje': '1'})
            if snombre is not None:
                if Sucursales.objects.filter(snombre=snombre).first():
                    return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class cargarSucursal(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            id_sucursal = kwargs.get('id_sucursal') 
            print(id_sucursal)
            sucursal = Sucursales.objects.get(id_sucursal=id_sucursal)
            
            if sucursal.imagensucursal:
                img = Image.open(BytesIO(base64.b64decode(sucursal.imagensucursal)))
                img = img.resize((500, 500))
                buffered = BytesIO()
                img.save(buffered, format="PNG")
                imagen_base64_resized = base64.b64encode(buffered.getvalue()).decode('utf-8')
            else:
                imagen_base64_resized = None
            
            # Obtener información de ubicación del geosector
            geosector_info = None
            if sucursal.id_geosector:
                detalle_geosector = DetalleGeosector.objects.filter(id_geosector=sucursal.id_geosector)
                ubicaciones_geosector = [{
                    'id_ubicacion': detalle.id_ubicacion.id_ubicacion,
                    'latitud': detalle.id_ubicacion.latitud,
                    'longitud': detalle.id_ubicacion.longitud,
                    'udescripcion': detalle.id_ubicacion.udescripcion,
                } for detalle in detalle_geosector]

                geosector_info = {
                    'id_geosector': sucursal.id_geosector.id_geosector,
                    'secnombre': sucursal.id_geosector.secnombre,
                    'secdescripcion': sucursal.id_geosector.secdescripcion,
                    'fechacreaciong': sucursal.id_geosector.fechacreaciong.strftime('%Y-%m-%d %H:%M:%S'),
                    'secestado': sucursal.id_geosector.secestado,
                    'sectipo': sucursal.id_geosector.sectipo,
                    'sestado': sucursal.id_geosector.sestado,
                    'tarifa': sucursal.id_geosector.tarifa,
                    'ubicaciones_geosector': ubicaciones_geosector,
                }

            ubicacion_info = {
                'id_ubicacion': sucursal.id_ubicacion.id_ubicacion if sucursal.id_ubicacion else None,
                'latitud': sucursal.id_ubicacion.latitud if sucursal.id_ubicacion else None,
                'longitud': sucursal.id_ubicacion.longitud if sucursal.id_ubicacion else None,
                'udescripcion': sucursal.id_ubicacion.udescripcion if sucursal.id_ubicacion else None,
            }
            
            cantidad_empleados = cantidaEmp(sucursal.id_sucursal)
            serialized_sucursales = []
            horarioact=None
            if sucursal.id_horarios:
                horarioact=sucursal.id_horarios.id_horarios
            sucursal_info  = {
                'id_sucursal': sucursal.id_sucursal,
                'srazon_social': sucursal.srazon_social,
                'sruc': sucursal.sruc,
                'sestado': sucursal.sestado,
                'scapacidad': sucursal.scapacidad,
                'scorreo': sucursal.scorreo,
                'stelefono': sucursal.stelefono,
                'sdireccion': sucursal.sdireccion,
                'snombre': sucursal.snombre,
                'fsapertura': sucursal.fsapertura.strftime('%Y-%m-%d') if sucursal.fsapertura else None,
                'id_horarios': horarioact,
                'id_geosector': geosector_info,
                'firmaelectronica': sucursal.firmaelectronica,
                'id_empresa': sucursal.id_empresa_id,
                'id_ubicacion': ubicacion_info,
                'cantidadempleados': cantidad_empleados,
                'imagensucursal': imagen_base64_resized,
            }

            serialized_sucursales.append(sucursal_info)
            return JsonResponse({'mensaje': serialized_sucursales})    
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class EditarSucursal(View):
    #@method_decorator(login_required)
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            #cuenta = Cuenta.objects.get(nombreusuario=request.user.username)
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                # Decodificar el token
                user=autenticarUsuario(token)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if(user.rol!='A'):
                return JsonResponse({'error': 'No tienes permiso para editar la sucursal'}, status=400)
            
            id_sucursal = kwargs.get('id_sucursal') 
            sucursal = Sucursales.objects.get(id_sucursal=id_sucursal)
            razon_social = request.POST.get('razonsocial')
            ruc = request.POST.get('sruc')
            capacidad=request.POST.get('capacidad')
            correo= request.POST.get('scorreo')
            telefono= request.POST.get('ctelefono')
            direccion= request.POST.get('sdireccion')
            nombre= request.POST.get('snombre')
            sucursal.srazon_social=razon_social
            sucursal.sruc=ruc
            sucursal.scapacidad = capacidad
            sucursal.scorreo =correo
            sucursal.stelefono=telefono
            sucursal.sdireccion=direccion
            sucursal.snombre=nombre
            imagensucursal = request.FILES.get('imagensucursal')
            if imagensucursal:
                try:
                    image_read = imagensucursal.read()
                    image_64_encode = base64.b64encode(image_read)
                    image_encoded = image_64_encode.decode('utf-8')
                    sucursal.imagensucursal=image_64_encode
                except UnidentifiedImageError as img_error:
                    return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)
            sucursal.save()
            return JsonResponse({'mensaje': 'Sucursal editada con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class Editarubicacion(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                # Decodificar el token
                user=autenticarUsuario(token)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if(user.rol!='A'):
                return JsonResponse({'error': 'No tienes permiso para editar la sucursal'}, status=400)
            
            id_sucursal = request.POST.get('id_sucursal')
            if id_sucursal is None:
                return JsonResponse({'error': 'ID de sucursal no proporcionado'}, status=400)
            sucursaledit = Sucursales.objects.get(id_sucursal=id_sucursal)
            latitudx = request.POST.get('latitud')
            longitudx = request.POST.get('longitud')
            sucursaledit.agg_ubicacion(latitudx=latitudx, longitudx=longitudx)
            return JsonResponse({'mensaje': 'Sucursal editada con éxito'})
        except Sucursales.DoesNotExist:
            return JsonResponse({'error': 'La sucursal no existe'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class CrearHorarioSucursal(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                # Decodificar el token
                user=autenticarUsuario(token)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if(user.rol!='A'):
                return JsonResponse({'error': 'No tienes permiso para editar la sucursal'}, status=400)
            # Obtener datos del cuerpo de la solicitud
            nombreh = request.POST.get('nombreh', '')
            hordescripcion = request.POST.get('hordescripcion', '')
            idsucursal = request.POST.get('idsucursal', '')
            detalle = json.loads(request.POST.get('detalle', '[]'))
            sucursal= Sucursales.objects.get(id_sucursal=idsucursal)
            sucursal.id_horarios=Horariossemanales.objects.create(
                nombreh=nombreh,
                hordescripcion=hordescripcion,
                tipohorario='A',
            )
            sucursal.save()
            
            for det in detalle['Detalles']:
                id_horarios = sucursal.id_horarios
                dia = det['dia']
                hora_inicio = det['hora_inicio']
                hora_fin=det['hora_fin']
                DetalleHorariosSemanales.objects.create(
                    id_horarios = id_horarios,
                    dia =dia,
                    horainicio = hora_inicio,
                    horafin = hora_fin
                )
            return JsonResponse({'mensaje': 'Horario agregado con exito'})
        
        except Exception as e:
            print( str(e))
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class DetallesHorarioView(View):
    def get(self, request, *args, **kwargs):
        try:
            id_horario = kwargs.get('id_horario')
            print(id_horario)
            detalles = DetalleHorariosSemanales.objects.filter(id_horarios=id_horario)
            print(detalles[0].dia)
            detalles_list = [{'dia': nombre_dia(detalle.dia), 'hora_inicio': detalle.horainicio, 'hora_fin': detalle.horafin} for detalle in detalles]
            return JsonResponse({'detalles': detalles_list})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
def nombre_dia(dia):
    if dia=='L':
        return 'Lunes'
    if dia=='M':
        return 'Martes'
    if dia=='X':
        return 'Miercoles'
    if dia=='J':
        return 'Jueves'
    if dia=='V':
        return 'Viernes'
    if dia=='S':
        return 'Sabado'
    if dia=='D':
        return 'Domingo'
    
@method_decorator(csrf_exempt, name='dispatch')
class EditarHorarioSucursal(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                # Decodificar el token
                user=autenticarUsuario(token)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if(user.rol!='A'):
                return JsonResponse({'error': 'No tienes permiso para editar el horario de una sucursal'}, status=400)
            id_horario = kwargs.get('id_horario')
            detalles_actuales = DetalleHorariosSemanales.objects.filter(id_horarios=id_horario)           
            detalles_nuevos = json.loads(request.POST.get('detalle', '[]'))
            id_horarios = Horariossemanales.objects.get(id_horarios=id_horario)
            i=0
            for det in detalles_nuevos['Detalles']:
                if i < len(detalles_actuales):
                    detalle_actual = detalles_actuales[i]
                    detalle_actual.dia = det['dia']
                    detalle_actual.horainicio = det['hora_inicio']
                    detalle_actual.horafin = det['hora_fin']
                    detalle_actual.save()
                    
                else:
                    DetalleHorariosSemanales.objects.create(
                        id_horarios=id_horarios,
                        dia=det['dia'],
                        horainicio=det['hora_inicio'],
                        horafin=det['hora_fin']
                    )
                i=i+1
            return JsonResponse({'mensaje': 'Horario actualizado con éxito'})
        
        except Exception as e:
            print(str(e))
            return JsonResponse({'error': str(e)}, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class CrearGeosector(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            token = request.headers.get('Authorization', '').split('Bearer ')[-1]

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            try:
                # Decodificar el token
                user=autenticarUsuario(token)
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'Token ha expirado'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Token inválido'}, status=400)
            if(user.rol!='A'):
                return JsonResponse({'error': 'No tienes permiso para crear un sector en la sucursal'}, status=400)
            # Obtener datos del formulario
            secnombre = request.POST.get('secnombre')
            secdescripcion = request.POST.get('secdescripcion')
            id_sucursal = request.POST.get('id_sucursal')
            datos_geosector_str = request.POST.get('datosGeosector', '[]')
            datos_geosector = json.loads(datos_geosector_str)

            # Buscar la sucursal
            sucursal = Sucursales.objects.get(id_sucursal=id_sucursal)

            # Llamar al método del modelo para crear el geosector
            geosector = sucursal.crear_geosector(
                secnombre=secnombre,
                secdescripcion=secdescripcion,
                datos_geosector=datos_geosector,
            )
            sucursal.save()

            return JsonResponse({'mensaje': 'Geosector creado con éxito', 'id_geosector': geosector.id_geosector})

        except Sucursales.DoesNotExist:
            return JsonResponse({'error': 'Sucursal no encontrada'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


# @method_decorator(csrf_exempt, name='dispatch')
# class CrearHorarioProducto(View):
#     @transaction.atomic
#     def post(self, request, *args, **kwargs):
#         try:
#             # Obtener datos del cuerpo de la solicitud
#             nombreh = request.POST.get('nombreh', '')
#             hordescripcion = request.POST.get('hordescripcion', '')
#             idsucursal = request.POST.get('idsucursal', '')
#             idproducto = request.POST.get('idproducto', '')
#             detalle = json.loads(request.POST.get('detalle', '[]'))
#             sucursal= Sucursales.objects.get(id_sucursal=idsucursal)
#             Productox= Producto.objects.get(id_producto=idproducto)
#             horariosem=Horariossemanales.objects.create(
#                     nombreh=nombreh,
#                     hordescripcion=hordescripcion,
#                     tipohorario='P',
#                 )
#             HorarioProductoz=HorarioProducto.objects.create(
#                 id_horarios = horariosem,
#                 id_sucursal = sucursal,
#                 id_producto = Productox
#             )

#             HorarioProductoz.save()
            
#             for det in detalle['Detalles']:
#                 id_horarios = HorarioProductoz.id_horarios
#                 print(id_horarios)
#                 print(f"hla uwu")
#                 dia = det['dia']
#                 hora_inicio = det['hora_inicio']
#                 hora_fin=det['hora_fin']
#                 DetalleHorariosSemanales.objects.create(
#                     id_horarios = id_horarios,
#                     dia =dia,
#                     horainicio = hora_inicio,
#                     horafin = hora_fin
#                 )
#             return JsonResponse({'mensaje': 'Horario agregado con exito'})
        
#         except Exception as e:
#             print( str(e))
#             return JsonResponse({'error': str(e)}, status=400)

# @method_decorator(csrf_exempt, name='dispatch')
# class EditarCombo(View):
#     @transaction.atomic
#     def post(self, request, *args, **kwargs):
#         try:
#             combo_id = kwargs.get('combo_id')
#             combo = Combo.objects.get(id_combo=combo_id)

#             # Resto del código para actualizar campos del combo...
#             combo.id_catcombo = CategoriasCombos.objects.get(id_catcombo=request.POST.get('id_catcombo', combo.id_catcombo.id_catcombo))
#             combo.puntoscb = request.POST.get('puntoscb', combo.puntoscb)
#             combo.nombrecb = request.POST.get('nombrecb', combo.nombrecb)
#             combo.descripcioncombo = request.POST.get('descripcioncombo', combo.descripcioncombo)
#             combo.preciounitario = request.POST.get('preciounitario', combo.preciounitario)
#             combo.iva = request.POST.get('iva', combo.iva)
#             combo.ice = request.POST.get('ice', combo.ice)
#             combo.irbpnr = request.POST.get('irbpnr', combo.irbpnr)

#             # Manejo de la imagen
#             imagencategoria = request.FILES.get('imagencategoria', None)
#             if imagencategoria:
#                 try:
#                     image_read = imagencategoria.read()
#                     image_64_encode = base64.b64encode(image_read)
#                     image_encoded = image_64_encode.decode('utf-8')
#                     combo.imagenc = image_64_encode

#                 except UnidentifiedImageError as img_error:
#                     return JsonResponse({'error': f"Error al procesar imagen: {str(img_error)}"}, status=400)

#             # Eliminar los detalles actuales del combo
#             combo.detallecombo_set.all().delete()

#             # Procesar los nuevos detalles del combo
#             detalle_combo_data = json.loads(request.POST.get('detalle_combo', '[]'))
#             for detalle_data in detalle_combo_data:
#                 id_producto = detalle_data.get('id_producto')
#                 cantidad = detalle_data.get('cantidad')
#                 producto = Producto.objects.get(id_producto=id_producto)

#                 # Crea y guarda el detalle del combo
#                 DetalleCombo.objects.create(
#                     id_combo=combo,
#                     id_producto=producto,
#                     cantidad=cantidad
#                 )

#                 # Actualizar valores de IVA, ICE e IRBPNR del combo según el producto
#                 combo.iva = '1' if producto.iva == '1' else combo.iva
#                 combo.ice = '1' if producto.ice == '1' else combo.ice
#                 combo.irbpnr = '1' if producto.irbpnr == '1' else combo.irbpnr

#             combo.save()

#             return JsonResponse({'mensaje': 'Combo editado con éxito'})
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
