from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('cerrar_sesion/', CerrarSesionView.as_view(), name='cerrar_sesion'),
    path('crear/', CrearUsuarioView.as_view(), name='crear_usuario'),
    path('iniciar_sesion/', iniciar_sesion, name='iniciar_sesion'),
    path('editar_perfil/', EditarCliente.as_view(), name='editar_perfil'),
    path('prueba/', HomeView.as_view(), name='HomeView'),
    path('cuentaexist/', usuarioExist.as_view(), name='usuarioExist'),
    path('phoneExist/', telefonoExist.as_view(), name='telefonoExist'),
    path('DocumentExist/', DocumentExist.as_view(), name='DocumentExist'),
    path('rol/', obtener_rol, name='rol'),
    path('id/', DevolverUsuario.as_view(), name='usuario'),
    path('obtener_usuario/<int:id_usuario>/', ObtenerUsuariosView.as_view(), name='obtener_usuario_por_id'),
    path('obtener_cocinero/<int:id_usuario>/', ObtenerCocinero.as_view(), name='ObtenerCocinero'),
    path('editar_usuario/<int:id_cuenta>/', EditarUsuariosView.as_view(), name='editar_usuario_por_id'),
    path('editar_ubicacion/<int:id_cuenta>/', EditarUbicacionCliente.as_view(), name='EditarUbicacionCliente'),

]