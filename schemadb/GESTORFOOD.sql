CREATE SCHEMA IF NOT EXISTS public;

CREATE TABLE IF NOT EXISTS public.cuenta_groups (
  id bigint NOT NULL PRIMARY KEY,
  cuenta_id integer NOT NULL,
  group_id integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_cuenta_groups_group_id_d044ad5d ON public.cuenta_groups (group_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_groups_cuenta_id_group_id_641e379b_uniq ON public.cuenta_groups (cuenta_id, group_id);
CREATE INDEX IF NOT EXISTS public_cuenta_groups_cuenta_id_67fef0ad ON public.cuenta_groups (cuenta_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_groups_pkey ON public.cuenta_groups (id);

CREATE TABLE IF NOT EXISTS public.ensambleunidadmedida (
  ideum integer NOT NULL PRIMARY KEY,
  cantidadconversion numeric(12, 6) NOT NULL,
  idumc integer NOT NULL,
  idump integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_ensambleunidadmedida_pkey ON public.ensambleunidadmedida (ideum);
CREATE INDEX IF NOT EXISTS public_ensambleunidadmedida_idump_acf5622f ON public.ensambleunidadmedida (idump);
CREATE INDEX IF NOT EXISTS public_ensambleunidadmedida_idumc_9d2ba44f ON public.ensambleunidadmedida (idumc);

CREATE TABLE IF NOT EXISTS public.detalleensambleproducto (
  id_detalleensamblep integer NOT NULL PRIMARY KEY,
  cantidadhijo numeric(9, 2) NOT NULL,
  id_componentehijo integer NOT NULL,
  id_emsamblep integer NOT NULL,
  id_umhijo integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_detalleensambleproducto_id_umhijo_b442702f ON public.detalleensambleproducto (id_umhijo);
CREATE UNIQUE INDEX IF NOT EXISTS public_detalleensambleproducto_pkey ON public.detalleensambleproducto (id_detalleensamblep);
CREATE INDEX IF NOT EXISTS public_detalleensambleproducto_id_componentehijo_cf3fb130 ON public.detalleensambleproducto (id_componentehijo);
CREATE INDEX IF NOT EXISTS public_detalleensambleproducto_id_emsamblep_b50eebb6 ON public.detalleensambleproducto (id_emsamblep);

CREATE TABLE IF NOT EXISTS public.token_blacklist_blacklistedtoken (
  id bigint NOT NULL PRIMARY KEY,
  blacklisted_at timestamp with time zone NOT NULL,
  token_id bigint NOT NULL UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS public_token_blacklist_blacklistedtoken_token_id_key ON public.token_blacklist_blacklistedtoken (token_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_token_blacklist_blacklistedtoken_pkey ON public.token_blacklist_blacklistedtoken (id);

CREATE TABLE IF NOT EXISTS public.componente (
  id_componente integer NOT NULL PRIMARY KEY,
  nombre character varying NOT NULL,
  descripcion text,
  costo numeric(10, 2) NOT NULL,
  tipo character varying NOT NULL,
  sestado character varying NOT NULL,
  id_categoria integer NOT NULL,
  id_um integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_componente_id_categoria_b48f9864 ON public.componente (id_categoria);
CREATE INDEX IF NOT EXISTS public_componente_id_um_619f4294 ON public.componente (id_um);
CREATE UNIQUE INDEX IF NOT EXISTS public_componente_pkey ON public.componente (id_componente);

CREATE TABLE IF NOT EXISTS public.ensamblecomponente (
  id_ensamblec integer NOT NULL PRIMARY KEY,
  padrecantidad numeric(9, 2) NOT NULL,
  id_componentepadre integer NOT NULL,
  id_umpadre integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_ensamblecomponente_pkey ON public.ensamblecomponente (id_ensamblec);
CREATE INDEX IF NOT EXISTS public_ensamblecomponente_id_umpadre_819dd547 ON public.ensamblecomponente (id_umpadre);
CREATE INDEX IF NOT EXISTS public_ensamblecomponente_id_componentepadre_8ac9d2c3 ON public.ensamblecomponente (id_componentepadre);

CREATE TABLE IF NOT EXISTS public.detalleensamblecomponente (
  id_detalleensamblec integer NOT NULL PRIMARY KEY,
  cantidadhijo numeric(9, 2) NOT NULL,
  id_componentehijo integer NOT NULL,
  id_ensamblec integer NOT NULL,
  id_umhijo integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_detalleensamblecomponente_pkey ON public.detalleensamblecomponente (id_detalleensamblec);
CREATE INDEX IF NOT EXISTS public_detalleensamblecomponente_id_umhijo_dfd1b6cd ON public.detalleensamblecomponente (id_umhijo);
CREATE INDEX IF NOT EXISTS public_detalleensamblecomponente_id_ensamblec_f0e6df00 ON public.detalleensamblecomponente (id_ensamblec);
CREATE INDEX IF NOT EXISTS public_detalleensamblecomponente_id_componentehijo_aec56328 ON public.detalleensamblecomponente (id_componentehijo);

CREATE TABLE IF NOT EXISTS public.producto (
  id_producto integer NOT NULL PRIMARY KEY,
  imagenp bytea,
  puntosp numeric(3) NOT NULL,
  codprincipal character varying,
  nombreproducto character varying NOT NULL,
  descripcionproducto character varying,
  preciounitario numeric(14, 2) NOT NULL,
  iva character varying NOT NULL,
  ice character varying NOT NULL,
  irbpnr character varying NOT NULL,
  sestado character varying NOT NULL,
  id_categoria integer NOT NULL,
  id_um integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_producto_id_categoria_710ea567 ON public.producto (id_categoria);
CREATE UNIQUE INDEX IF NOT EXISTS public_producto_pkey ON public.producto (id_producto);
CREATE INDEX IF NOT EXISTS public_producto_id_um_098ba315 ON public.producto (id_um);

CREATE TABLE IF NOT EXISTS public.tiposproductos (
  id_tipoproducto integer NOT NULL PRIMARY KEY,
  tpnombre character varying NOT NULL,
  descripcion character varying,
  sestado character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_tiposproductos_pkey ON public.tiposproductos (id_tipoproducto);

CREATE TABLE IF NOT EXISTS public.combo (
  id_combo integer NOT NULL PRIMARY KEY,
  imagenc bytea,
  puntoscb numeric(3),
  codprincipal character varying NOT NULL,
  nombrecb character varying,
  descripcioncombo character varying,
  preciounitario numeric(14, 2) NOT NULL,
  iva character varying NOT NULL,
  ice character varying NOT NULL,
  irbpnr character varying NOT NULL,
  id_catcombo integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_combo_id_catcombo_0fc4bf0c ON public.combo (id_catcombo);
CREATE UNIQUE INDEX IF NOT EXISTS public_combo_pkey ON public.combo (id_combo);

CREATE TABLE IF NOT EXISTS public.categorias (
  id_categoria integer NOT NULL PRIMARY KEY,
  imagencategoria bytea,
  catnombre character varying NOT NULL,
  descripcion character varying,
  sestado character varying NOT NULL,
  id_tipoproducto integer NOT NULL,
  mostracliente boolean NOT NULL
);

CREATE INDEX IF NOT EXISTS public_categorias_id_tipoproducto_4cac63bf ON public.categorias (id_tipoproducto);
CREATE UNIQUE INDEX IF NOT EXISTS public_categorias_pkey ON public.categorias (id_categoria);

CREATE TABLE IF NOT EXISTS public.token_blacklist_outstandingtoken (
  id bigint NOT NULL PRIMARY KEY,
  token text NOT NULL,
  created_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL,
  user_id integer,
  jti character varying NOT NULL UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS public_token_blacklist_outstandingtoken_pkey ON public.token_blacklist_outstandingtoken (id);
CREATE UNIQUE INDEX IF NOT EXISTS public_token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq ON public.token_blacklist_outstandingtoken (jti);
CREATE INDEX IF NOT EXISTS public_token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken (user_id);
CREATE INDEX IF NOT EXISTS public_token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken (jti);

CREATE TABLE IF NOT EXISTS public.avisosprincipales (
  id_aviso integer NOT NULL PRIMARY KEY,
  titulo character varying NOT NULL,
  descripcion character varying,
  imagen bytea,
  sestado character varying NOT NULL,
  id_empresa integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_avisosprincipales_id_empresa_31608520 ON public.avisosprincipales (id_empresa);
CREATE UNIQUE INDEX IF NOT EXISTS public_avisosprincipales_pkey ON public.avisosprincipales (id_aviso);

CREATE TABLE IF NOT EXISTS public.sucursales (
  id_sucursal integer NOT NULL PRIMARY KEY,
  srazon_social character varying NOT NULL,
  sruc character varying NOT NULL,
  sestado character varying NOT NULL,
  scapacidad character varying,
  scorreo character varying NOT NULL,
  stelefono character varying,
  sdireccion character varying NOT NULL,
  snombre character varying,
  fsapertura timestamp with time zone NOT NULL,
  firmaelectronica bytea,
  imagensucursal bytea,
  id_cuenta_id integer,
  id_empresa integer NOT NULL,
  id_geosector integer,
  id_horarios integer,
  id_ubicacion integer
);

CREATE INDEX IF NOT EXISTS public_sucursales_id_empresa_97ac895a ON public.sucursales (id_empresa);
CREATE INDEX IF NOT EXISTS public_sucursales_id_cuenta_id_6126e9af ON public.sucursales (id_cuenta_id);
CREATE INDEX IF NOT EXISTS public_sucursales_id_horarios_4a2c365d ON public.sucursales (id_horarios);
CREATE INDEX IF NOT EXISTS public_sucursales_id_ubicacion_e1f06bdb ON public.sucursales (id_ubicacion);
CREATE INDEX IF NOT EXISTS public_sucursales_id_geosector_27de16e1 ON public.sucursales (id_geosector);
CREATE UNIQUE INDEX IF NOT EXISTS public_sucursales_pkey ON public.sucursales (id_sucursal);

CREATE TABLE IF NOT EXISTS public.cuenta_user_permissions (
  id bigint NOT NULL PRIMARY KEY,
  cuenta_id integer NOT NULL,
  permission_id integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_user_permissions_cuenta_id_permission_id_c0334273_uniq ON public.cuenta_user_permissions (cuenta_id, permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_user_permissions_pkey ON public.cuenta_user_permissions (id);
CREATE INDEX IF NOT EXISTS public_cuenta_user_permissions_permission_id_1803ff97 ON public.cuenta_user_permissions (permission_id);
CREATE INDEX IF NOT EXISTS public_cuenta_user_permissions_cuenta_id_eca78035 ON public.cuenta_user_permissions (cuenta_id);

CREATE TABLE IF NOT EXISTS public.administrador (
  id_administrador integer NOT NULL PRIMARY KEY,
  telefono character varying,
  apellido character varying NOT NULL,
  nombre character varying NOT NULL,
  id_cuenta integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_administrador_pkey ON public.administrador (id_administrador);
CREATE INDEX IF NOT EXISTS public_administrador_id_cuenta_aa3a2ce4 ON public.administrador (id_cuenta);

CREATE TABLE IF NOT EXISTS public.django_migrations (
  id bigint NOT NULL PRIMARY KEY,
  app character varying NOT NULL,
  name character varying NOT NULL,
  applied timestamp with time zone NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_django_migrations_pkey ON public.django_migrations (id);

CREATE TABLE IF NOT EXISTS public.meseros (
  id_mesero integer NOT NULL PRIMARY KEY,
  telefono character varying NOT NULL,
  apellido character varying NOT NULL,
  nombre character varying NOT NULL,
  fecha_registro timestamp with time zone NOT NULL,
  sestado character varying NOT NULL,
  id_administrador integer NOT NULL,
  id_cuenta integer,
  id_sucursal integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_meseros_id_sucursal_b9fc3257 ON public.meseros (id_sucursal);
CREATE INDEX IF NOT EXISTS public_meseros_id_administrador_c6e0826d ON public.meseros (id_administrador);
CREATE UNIQUE INDEX IF NOT EXISTS public_meseros_pkey ON public.meseros (id_mesero);
CREATE INDEX IF NOT EXISTS public_meseros_id_cuenta_92f6905b ON public.meseros (id_cuenta);

CREATE TABLE IF NOT EXISTS public.ubicaciones (
  id_ubicacion integer NOT NULL PRIMARY KEY,
  latitud numeric(9, 6) NOT NULL,
  longitud numeric(9, 6) NOT NULL,
  udescripcion character varying,
  sestado character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_ubicaciones_pkey ON public.ubicaciones (id_ubicacion);

CREATE TABLE IF NOT EXISTS public.jefecocina (
  id_jefecocina integer NOT NULL PRIMARY KEY,
  nombre character varying NOT NULL,
  apellido character varying NOT NULL,
  telefono character varying,
  fecha_registro timestamp with time zone NOT NULL,
  sestado character varying NOT NULL,
  id_administrador integer NOT NULL,
  id_cuenta integer NOT NULL,
  id_sucursal integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_jefecocina_pkey ON public.jefecocina (id_jefecocina);
CREATE INDEX IF NOT EXISTS public_jefecocina_id_administrador_5afd8c1f ON public.jefecocina (id_administrador);
CREATE INDEX IF NOT EXISTS public_jefecocina_id_cuenta_4453908c ON public.jefecocina (id_cuenta);
CREATE INDEX IF NOT EXISTS public_jefecocina_id_sucursal_7964a21a ON public.jefecocina (id_sucursal);

CREATE TABLE IF NOT EXISTS public.categoriascombo (
  id_catcombo integer NOT NULL PRIMARY KEY,
  imagencategoria bytea,
  catnombre character varying NOT NULL,
  descripcion character varying,
  sestado character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_categoriascombo_pkey ON public.categoriascombo (id_catcombo);

CREATE TABLE IF NOT EXISTS public.django_content_type (
  id integer NOT NULL PRIMARY KEY,
  app_label character varying NOT NULL,
  model character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_django_content_type_app_label_model_76bd3d3b_uniq ON public.django_content_type (app_label, model);
CREATE UNIQUE INDEX IF NOT EXISTS public_django_content_type_pkey ON public.django_content_type (id);

CREATE TABLE IF NOT EXISTS public.auth_permission (
  id integer NOT NULL PRIMARY KEY,
  name character varying NOT NULL,
  content_type_id integer NOT NULL,
  codename character varying NOT NULL
);

CREATE INDEX IF NOT EXISTS public_auth_permission_content_type_id_2f476e4b ON public.auth_permission (content_type_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_auth_permission_content_type_id_codename_01ab375a_uniq ON public.auth_permission (content_type_id, codename);
CREATE UNIQUE INDEX IF NOT EXISTS public_auth_permission_pkey ON public.auth_permission (id);

CREATE TABLE IF NOT EXISTS public.detallecombo (
  id_detallecombo integer NOT NULL PRIMARY KEY,
  cantidad integer NOT NULL,
  id_combo integer NOT NULL,
  id_producto integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_detallecombo_id_combo_d313f988 ON public.detallecombo (id_combo);
CREATE UNIQUE INDEX IF NOT EXISTS public_detallecombo_pkey ON public.detallecombo (id_detallecombo);
CREATE INDEX IF NOT EXISTS public_detallecombo_id_producto_e3bea0f2 ON public.detallecombo (id_producto);

CREATE TABLE IF NOT EXISTS public.django_session (
  session_key character varying NOT NULL PRIMARY KEY,
  session_data text NOT NULL,
  expire_date timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS public_django_session_session_key_c0390e0f_like ON public.django_session (session_key);
CREATE INDEX IF NOT EXISTS public_django_session_expire_date_a5c62663 ON public.django_session (expire_date);
CREATE UNIQUE INDEX IF NOT EXISTS public_django_session_pkey ON public.django_session (session_key);

CREATE TABLE IF NOT EXISTS public.datos_bancarios (
  id_cuenta integer NOT NULL PRIMARY KEY,
  nombre_banco character varying NOT NULL,
  tipo_cuenta character varying NOT NULL,
  num_cuenta character varying NOT NULL,
  nombreapellidos character varying NOT NULL,
  identificacion character varying NOT NULL,
  correoelectronico character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_datos_bancarios_pkey ON public.datos_bancarios (id_cuenta);

CREATE TABLE IF NOT EXISTS public.horariossemanales (
  id_horarios integer NOT NULL PRIMARY KEY,
  hordescripcion character varying,
  tipohorario character varying NOT NULL,
  nombreh character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_horariossemanales_pkey ON public.horariossemanales (id_horarios);

CREATE TABLE IF NOT EXISTS public.unidadmedida (
  idum integer NOT NULL PRIMARY KEY,
  nombreum character varying NOT NULL,
  sestado character varying NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_unidadmedida_pkey ON public.unidadmedida (idum);

CREATE TABLE IF NOT EXISTS public.django_admin_log (
  id integer NOT NULL PRIMARY KEY,
  action_time timestamp with time zone NOT NULL,
  object_id text,
  object_repr character varying NOT NULL,
  action_flag smallint NOT NULL,
  change_message text NOT NULL,
  content_type_id integer,
  user_id integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_django_admin_log_pkey ON public.django_admin_log (id);
CREATE INDEX IF NOT EXISTS public_django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log (content_type_id);
CREATE INDEX IF NOT EXISTS public_django_admin_log_user_id_c564eba6 ON public.django_admin_log (user_id);

CREATE TABLE IF NOT EXISTS public.auth_group (
  id integer NOT NULL PRIMARY KEY,
  name character varying NOT NULL UNIQUE
);

CREATE UNIQUE INDEX IF NOT EXISTS public_auth_group_pkey ON public.auth_group (id);
CREATE UNIQUE INDEX IF NOT EXISTS public_auth_group_name_key ON public.auth_group (name);
CREATE INDEX IF NOT EXISTS public_auth_group_name_a6ea08ec_like ON public.auth_group (name);

CREATE TABLE IF NOT EXISTS public.detalle_geosector (
  id_detallegeosector integer NOT NULL PRIMARY KEY,
  id_geosector integer NOT NULL,
  id_ubicacion integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_detalle_geosector_pkey ON public.detalle_geosector (id_detallegeosector);
CREATE INDEX IF NOT EXISTS public_detalle_geosector_id_ubicacion_d55be47c ON public.detalle_geosector (id_ubicacion);
CREATE INDEX IF NOT EXISTS public_detalle_geosector_id_geosector_cd445156 ON public.detalle_geosector (id_geosector);

CREATE TABLE IF NOT EXISTS public.ensambleproducto (
  id_emsamblep integer NOT NULL PRIMARY KEY,
  padrecantidad numeric(9, 2) NOT NULL,
  id_producto integer NOT NULL,
  id_um integer NOT NULL
);

CREATE INDEX IF NOT EXISTS public_ensambleproducto_id_um_6b4fb555 ON public.ensambleproducto (id_um);
CREATE UNIQUE INDEX IF NOT EXISTS public_ensambleproducto_pkey ON public.ensambleproducto (id_emsamblep);
CREATE INDEX IF NOT EXISTS public_ensambleproducto_id_producto_8b0a7011 ON public.ensambleproducto (id_producto);

CREATE TABLE IF NOT EXISTS public.geosectores (
  id_geosector integer NOT NULL PRIMARY KEY,
  fechacreaciong timestamp with time zone NOT NULL,
  secnombre character varying NOT NULL,
  secdescripcion character varying,
  sectipo character varying NOT NULL,
  secestado character varying NOT NULL,
  sestado character varying NOT NULL,
  tarifa numeric(10, 2)
);

CREATE UNIQUE INDEX IF NOT EXISTS public_geosectores_pkey ON public.geosectores (id_geosector);

CREATE TABLE IF NOT EXISTS public.auth_group_permissions (
  id bigint NOT NULL PRIMARY KEY,
  group_id integer NOT NULL,
  permission_id integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_auth_group_permissions_group_id_permission_id_0cd325b0_uniq ON public.auth_group_permissions (group_id, permission_id);
CREATE INDEX IF NOT EXISTS public_auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions (permission_id);
CREATE UNIQUE INDEX IF NOT EXISTS public_auth_group_permissions_pkey ON public.auth_group_permissions (id);
CREATE INDEX IF NOT EXISTS public_auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions (group_id);

CREATE TABLE IF NOT EXISTS public.empresa (
  id_empresa integer NOT NULL PRIMARY KEY,
  enombre character varying NOT NULL,
  direccion character varying,
  etelefono character varying,
  correoelectronico character varying,
  fechafundacion date NOT NULL,
  sitioweb character varying,
  eslogan character varying,
  elogo bytea,
  edescripcion character varying,
  docmenu bytea
);

CREATE UNIQUE INDEX IF NOT EXISTS public_empresa_pkey ON public.empresa (id_empresa);

CREATE TABLE IF NOT EXISTS public.detallehorariossemanales (
  id_dethorarios integer NOT NULL PRIMARY KEY,
  dia character varying NOT NULL,
  horainicio time without time zone NOT NULL,
  horafin time without time zone NOT NULL,
  id_horarios integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS public_detallehorariossemanales_pkey ON public.detallehorariossemanales (id_dethorarios);
CREATE INDEX IF NOT EXISTS public_detallehorariossemanales_id_horarios_c4b2e597 ON public.detallehorariossemanales (id_horarios);

CREATE TABLE IF NOT EXISTS public.cuenta (
  password character varying NOT NULL,
  last_login timestamp with time zone,
  is_superuser boolean NOT NULL,
  username character varying NOT NULL UNIQUE,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL,
  is_staff boolean NOT NULL,
  is_active boolean NOT NULL,
  date_joined timestamp with time zone NOT NULL,
  id_cuenta integer NOT NULL PRIMARY KEY,
  fechacreacion timestamp with time zone NOT NULL,
  fechafin timestamp with time zone,
  observacion character varying,
  fotoperfil bytea,
  estadocuenta character varying NOT NULL,
  rol character varying NOT NULL,
  correorecuperacion character varying
);

CREATE INDEX IF NOT EXISTS public_cuenta_username_fdccb281_like ON public.cuenta (username);
CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_username_key ON public.cuenta (username);
CREATE UNIQUE INDEX IF NOT EXISTS public_cuenta_pkey ON public.cuenta (id_cuenta);

ALTER TABLE public.administrador ADD CONSTRAINT administrador_id_cuenta_aa3a2ce4_fk_cuenta_id_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.auth_group_permissions ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission (id);
ALTER TABLE public.auth_group_permissions ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group (id);
ALTER TABLE public.auth_permission ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type (id);
ALTER TABLE public.avisosprincipales ADD CONSTRAINT avisosprincipales_id_empresa_31608520_fk_empresa_id_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa (id_empresa);
ALTER TABLE public.categorias ADD CONSTRAINT categorias_id_tipoproducto_4cac63bf_fk_tiposprod FOREIGN KEY (id_tipoproducto) REFERENCES public.tiposproductos (id_tipoproducto);
ALTER TABLE public.combo ADD CONSTRAINT combo_id_catcombo_0fc4bf0c_fk_categoriascombo_id_catcombo FOREIGN KEY (id_catcombo) REFERENCES public.categoriascombo (id_catcombo);
ALTER TABLE public.componente ADD CONSTRAINT componente_id_categoria_b48f9864_fk_categorias_id_categoria FOREIGN KEY (id_categoria) REFERENCES public.categorias (id_categoria);
ALTER TABLE public.componente ADD CONSTRAINT componente_id_um_619f4294_fk_unidadmedida_idum FOREIGN KEY (id_um) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.cuenta_groups ADD CONSTRAINT cuenta_groups_cuenta_id_67fef0ad_fk_cuenta_id_cuenta FOREIGN KEY (cuenta_id) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.cuenta_groups ADD CONSTRAINT cuenta_groups_group_id_d044ad5d_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group (id);
ALTER TABLE public.cuenta_user_permissions ADD CONSTRAINT cuenta_user_permissi_permission_id_1803ff97_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission (id);
ALTER TABLE public.cuenta_user_permissions ADD CONSTRAINT cuenta_user_permissions_cuenta_id_eca78035_fk_cuenta_id_cuenta FOREIGN KEY (cuenta_id) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.detalle_geosector ADD CONSTRAINT detalle_geosector_id_geosector_cd445156_fk_geosector FOREIGN KEY (id_geosector) REFERENCES public.geosectores (id_geosector);
ALTER TABLE public.detalle_geosector ADD CONSTRAINT detalle_geosector_id_ubicacion_d55be47c_fk_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES public.ubicaciones (id_ubicacion);
ALTER TABLE public.detallecombo ADD CONSTRAINT detallecombo_id_combo_d313f988_fk_combo_id_combo FOREIGN KEY (id_combo) REFERENCES public.combo (id_combo);
ALTER TABLE public.detallecombo ADD CONSTRAINT detallecombo_id_producto_e3bea0f2_fk_producto_id_producto FOREIGN KEY (id_producto) REFERENCES public.producto (id_producto);
ALTER TABLE public.detalleensamblecomponente ADD CONSTRAINT detalleensamblecompo_id_componentehijo_aec56328_fk_component FOREIGN KEY (id_componentehijo) REFERENCES public.componente (id_componente);
ALTER TABLE public.detalleensamblecomponente ADD CONSTRAINT detalleensamblecompo_id_ensamblec_f0e6df00_fk_ensamblec FOREIGN KEY (id_ensamblec) REFERENCES public.ensamblecomponente (id_ensamblec);
ALTER TABLE public.detalleensamblecomponente ADD CONSTRAINT detalleensamblecompo_id_umhijo_dfd1b6cd_fk_unidadmed FOREIGN KEY (id_umhijo) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.detalleensambleproducto ADD CONSTRAINT detalleensambleprodu_id_componentehijo_cf3fb130_fk_component FOREIGN KEY (id_componentehijo) REFERENCES public.componente (id_componente);
ALTER TABLE public.detalleensambleproducto ADD CONSTRAINT detalleensambleprodu_id_emsamblep_b50eebb6_fk_ensamblep FOREIGN KEY (id_emsamblep) REFERENCES public.ensambleproducto (id_emsamblep);
ALTER TABLE public.detalleensambleproducto ADD CONSTRAINT detalleensambleproducto_id_umhijo_b442702f_fk_unidadmedida_idum FOREIGN KEY (id_umhijo) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.detallehorariossemanales ADD CONSTRAINT detallehorariosseman_id_horarios_c4b2e597_fk_horarioss FOREIGN KEY (id_horarios) REFERENCES public.horariossemanales (id_horarios);
ALTER TABLE public.django_admin_log ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type (id);
ALTER TABLE public.django_admin_log ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_cuenta_id_cuenta FOREIGN KEY (user_id) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.ensamblecomponente ADD CONSTRAINT ensamblecomponente_id_componentepadre_8ac9d2c3_fk_component FOREIGN KEY (id_componentepadre) REFERENCES public.componente (id_componente);
ALTER TABLE public.ensamblecomponente ADD CONSTRAINT ensamblecomponente_id_umpadre_819dd547_fk_unidadmedida_idum FOREIGN KEY (id_umpadre) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.ensambleproducto ADD CONSTRAINT ensambleproducto_id_producto_8b0a7011_fk_producto_id_producto FOREIGN KEY (id_producto) REFERENCES public.producto (id_producto);
ALTER TABLE public.ensambleproducto ADD CONSTRAINT ensambleproducto_id_um_6b4fb555_fk_unidadmedida_idum FOREIGN KEY (id_um) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.ensambleunidadmedida ADD CONSTRAINT ensambleunidadmedida_idumc_9d2ba44f_fk_unidadmedida_idum FOREIGN KEY (idumc) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.ensambleunidadmedida ADD CONSTRAINT ensambleunidadmedida_idump_acf5622f_fk_unidadmedida_idum FOREIGN KEY (idump) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.jefecocina ADD CONSTRAINT jefecocina_id_administrador_5afd8c1f_fk_administr FOREIGN KEY (id_administrador) REFERENCES public.administrador (id_administrador);
ALTER TABLE public.jefecocina ADD CONSTRAINT jefecocina_id_cuenta_4453908c_fk_cuenta_id_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.jefecocina ADD CONSTRAINT jefecocina_id_sucursal_7964a21a_fk_sucursales_id_sucursal FOREIGN KEY (id_sucursal) REFERENCES public.sucursales (id_sucursal);
ALTER TABLE public.meseros ADD CONSTRAINT meseros_id_administrador_c6e0826d_fk_administr FOREIGN KEY (id_administrador) REFERENCES public.administrador (id_administrador);
ALTER TABLE public.meseros ADD CONSTRAINT meseros_id_cuenta_92f6905b_fk_cuenta_id_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.meseros ADD CONSTRAINT meseros_id_sucursal_b9fc3257_fk_sucursales_id_sucursal FOREIGN KEY (id_sucursal) REFERENCES public.sucursales (id_sucursal);
ALTER TABLE public.producto ADD CONSTRAINT producto_id_categoria_710ea567_fk_categorias_id_categoria FOREIGN KEY (id_categoria) REFERENCES public.categorias (id_categoria);
ALTER TABLE public.producto ADD CONSTRAINT producto_id_um_098ba315_fk_unidadmedida_idum FOREIGN KEY (id_um) REFERENCES public.unidadmedida (idum);
ALTER TABLE public.sucursales ADD CONSTRAINT sucursales_id_cuenta_id_6126e9af_fk_cuenta_id_cuenta FOREIGN KEY (id_cuenta_id) REFERENCES public.cuenta (id_cuenta);
ALTER TABLE public.sucursales ADD CONSTRAINT sucursales_id_empresa_97ac895a_fk_empresa_id_empresa FOREIGN KEY (id_empresa) REFERENCES public.empresa (id_empresa);
ALTER TABLE public.sucursales ADD CONSTRAINT sucursales_id_geosector_27de16e1_fk_geosectores_id_geosector FOREIGN KEY (id_geosector) REFERENCES public.geosectores (id_geosector);
ALTER TABLE public.sucursales ADD CONSTRAINT sucursales_id_horarios_4a2c365d_fk_horarioss FOREIGN KEY (id_horarios) REFERENCES public.horariossemanales (id_horarios);
ALTER TABLE public.sucursales ADD CONSTRAINT sucursales_id_ubicacion_e1f06bdb_fk_ubicaciones_id_ubicacion FOREIGN KEY (id_ubicacion) REFERENCES public.ubicaciones (id_ubicacion);
ALTER TABLE public.token_blacklist_blacklistedtoken ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken (id);
ALTER TABLE public.token_blacklist_outstandingtoken ADD CONSTRAINT token_blacklist_outs_user_id_83bc629a_fk_cuenta_id FOREIGN KEY (user_id) REFERENCES public.cuenta (id_cuenta);