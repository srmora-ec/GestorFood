# from django.urls import path
# from .views import BuscarSucursalPorUbicacion,ListarSucursalReporte,editarGeosector, SucursalesListView,ListarRutas,Crearsucursal,sucursalExist,actdesSucursal,Editarubicacion,cargarSucursal,EditarSucursal,crearGeosector

# urlpatterns = [
#     path('sucusarleslist/', SucursalesListView.as_view(), name='SucursalesListView'),
#     path('crear/', Crearsucursal.as_view(), name='Crearsucursal'),
#     path('sucursalExist/', sucursalExist.as_view(), name='sucursalExist'),
#     path('actsucursal/', actdesSucursal.as_view(), name='actdesSucursal'),
#     path('editarubicacion/', Editarubicacion.as_view(), name='Editarubicacion'),
#     path('cargarSucursal/<int:id_sucursal>', cargarSucursal.as_view(), name='cargarSucursal'),
#     path('EditarSucursal/<int:id_sucursal>', EditarSucursal.as_view(), name='EditarSucursal'),
#     path('crearGeosector/', crearGeosector.as_view(), name='crearGeosector'),
#     path('listar-sucursales/', ListarSucursalReporte.as_view(), name='ListarSucursales'),
#     path('secSucursal/', BuscarSucursalPorUbicacion.as_view(), name='ListarSucursales'),
#     path('lisrutas/', ListarRutas.as_view(), name='ListarRutas'),
#     path('editarGeosector/', editarGeosector.as_view(), name='editarGeosector'),
# ]