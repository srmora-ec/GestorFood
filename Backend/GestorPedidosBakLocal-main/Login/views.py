from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.db import transaction
import json
from .models import Cuenta, Clientes
from Ubicaciones.models import Ubicaciones
from  Empleados.Mesero.models import Meseros
from  Empleados.jefecocina.models import JefeCocina
from django.contrib.auth.hashers import make_password, check_password
from Administrador.models import Administrador
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
import jwt
from django.conf import settings
from django.shortcuts import get_object_or_404

import traceback

#----------------------
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import jwt
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from django.conf import settings
from utils import autenticarUsuario

 #Secret key para la generación de tokens
SECRET_KEY = settings.SECRET_KEY
#----------------------------------------------

# Función para obtener el rol del usuario
def get_role(user):
    try:
        return user.rol  # Directamente accedemos al atributo `rol` del modelo `Cuenta`
    except AttributeError:
        return None

# Generar token personalizado
def generate_token(user):
    expiration_time = datetime.utcnow() + timedelta(hours=24)
    payload = {
        'user_id': user.id_cuenta,
        'exp': expiration_time,
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# Vista para iniciar sesión
@api_view(['POST'])
@csrf_exempt
def iniciar_sesion(request):
    """
    Maneja el inicio de sesión verificando el usuario y contraseña, y devuelve un token junto con información del usuario.
    """
    try:
        data = json.loads(request.body)
        nombreusuario = data.get('nombreusuario')
        contrasenia = data.get('contrasenia')

        # Autenticar usuario
        user = authenticate(username=nombreusuario, password=contrasenia)
        if user is not None:
            # Generar token
            token = generate_token(user)

            # Respuesta con los datos necesarios
            return Response({
                'token': token,
                'nombreusuario': user.username,
                'id_cuenta': user.id_cuenta,
                'rol':user.rol
            }, status=status.HTTP_200_OK)
        else:
            return Response({'mensaje': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Vista para obtener el rol del usuario
@api_view(['POST'])
@csrf_exempt
def obtener_rol(request):
    """
    Verifica el rol del usuario basado en su token.
    """
    data = request.data
    token = data.get('token')
    print(token)

    if not token:
        return JsonResponse({'error': 'Token no proporcionado'}, status=400)
    try:
                # Decodificar el token
        user=autenticarUsuario(token)
    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token ha expirado'}, status=400)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Token inválido'}, status=400)

        # Obtener el rol de la cuenta
    rol = user.rol
    if rol:
        return Response({"rol": rol}, status=status.HTTP_200_OK)
    else:
        return Response({"mensaje": "Rol no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    
@method_decorator(csrf_exempt, name='dispatch')
class usuarioExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            # if not token:
            #     return JsonResponse({'error': 'Token no proporcionado'}, status=400)

            # try:
            #         # Decodificar el token
            #     user=autenticarUsuario(token)
            # except jwt.ExpiredSignatureError:
            #     return JsonResponse({'error': 'Token ha expirado'}, status=400)
            # except jwt.InvalidTokenError:
            #     return JsonResponse({'error': 'Token inválido'}, status=400)
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')

            cuenta=Cuenta.objects.filter(username=nombre_usuario).first()
            if cuenta is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class telefonoExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            # if not token:
            #     return JsonResponse({'error': 'Token no proporcionado'}, status=400)

            # try:
            #         # Decodificar el token
            #     user=autenticarUsuario(token)
            # except jwt.ExpiredSignatureError:
            #     return JsonResponse({'error': 'Token ha expirado'}, status=400)
            # except jwt.InvalidTokenError:
            #     return JsonResponse({'error': 'Token inválido'}, status=400)
            data = json.loads(request.body)
            telefonouser = data.get('ctelefono')

            # cliente=Clientes.objects.filter(telefono=telefonouser).first()
            administrador=Administrador.objects.filter(telefono=telefonouser).first()
            mesero=Meseros.objects.filter(telefono=telefonouser).first()
            cocinero=JefeCocina.objects.filter(telefono=telefonouser).first()


            if administrador or mesero or cocinero is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)
        






        

@method_decorator(csrf_exempt, name='dispatch')
class CrearUsuarioView(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            nombre_usuario = data.get('nombreusuario')
            contrasenia = data.get('contrasenia')
            ctelefono = data.get('ctelefono')
            razons= data.get('crazon_social')
            tipocliente= data.get('tipocliente')
            snombre=data.get('snombre')
            capellido=data.get('capellido')
            ruc_cedula= data.get('ruc_cedula')
            correorecuperacion=data.get('correorecuperacion')
            latitudx = data.get('latitud')
            longitudx = data.get('longitud')
            user = User.objects.create_user(username=nombre_usuario, password=contrasenia)
            cuenta_nueva  = Cuenta.objects.create(
                nombreusuario=nombre_usuario,
                contrasenia= make_password(contrasenia),
                estadocuenta ='1',
                rol = 'C',
                correorecuperacion =correorecuperacion
            )
            if(latitudx and longitudx):
                print('XD');
                nueva_ubicacion = Ubicaciones.objects.create(
                    latitud=latitudx,
                    longitud=longitudx,
                    sestado=1
                )
                cliente_nuevo  = Clientes.objects.create(
                    ctelefono=ctelefono,
                    id_cuenta=cuenta_nueva,
                    crazon_social = razons,
                    tipocliente = tipocliente,
                    snombre = snombre,
                    capellido = capellido,
                    ruc_cedula = ruc_cedula,
                    ccorreo_electronico = correorecuperacion,
                    id_ubicacion1=nueva_ubicacion,
                    sestado=1
                )
            else:
                cliente_nuevo  = Clientes.objects.create(
                    ctelefono=ctelefono,
                    id_cuenta=cuenta_nueva,
                    crazon_social = razons,
                    tipocliente = tipocliente,
                    snombre = snombre,
                    capellido = capellido,
                    ruc_cedula = ruc_cedula,
                    ccorreo_electronico = correorecuperacion,
                    sestado=1
                )
            return JsonResponse({'mensaje': 'Usuario creado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)










@method_decorator(csrf_exempt, name='dispatch')
class VerificarRolView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            token = data.get('token')

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)

            # Decodificar el token para obtener la información del usuario
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Extraer el rol del payload
            rol = payload.get('rol')

            if rol:
                return JsonResponse({'rol': rol})
            else:
                return JsonResponse({'error': 'No se pudo extraer el rol del token'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expirado'}, status=401)

        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token inválido'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class DevolverUsuario(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            token = data.get('token')

            if not token:
                return JsonResponse({'error': 'Token no proporcionado'}, status=400)

            # Decodificar el token para obtener la información del usuario
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Extraer el rol del payload
            cuenta = payload.get('id_cuenta')

            if cuenta:
                return JsonResponse({'id_cuenta': cuenta})
            else:
                return JsonResponse({'error': 'No se pudo extraer la cuenta del token'}, status=500)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token expirado'}, status=401)

        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Token inválido'}, status=401)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def handle_cliente(self, cuenta):
        cliente = Clientes.objects.filter(id_cuenta=cuenta.id_cuenta).first()

        cliente_info = {
            'id_cliente' : cliente.id_cliente,
            'username':cliente.id_cuenta.nombreusuario,
            'razon_social': cliente.crazon_social,
            'telefono': cliente.ctelefono,
            'tipo_cliente': cliente.tipocliente,
            'nombre': cliente.snombre,
            'apellido': cliente.capellido,
            'puntos': cliente.cpuntos,
            'correo_electronico': cliente.ccorreo_electronico,
            'ubicacion': cliente.ubicacion,
            'fecha_registro':cliente.cregistro,
            'ruc_cedula':cliente.ruc_cedula,
            'id_cuenta':cliente.id_cuenta.id_cuenta,
            'ubicacion1': cliente.id_ubicacion1 if hasattr(cliente, 'id_ubicacion1') else None,
            'ubicacion2': cliente.id_ubicacion2 if hasattr(cliente, 'id_ubicacion2') else None,
            'ubicacion3': cliente.id_ubicacion3 if hasattr(cliente, 'id_ubicacion3') else None,
        }

        return JsonResponse({'mensaje': 'Inicio de sesión exitoso', 'cliente_info': cliente_info})
    def handle_administrador(self, cuenta):
        administrador = Administrador.objects.filter(id_cuenta=cuenta.id_cuenta).first()
        administrador_info = {
            'id_administrador':administrador.id_administrador,
            'telefono':administrador.telefono,
            'apellido':administrador.apellido,
            'nombre':administrador.nombre,
            'id_cuenta':administrador.id_cuenta.id_cuenta,
            'id_sucursal':administrador.id_sucursal if hasattr(administrador, 'id_sucursal') else None
        }
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador','administrador_info':administrador_info})
    def handle_jefecocina(self, cuenta):
        # Realiza acciones específicas para el rol de Administrador
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador'})
    def handle_mesero(self, cuenta):
        mesero = Meseros.objects.filter(id_cuenta=cuenta.id_cuenta).first()

        if mesero:
            mesero_info = {
                'id_mesero': mesero.id_mesero,
                'telefono': mesero.telefono,
                'apellido': mesero.apellido,
                'nombre': mesero.nombre,
                'id_sucursal': mesero.id_sucursal.id_sucursal,
                'id_administrador': mesero.id_administrador.id_administrador,
                'fecha_registro': mesero.fecha_registro,
                'id_cuenta': mesero.id_cuenta.id_cuenta,
                'estado': mesero.sestado,
            }
            return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Mesero', 'mesero_info': mesero_info})
        else:
            return JsonResponse({'error': 'No se encontró información del mesero asociado a esta cuenta'}, status=404)
    def handle_motorizado(self, cuenta):
        # Realiza acciones específicas para el rol de Administrador
        return JsonResponse({'mensaje': 'Inicio de sesión exitoso como Administrador'})
    def handle_default(self, cuenta):
        return JsonResponse({'mensaje': 'Rol no reconocido'}, status=400)
    
@method_decorator(csrf_exempt, name='dispatch')
class CerrarSesionView(View):
    def post(self, request, *args, **kwargs):
        try:
            usuario = User.objects.get(username='nombre_de_usuario')
            token = Token.objects.get(user=usuario)

    # Elimina el token
            token.delete()
                        
            return JsonResponse({'mensaje': 'Sesión cerrada con éxito'})
        except Token.DoesNotExist:
    # Maneja el caso en el que el token no existe
            print("El token no existe para este usuario.")          

@method_decorator(csrf_exempt, name='dispatch')
class EditarCliente(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            cuenta = Cuenta.objects.filter(nombreusuario=request.user.username).first()
            # Obtener datos del cliente a actualizar
            cliente_id = Clientes.objects.filter(id_cuenta=cuenta.id_cuenta).first().id_cliente  # Asegúrate de tener la URL configurada para recibir el ID del cliente

            # Obtener cliente existente
            cliente = Clientes.objects.get(id_cliente=cliente_id)

            # Actualizar solo los campos permitidos
            cliente.crazon_social = request.POST.get('crazon_social', cliente.crazon_social)
            cliente.ctelefono = request.POST.get('ctelefono', cliente.ctelefono)
            cliente.tipocliente = request.POST.get('tipocliente', cliente.tipocliente)
            cliente.snombre = request.POST.get('snombre', cliente.snombre)
            cliente.capellido = request.POST.get('capellido', cliente.capellido)
            cliente.ruc_cedula = request.POST.get('ruc_cedula', cliente.ruc_cedula)
            cliente.ccorreo_electronico = request.POST.get('ccorreo_electronico', cliente.ccorreo_electronico)
            cliente.ubicacion = request.POST.get('ubicacion', cliente.ubicacion)

            # Guardar el cliente actualizado
            cliente.save()

            return JsonResponse({'mensaje': 'Cliente editado con éxito'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
class HomeView(APIView):
    permission_classes = (IsAuthenticated, )
    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)

@method_decorator(csrf_exempt, name='dispatch')
class DocumentExist(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            ced = data.get('ruc_cedula')

            cliente=Clientes.objects.filter(ruc_cedula=ced).first()
            if cliente is not None:
                return JsonResponse({'mensaje': '1'})
            return JsonResponse({'mensaje': '0'})
        
            
        except Exception as e:
            return JsonResponse({'error xd': str(e)}, status=400)


class ObtenerUsuariosView(View):
    def get(self, request, *args, **kwargs):
        try:
            id_usuario = kwargs.get('id_usuario')
            if id_usuario:
                # Si se proporciona un nombre de usuario, intenta obtener un solo usuario
                cuenta =Cuenta.objects.get(id_cuenta=id_usuario)
                cliente = Clientes.objects.get(id_cuenta=cuenta)

                ubicacion_data1 = {
                    'latitud': cliente.id_ubicacion1.latitud  if cliente.id_ubicacion1 else None,
                    'longitud': cliente.id_ubicacion1.longitud if cliente.id_ubicacion1 else None,
                    # Agrega otros campos de Ubicaciones que necesites
                }
                
                ubicacion_data2 = {
                    'latitud': cliente.id_ubicacion2.latitud if cliente.id_ubicacion2 else None,
                    'longitud': cliente.id_ubicacion2.longitud if cliente.id_ubicacion2 else None,   
                }

                ubicacion_data3 = {
                    'latitud': cliente.id_ubicacion3.latitud if cliente.id_ubicacion3 else None,
                    'longitud': cliente.id_ubicacion3.longitud if cliente.id_ubicacion3 else None,
                }

                usuario_data = {
                    'nombre_usuario': cuenta.nombreusuario,
                    'idcliente':cliente.id_cliente,
                    'telefono': cliente.ctelefono,
                    'razon_social': cliente.crazon_social,
                    'tipo_cliente': cliente.tipocliente,
                    'snombre': cliente.snombre,
                    'capellido': cliente.capellido,
                    'ruc_cedula': cliente.ruc_cedula,
                    'cpuntos':cliente.cpuntos,
                    'ubicacion1': ubicacion_data1 ,
                    'ubicacion2': ubicacion_data2 ,
                    'ubicacion3': ubicacion_data3 ,
                }

                return JsonResponse({'usuario': 'usuario_data'})
            else:
                # Si no se proporciona un nombre de usuario, retorna un error
                return JsonResponse({'error': 'ID de usuario no proporcionado'}, status=400)

        except Cuenta.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

        except Clientes.DoesNotExist:
            return JsonResponse({'error': 'Cliente no encontrado'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
class ObtenerCocinero(View):
    def get(self, request, *args, **kwargs):
        try:
            id_usuario = kwargs.get('id_usuario')
            if id_usuario:
                print("usuario")
                print( kwargs.get('id_usuario'))
                # Si se proporciona un nombre de usuario, intenta obtener un solo usuario
                cuenta = get_object_or_404(Cuenta, id_cuenta=id_usuario)
                cocinero = get_object_or_404(JefeCocina, id_cuenta=cuenta)

                usuario_data = {
                    'id_cuenta': id_usuario,
                    'nombre_usuario': cuenta.nombreusuario,
                    'id_jefecocina':cocinero.id_jefecocina,
                    'telefono': cocinero.telefono,
                    'snombre': cocinero.nombre,
                    'capellido': cocinero.apellido,
                    'id_sucursal': cocinero.id_sucursal.id_sucursal ,
                }

                return JsonResponse({'usuario': usuario_data})
            else:
                # Si no se proporciona un nombre de usuario, retorna un error
                return JsonResponse({'error': 'ID de usuario no proporcionado'}, status=400)

        except Cuenta.DoesNotExist:
            traceback.print_exc()
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

        except Clientes.DoesNotExist:
            traceback.print_exc()
            return JsonResponse({'error': 'Cliente no encontrado'}, status=404)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class EditarUsuariosView(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            id_usuario = kwargs.get('id_cuenta')

            cliente=Clientes.objects.get(id_cuenta=id_usuario)
            cliente.snombre= request.POST.get('snombre')
            cliente.capellido= request.POST.get('capellido')
            cliente.ctelefono= request.POST.get('ctelefono')
            cliente.ruc_cedula= request.POST.get('ruc_cedula')
            cliente.crazon_social= request.POST.get('crazon_social')
            ubicacion1=request.POST.get('latitud1')
            print("a ver que pasa")
            print(ubicacion1)
            ubicacion2=request.POST.get('latitud2')
            ubicacion3=request.POST.get('latitud3')
            if ubicacion1:
                if cliente.id_ubicacion1:
                    if request.POST.get('latitud1')!=0 and request.POST.get('longitud1')!=0: 
                        cliente.id_ubicacion1= Ubicaciones.objects.create(
                            latitud = request.POST.get('latitud1'),
                            longitud = request.POST.get('longitud1'),
                            sestado = 1
                        )
                else:
                    cliente.id_ubicacion1= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud1'),
                        longitud = request.POST.get('longitud1'),
                        sestado = 1
                    )
            if ubicacion2:
                if cliente.id_ubicacion2:
                    if request.POST.get('latitud2')!="" and request.POST.get('longitud2')!="": 
                        cliente.id_ubicacion2= Ubicaciones.objects.create(
                            latitud = request.POST.get('latitud2'),
                            longitud = request.POST.get('longitud2'),
                            sestado = 1
                        )
                else:
                    cliente.id_ubicacion2= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud2'),
                        longitud = request.POST.get('longitud2'),
                        sestado = 1
                    )
            if ubicacion3:
                if cliente.id_ubicacion3:
                    if request.POST.get('latitud3')!=0 and request.POST.get('longitud3')!=0: 
                        cliente.id_ubicacion3= Ubicaciones.objects.create(
                            latitud = request.POST.get('latitud3'),
                            longitud = request.POST.get('longitud3'),
                            sestado = 1
                        )
                else:
                    cliente.id_ubicacion3= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud3'),
                        longitud = request.POST.get('longitud3'),
                        sestado = 1
                    )
            cliente.save()
            return JsonResponse({'mesnaje':'usuario editado con exito'})
        except Clientes.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400) 

@method_decorator(csrf_exempt, name='dispatch')
class EditarUbicacionCliente(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            id_usuario = kwargs.get('id_cuenta')

            cliente=Clientes.objects.get(id_cuenta=id_usuario)
            ubicacion1=request.POST.get('latitud1')
            ubicacion2=request.POST.get('latitud2')
            ubicacion3=request.POST.get('latitud3')
            if ubicacion1:
                if request.POST.get('latitud1')!=0 and request.POST.get('longitud1')!=0: 
                    cliente.id_ubicacion1= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud1'),
                        longitud = request.POST.get('longitud1'),
                        sestado = 1
                    )
            if ubicacion2:
                if request.POST.get('latitud2')!=0 and request.POST.get('longitud2')!=0: 
                    cliente.id_ubicacion2= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud2'),
                        longitud = request.POST.get('longitud2'),
                        sestado = 1
                    )
            if ubicacion3:
                if request.POST.get('latitud3')!=0 and request.POST.get('longitud3')!=0: 
                    cliente.id_ubicacion3= Ubicaciones.objects.create(
                        latitud = request.POST.get('latitud3'),
                        longitud = request.POST.get('longitud3'),
                        sestado = 1
                    )
            cliente.save()
            return JsonResponse({'mesnaje':'usuario editado con exito'})
        except Clientes.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=400) 