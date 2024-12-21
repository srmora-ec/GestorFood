from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Administrador
from Empleados.jefecocina.models import JefeCocina 
from Empleados.Mesero.models import Meseros 
from Login.models import Cuenta
from django.views import View
from django.db import transaction
from Administrador.models import Administrador
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from Administrador.models import datosBancarios
from django.http import JsonResponse
from Empresa.models import Sucursales
import json
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_protect
from utils import autenticarUsuario
import jwt
import traceback

@method_decorator(csrf_exempt, name='dispatch')
class listar_empleados(View):
    @transaction.atomic
    def get(self, request, *args, **kwargs):
        try:
            # token = request.headers.get('Authorization', '').split('Bearer ')[-1]
            # print('xD')
            # if not token:
            #     print('xD2')
            #     return JsonResponse({'error': 'Token no proporcionado'}, status=400)
            # try:
            #     # Decodificar el token
            #     print('xD')
            #     user=autenticarUsuario(token)
            # except jwt.ExpiredSignatureError:
            #     print('xD')
            #     print("Error occurred:", "No tienes permiso para ver los empleados")
            #     return JsonResponse({'error': 'Token ha expirado'}, status=400)
            # except jwt.InvalidTokenError:
            #     print("Error occurred:", "No tienes permiso para ver los empleados")
            #     return JsonResponse({'error': 'Token inválido'}, status=400)
            # if(user.rol!='A'):
            #     print("Error occurred:", "No tienes permiso para ver los empleados")
            #     return JsonResponse({'error': 'No tienes permiso para ver los empleados'}, status=400)
            print('xD')
            idsucursal = kwargs.get('idsucursal') 
            administradores = Administrador.objects.all()
            print('xD')
            if idsucursal:
                jefes_cocina = JefeCocina.objects.filter(id_sucursal=idsucursal) if idsucursal else JefeCocina.objects.all()           
                meseros = Meseros.objects.filter(id_sucursal=idsucursal) if idsucursal else Meseros.objects.all()
            else:
                jefes_cocina = JefeCocina.objects.all()
                meseros = Meseros.objects.all()
            empleados = {
                'JefesCocina': [{'id': j.id_jefecocina, 'tipo': 'X', 'sucursal': j.id_sucursal.id_sucursal if j.id_sucursal else None, 'nombre': j.nombre, 'apellido': j.apellido, 'telefono': j.telefono} for j in jefes_cocina],
                'Administradores': [{'id': a.id_administrador, 'tipo': 'A', 'sucursal': None, 'nombre': a.nombre, 'apellido': a.apellido, 'telefono': a.telefono} for a in administradores],
                'Meseros': [{'id': m.id_mesero, 'tipo': 'M', 'sucursal': m.id_sucursal.id_sucursal if m.id_sucursal else None, 'nombre': m.nombre, 'apellido': m.apellido, 'telefono': m.telefono} for m in meseros],
            }

            return JsonResponse({'empleados': empleados})
        except Exception as e:
            # Imprimir el traceback completo en la terminal
            print("Error occurred:", traceback.format_exc())
            # Devolver el error en la respuesta JSON
            return JsonResponse({'error': str(e)}, status=400)
@method_decorator(csrf_exempt, name='dispatch')
class CrearUsuarioView(View):
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
            # Cargar y validar los datos enviados en la solicitud
            data = json.loads(request.body)
            required_fields = ['nombreusuario', 'contrasenia', 'tipo_empleado', 'id_sucursal', 'nombre', 'apellido', 'telefono']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({'error': f'El campo {field} es obligatorio'}, status=400)

            # Validar tipo de empleado
            tipo_empleado = data.get('tipo_empleado')
            if tipo_empleado not in ['X', 'M']:
                return JsonResponse({'error': 'Tipo de empleado no válido'}, status=400)

            # Crear la cuenta y usuario asociado
            nombre_usuario = data['nombreusuario']
            contrasenia = data['contrasenia']
            correo = data.get('correorecuperacion', '')

            if Cuenta.objects.filter(username=nombre_usuario).exists():
                return JsonResponse({'error': 'El nombre de usuario ya está en uso'}, status=400)

            nueva_cuenta = Cuenta.objects.create(
                username=nombre_usuario,
                password=make_password(contrasenia),  # Encripta la contraseña
                rol=tipo_empleado,
                observacion=data.get('observacion', ''),
                correorecuperacion=correo,
            )

            # Validar sucursal
            try:
                sucursal = Sucursales.objects.get(id_sucursal=data['id_sucursal'])
            except Sucursales.DoesNotExist:
                return JsonResponse({'error': 'La sucursal no existe'}, status=400)

            # Crear el empleado según el tipo especificado
            empleado_data = {
                'id_sucursal': sucursal,
                'id_administrador': Administrador.objects.first(),  # Asegúrate de cambiar esto según tus requerimientos
                'nombre': data['nombre'],
                'apellido': data['apellido'],
                'telefono': data['telefono'],
                'id_cuenta': nueva_cuenta,
                'sestado': 1
            }

            if tipo_empleado == 'X':  # Jefe de cocina
                JefeCocina.objects.create(**empleado_data)
            elif tipo_empleado == 'M':  # Mesero
                Meseros.objects.create(**empleado_data)

            return JsonResponse({'mensaje': 'Usuario y empleado creado con éxito'})

        except Exception as e:
            return JsonResponse({'error': f'Error al crear el usuario: {str(e)}'}, status=400)












def listar_empleados_tipo(request, idsucursal=None, tipo_empleado=None):
    try:
        empleados_data = []

        # Si se proporciona un tipo de empleado pero no una sucursal
        if tipo_empleado and not idsucursal:
            return JsonResponse({'error': 'Debe especificar una sucursal'}, status=400)
        
        # Si no se proporciona un tipo de empleado ni una sucursal
        if not tipo_empleado and not idsucursal:
            return JsonResponse({'error': 'Debe especificar al menos una sucursal o un tipo de empleado'}, status=400)
        
        nombres_tipos_empleado = {
                'motorizado': 'Motorizado',
                'mesero': 'Mesero',
                'jefecocina': 'Jefe de cocina'
            }

        # Si se proporciona tanto una sucursal como un tipo de empleado
        if idsucursal and tipo_empleado:
            if tipo_empleado == 'jefe_cocina':
                empleados = JefeCocina.objects.filter(id_sucursal=idsucursal)
                tipo = 'Jefe de cocina'
            elif tipo_empleado == 'motorizado':
                empleados = Motorizado.objects.filter(id_sucursal=idsucursal)
                tipo = 'Motorizado'
            elif tipo_empleado == 'mesero':
                empleados = Mesero.objects.filter(id_sucursal=idsucursal)
                tipo = 'Mesero'
            else:
                return JsonResponse({'error': 'Tipo de empleado no válido'}, status=400)

            empleados_data = [{
                'nombre': empleado.nombre, 
                'apellido': empleado.apellido, 
                'telefono': empleado.telefono, 
                'ciudad': empleado.id_sucursal.sdireccion,  
                'fecha': empleado.fecha_registro,
                'sucursal': empleado.id_sucursal.snombre,
                'tipo_empleado': tipo
            } for empleado in empleados]

            if not empleados_data:
                return JsonResponse({'mensaje': 'No hay empleados de tipo {} en la sucursal {}'.format(tipo_empleado, idsucursal)})

        # Si se proporciona solo una sucursal
        if idsucursal and not tipo_empleado:
            jefes_cocina = JefeCocina.objects.filter(id_sucursal=idsucursal)
            motorizados = Motorizado.objects.filter(id_sucursal=idsucursal)
            meseros = Mesero.objects.filter(id_sucursal=idsucursal)
            
            empleados = list(jefes_cocina) + list(motorizados) + list(meseros)        
            empleados_data = [{
                'nombre': empleado.nombre, 
                'apellido': empleado.apellido, 
                'telefono': empleado.telefono, 
                'ciudad': empleado.id_sucursal.sdireccion, 
                'fecha': empleado.fecha_registro,
                'sucursal': empleado.id_sucursal.snombre,
                'tipo_empleado': nombres_tipos_empleado[empleado.__class__.__name__.lower()]  
            } for empleado in empleados]

            if not empleados_data:
                return JsonResponse({'mensaje': 'No hay empleados en la sucursal {}'.format(idsucursal)})

        return JsonResponse({'empleados': empleados_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def listar_todos_los_empleados(request):
    try:
        # Obtener todos los empleados de los diferentes modelos
        meseros = Mesero.objects.prefetch_related('id_sucursal').all()
        jefes_cocina = JefeCocina.objects.prefetch_related('id_sucursal').all()
        motorizados = Motorizado.objects.prefetch_related('id_sucursal').all()

        # Crear una lista para almacenar los datos de todos los empleados
        empleados_data = []

        # Agregar los datos de los meseros
        for mesero in meseros:
            empleados_data.append({
                'sucursal': mesero.id_sucursal.snombre,
                'ciudad': mesero.id_sucursal.sdireccion,
                'nombre': mesero.nombre,
                'apellido': mesero.apellido,
                'telefono': mesero.telefono,
                'fecha': mesero.fecha_registro,
                'tipo_empleado': 'Mesero'
            })

        # Agregar los datos de los jefes de cocina
        for jefe_cocina in jefes_cocina:
            empleados_data.append({
                'sucursal': jefe_cocina.id_sucursal.snombre,
                'ciudad': jefe_cocina.id_sucursal.sdireccion,
                'nombre': jefe_cocina.nombre,
                'apellido': jefe_cocina.apellido,
                'telefono': jefe_cocina.telefono,
                'fecha': jefe_cocina.fecha_registro,
                'tipo_empleado': 'Jefes de cocina'
            })

        # Agregar los datos de los motorizados
        for motorizado in motorizados:
            empleados_data.append({
                'sucursal': motorizado.id_sucursal.snombre,
                'ciudad': motorizado.id_sucursal.sdireccion,
                'nombre': motorizado.nombre,
                'apellido': motorizado.apellido,
                'telefono': motorizado.telefono,
                'fecha': motorizado.fecha_registro,
                'tipo_empleado': 'Motorizado'
            })

        return JsonResponse({'empleados': empleados_data})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
def listar_empleados_todas_sucursales_tipo_empleado(request, tipo_empleado):
    try:
        # Filtrar empleados por tipo de empleado en todas las sucursales
        if tipo_empleado == 'motorizado':
            empleados = Motorizado.objects.all()
            tipo = 'Motorizado'
        elif tipo_empleado == 'mesero':
            empleados = Mesero.objects.all()
            tipo = 'Mesero'
        elif tipo_empleado == 'jefe_cocina':
            empleados = JefeCocina.objects.all()
            tipo = 'Jefe de cocina'
        else:
            return JsonResponse({'error': 'Tipo de empleado no válido'}, status=400)

        # Crear una lista para almacenar los datos de todos los empleados
        empleados_data = []

        # Agregar los datos de los empleados a la lista
        for empleado in empleados:
            empleados_data.append({
                'sucursal': empleado.id_sucursal.snombre,
                'ciudad': empleado.id_sucursal.sdireccion,
                'nombre': empleado.nombre,
                'apellido': empleado.apellido,
                'telefono': empleado.telefono,
                'ciudad': empleado.id_sucursal.sdireccion,
                'fecha': empleado.fecha_registro,
                'tipo_empleado': tipo
            })

        return JsonResponse({'empleados': empleados_data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    


@method_decorator(csrf_exempt, name='dispatch')
class EditarEmpleadoView(View):
    template_name = 'editar_empleado.html'

    def post(self, request, tipo_empleado, empleado_id, *args, **kwargs):
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
            # Obtener el empleado según el tipo
            if tipo_empleado == 'X':
                empleado = get_object_or_404(JefeCocina, id_jefecocina=empleado_id)
            # elif tipo_empleado == 'D':
            #     empleado = get_object_or_404(Motorizado, id_motorizado=empleado_id)
            elif tipo_empleado == 'M':
                empleado = get_object_or_404(Meseros, id_mesero=empleado_id)
            else:
                # Manejar el tipo de empleado no reconocido según tus necesidades
                return JsonResponse({'error': 'Tipo de empleado no válido'}, status=400)

            # Actualizar los datos del empleado según la entrada del formulario
            data = json.loads(request.body)
            empleado.nombre = data.get('nombre')
            empleado.apellido = data.get('apellido')
            empleado.telefono = data.get('telefono')
            empleado.id_sucursal = Sucursales.objects.get(id_sucursal=data.get('sucursales'))
            empleado.save()

            return JsonResponse({'mensaje': 'Empleado actualizado con éxito'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
def listar_empleados2(request, **kwargs):
    try:
        idsucursal = kwargs.get('idsucursal') 
        if idsucursal:
            jefes_cocina = JefeCocina.objects.filter(id_sucursal=idsucursal) if idsucursal else JefeCocina.objects.all()
            motorizados = Motorizado.objects.filter(id_sucursal=idsucursal) if idsucursal else Motorizado.objects.all()
            administradores = Administrador.objects.filter(id_sucursal=idsucursal) if idsucursal else Administrador.objects.all()
            meseros = Mesero.objects.filter(id_sucursal=idsucursal) if idsucursal else Mesero.objects.all()
        else:
            jefes_cocina = JefeCocina.objects.all()
            motorizados = Motorizado.objects.all()
            administradores = Administrador.objects.all()
            meseros = Mesero.objects.all()
        empleados = [
            {
                'id': j.id_cuenta.id_cuenta,
                'nombre': j.nombre,
                'apellido': j.apellido,
                'telefono': j.telefono,
                'tipo': 'X',
                'sucursal': j.id_sucursal.id_sucursal if j.id_sucursal else None
            } for j in jefes_cocina
        ] + [
            {
                'id': mo.id_cuenta.id_cuenta,
                'nombre': mo.nombre,
                'apellido': mo.apellido,
                'telefono': mo.telefono,
                'tipo': 'D',
                'sucursal': mo.id_sucursal.id_sucursal if mo.id_sucursal else None
            } for mo in motorizados
        ] + [
            {
                'id': a.id_cuenta.id_cuenta,
                'nombre': a.nombre,
                'apellido': a.apellido,
                'telefono': a.telefono,
                'tipo': 'A',
                'sucursal': a.id_sucursal.id_sucursal if a.id_sucursal else None
            } for a in administradores
        ] + [
            {
                'id': m.id_cuenta.id_cuenta,
                'nombre': m.nombre,
                'apellido': m.apellido,
                'telefono': m.telefono,
                'tipo': 'M',
                'sucursal': m.id_sucursal.id_sucursal if m.id_sucursal else None
            } for m in meseros
        ]

        return JsonResponse({'empleados': empleados})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@method_decorator(csrf_exempt, name='dispatch')
class AgregarDatosBancarios(View):
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            # Obtener los datos del cuerpo de la solicitud en formato JSON
            data = json.loads(request.body.decode('utf-8'))

            nombrebanco = data.get('banco')
            tipo_cuenta = data.get('tipoCuenta')
            num_cuenta = data.get('numeroCuenta')
            identificacion = data.get('cedula')
            correoelectronico = data.get('email')
            nombreapellidos = data.get('nombreApellidos')

            nueva_cuentaB = datosBancarios.objects.create(
                nombre_banco=nombrebanco,
                tipo_cuenta=tipo_cuenta,
                num_cuenta=num_cuenta,
                identificacion=identificacion,
                correoelectronico=correoelectronico,
                nombreapellidos=nombreapellidos
            )
            nueva_cuentaB.save()

            return JsonResponse({'success': True, 'message': 'Cuenta bancaria guardada.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)



class ObtenerDatosBancarios(View):
    def get(self, request, *args, **kwargs):
        try:
            # Obtén todos los registros de la tabla datosBancarios
            todos_los_registros = datosBancarios.objects.all().values()

            # Devuelve la respuesta JSON
            return JsonResponse({'Cuentas': list(todos_los_registros)})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)