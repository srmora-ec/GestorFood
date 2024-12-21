from django.urls import path
from .views import *

urlpatterns = [
    path('infoEmpresa/', EmpresaDatosView.as_view(), name='Empresa_datos'),
    path('editar/', EditarEmpresaDatosView.as_view(), name='EditarEmpresaDatosView'),
    path('crear_sucursal/', Crearsucursal.as_view(), name='Crearsucursal'),
    path('sucusarleslist/', SucursalesListView.as_view(), name='SucursalesListView'),
    path('sucusarlesExist/', sucursalExist.as_view(), name='SucursalesExist'),
    path('cargarSucursal/<int:id_sucursal>', cargarSucursal.as_view(), name='cargarSucursal'),
    path('EditarSucursal/<int:id_sucursal>', EditarSucursal.as_view(), name='EditarSucursal'),
    path('editubicacionsucursal/', Editarubicacion.as_view(), name='Editarubicacion'),
    path('CrearHorarioSucursal/', CrearHorarioSucursal.as_view(), name='CrearHorarioSucursal'),
    path('gethorariosucursal/<int:id_horario>', DetallesHorarioView.as_view(), name='DetallesHorarioView'),
    path('edithorariosucursal/<int:id_horario>', EditarHorarioSucursal.as_view(), name='EditarHorarioSucursal'),
    path('crearGeosectorSucursal/', CrearGeosector.as_view(), name='crearGeosector'),

    # path('CrearHorarioProducto/', CrearHorarioProducto.as_view(), name='CrearHorarioProducto'),

]