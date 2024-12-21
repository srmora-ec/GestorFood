import jwt
from django.conf import settings
from django.http import JsonResponse
from Login.models import Cuenta  # Ajusta la importación según tu estructura

def autenticarUsuario(token):
    """
    Verifica el token y devuelve la cuenta asociada si es válido.
    Args:
        token (str): Token JWT.
    Returns:
        Cuenta: Usuario autenticado asociado al token.
    Raises:
        ValueError: Si el token no es proporcionado o es inválido.
        jwt.ExpiredSignatureError: Si el token ha expirado.
        jwt.InvalidTokenError: Si el token no es válido.
        Cuenta.DoesNotExist: Si el usuario no existe en la base de datos.
    """
    if not token:
        raise ValueError("Token no proporcionado")

    try:
        # Decodificar el token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')

        if not user_id:
            raise ValueError("Usuario no encontrado en el token")

        # Obtener el usuario desde el modelo Cuenta
        user = Cuenta.objects.get(id_cuenta=user_id)
        return user

    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token ha expirado")
    except jwt.InvalidTokenError:
        raise jwt.InvalidTokenError("Token inválido")
    except Cuenta.DoesNotExist:
        raise Cuenta.DoesNotExist("Usuario no encontrado")
