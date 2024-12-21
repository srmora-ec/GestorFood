from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-b9%)!d=twny6k85s50=m9=tsds5*2er6zl&vzrkd168a6s^@&$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

AUTH_USER_MODEL = 'Login.Cuenta'

SECRET_KEY = 'jRhcA6Z3Iz7URlR7gqTPt1aOUQ8zSZ8tb0hE9VGYPxv12XbRUljd76NVb1XI'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Administrador',
    'Login',
    'Cliente',
    'Empleados.jefecocina',
    'Empleados.Mesero',
    'Motorizado',
    'Empresa',
    'Sucursal',
    'Ubicaciones',
    'Bodega',
    'Producto',
    'Combos',
    'Mesa',
    'Inventario',
    'avisos',
    'Empleados',
    'Proveedores',
    'Recompensas',
    'corsheaders', 
    'rest_framework', 
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework_simplejwt',
    'pagos',
    'Reversiones',
    'CodigoFactura'
]

DATA_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 10

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ORIGIN_ALLOW_ALL = True


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", 
    "http://localhost:3000",
]
ROOT_URLCONF = 'HamburguesaProyecto.urls'

REST_FRAMEWORK = { 
     'DEFAULT_AUTHENTICATION_CLASSES': [ 
        'rest_framework_simplejwt.authentication.JWTAuthentication', 
      ], 
}

SIMPLE_JWT = {
    'BLACKLIST_AFTER_ROTATION': True,  # Habilitar blacklist
    'ROTATE_REFRESH_TOKENS': True,
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),  # Tiempo más largo para el token de acceso
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Tiempo para el token de actualización
    'BLACKLIST_TOKEN_LIFETIME': timedelta(days=1),  # Ajusta el tiempo de vida según lo necesites
}


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'HamburguesaProyecto.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'PedidosVera',
        'USER': 'postgres',
        'PASSWORD': '12345',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
