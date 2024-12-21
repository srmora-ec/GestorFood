import os
import django

# Configura Django para usarlo fuera del entorno web
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HamburguesaProyecto.settings")
django.setup()

from Administrador.models import Administrador
from Login.models import Cuenta

def crear_administrador():
    try:
        # Busca la cuenta creada como superusuario

        cuental = Cuenta.objects.get(username='admin')  # Ajusta el nombre de usuario
        cuental.rol = "A"
        cuental.save()

        # Verifica que la cuenta es una instancia de Cuenta
        if isinstance(cuental, Cuenta):
            # Crea el administrador
            Administrador.objects.create(
                id_cuenta=cuental,  # Usa la variable 'cuenta' directamente
                telefono='0987654321',
                apellido='Gómez',
                nombre='Ana',
            )
            print("Información adicional de administrador creada.")
        else:
            print("La variable 'cuenta' no es una instancia de Cuenta.")

    except Cuenta.DoesNotExist:
        print("La cuenta no existe.")

if __name__ == "__main__":
    crear_administrador()
