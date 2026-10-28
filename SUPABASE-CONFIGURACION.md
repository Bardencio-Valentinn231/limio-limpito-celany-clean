# Configurar pedidos centralizados de Cleany Clean

La tienda y el gestor comparten un módulo de pedidos. Sin configurar una base remota, los datos se guardan solo en el navegador actual. Para que todos los pedidos de los visitantes aparezcan en el gestor desde distintos dispositivos, hay que conectar un proyecto Supabase.

## 1. Crear la base de datos

1. Creá un proyecto en Supabase y abrí el SQL Editor.
2. Copiá y ejecutá el contenido completo de **supabase/schema.sql**.
3. En **Authentication → Users**, creá el usuario que vas a usar para administrar el gestor. Elegí una contraseña fuerte y guardala en privado.

## 2. Dar permiso de administrador

En el SQL Editor, ejecutá esta consulta reemplazando el correo de ejemplo por el correo exacto del usuario creado:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'TU-CORREO-DE-ADMINISTRACION@example.com';
```

Comprobá que la consulta afectó una fila. Cerrá la sesión del gestor y volvé a iniciar sesión para que Supabase emita una sesión con el rol actualizado.

## 3. Conectar el sitio

En **Project Settings → API** (o la sección equivalente de API Keys), copiá la **Project URL** y la clave pública **publishable** o **anon**.

Abrí el archivo **orders-config.js** y completá los valores **supabaseUrl** y **supabaseAnonKey**. Estas claves públicas se pueden usar en el navegador porque las reglas de acceso están protegidas por RLS. **No pegues nunca una service_role key ni una secret key en ese archivo.**

Publicá esos cambios junto con el repositorio. A partir de entonces:
- **index.html** guarda el pedido localmente e intenta enviarlo a Supabase.
- Los pedidos enviados correctamente quedan disponibles en **gestor-de-pedidos.html** desde otros dispositivos.
- El gestor requiere iniciar sesión con el email y la contraseña del usuario cuyo app_metadata.role sea admin.
- El botón **Actualizar** vuelve a consultar los pedidos y la lista se actualiza periódicamente mientras el gestor está abierto.

## 4. Modo local y datos anteriores

Mientras los campos de **orders-config.js** estén vacíos, la web conserva el modo local de compatibilidad y usa la clave cleanyCleanOrders del navegador actual. Cuando se configura Supabase, los pedidos locales pendientes se intentan sincronizar al cargar la tienda o actualizar el gestor.

No coloques datos de prueba ni datos reales de clientes en una web pública. Antes de producción, probá el flujo con una compra ficticia y verificá que un usuario común no pueda consultar el listado.

## Facturas

Las opciones A y B del gestor son vistas previas imprimibles. No son comprobantes fiscales autorizados, no asignan CAE y no reemplazan la facturación electrónica ni la verificación de las obligaciones fiscales del vendedor. Para emitir comprobantes oficiales se necesita una integración fiscal separada con los datos reales del emisor.


## 5. Editar productos, cantidades y apariencia

La pantalla **configuracion-tienda.html** se abre desde el botón **Configurar productos y colores** dentro del gestor. Permite cambiar el nombre visible de la tienda, agregar/quitar productos o servicios, editar sus nombres, precios, descripciones, categoría y cantidad disponible, además de los tres colores del fondo.

- Si Supabase está configurado y ya creaste la tabla `site_settings`, iniciá sesión con el usuario administrador; los cambios se guardan en la tabla central y se muestran a los visitantes.
- Si todavía no configuraste Supabase, la pantalla guarda cambios en el almacenamiento local de ese navegador y origen. No se comparten entre distintos dispositivos o dominios.
- **Importante:** si ya habías ejecutado el SQL antes de que existiera la tabla `site_settings`, volvé a ejecutar el archivo actualizado `supabase/schema.sql` completo desde SQL Editor. Las instrucciones son idempotentes para las tablas y políticas existentes.
- La cantidad configurada es un stock visible para limitar las unidades agregadas a cada carrito. Esta versión no descuenta automáticamente el stock después de cada venta; para prevenir ventas simultáneas del mismo stock se necesita una operación de inventario en servidor.
