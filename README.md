# Proyecto-2-Gestion-Ventas
### Link de la app: Login / demo: https://proyecto-2-gestion-ventas.vercel.app/login

## Inicio rápido

- Se clonaron los repositorios provistos por el docente.

- Se creó un nuevo repositorio público en GitHub llamado Proyecto-2-Gestion-Ventas.

### Dependencias

- Instalar dependencias tanto en backend como en frontend

- Ejecución local (pruebas)

- Abrir dos terminales:

- Backend:npm run start:dev

### Frontend

- npm run dev

# Historias de usuario
## Registro del administrador

Qué: Registro con nombre, email, contraseña + confirmación.

Aceptación: Email único y verificado vía enlace; cuenta activada puede acceder al panel.

## Actualización de perfil del administrador

Qué: Editar nombre, email y teléfono.

Aceptación: Cambios guardados y reflejados en toda la app.

## Recuperación de contraseña

Qué: "¿Olvidaste tu contraseña?" → envío de link.

Aceptación: Link a form de nueva contraseña que cumple requisitos de seguridad.

## Sesión protegida

Qué: Sesiones seguras.

Aceptación: Tokens/cookies seguras; opción de 2FA configurable.

## Gestión de roles

Qué: Asignar roles a usuarios (RBAC).

Aceptación: Roles afectan permisos en la app inmediatamente.

## Revisión de actividad (auditoría)

Qué: Log de eventos sensibles (login, cambios de rol, borrados).

Aceptación: Registros con fecha/hora/ip y filtros para auditoría.

## Gestión de productos

Qué: CRUD de productos (nombre, descripción, línea, precio, estado, stock).

Aceptación: Validaciones (no precios negativos), confirmación antes de eliminar, productos eliminados no visibles a clientes.

## Gestión de marcas

Qué: CRUD de marcas (nombre, descripción, logo).

Aceptación: Preview de logo, evitar duplicados, no permitir eliminar marca con líneas asociadas.

## Gestión de líneas por marca

Qué: CRUD de líneas asociadas a cada marca.

Aceptación: Nombre único por marca, activar/desactivar (influye en nuevos productos).

## Asignar línea al crear producto

Qué: Cada producto debe tener exactamente una línea válida de la marca seleccionada.

Aceptación: Selector dinámico por marca; obligatorio.

## Vincular producto con múltiples proveedores

Qué: Relación producto ↔ proveedores con código por proveedor.

Aceptación: Código único por combinación proveedor+producto; autocomplete y creación inline de proveedor.

## Gestión de imágenes de producto

Qué: Subida múltiple (JPG/PNG/WebP), thumbnails, ordenar y seleccionar imagen principal.

Aceptación: Límites de tamaño, previews y feedback de carga.

## Crear marca/linea desde formulario de producto

Qué: Opción para crear marca/linea inline sin salir del flujo.

Aceptación: Nuevo recurso disponible inmediatamente en el selector.

## Dashboard de ventas por producto y marca

Qué: KPIs: total vendido, unidades, top5 productos/marcas y tabla resumen.

Aceptación: Filtros por rango de fecha; actualiza dinámicamente; manejar caso sin datos.

## Gráfico mensual de ventas

Qué: Gráfico (línea/barra) por mes; agrupar por producto o marca.

Aceptación: Tooltip con mes/importe; actualiza con filtros.

## Alerta de poco stock

Qué: Umbral global + por producto; estados (verde/amarillo/rojo).

Aceptación: Badges/alertas en panel y lista; actualiza automáticamente.

## Registro de venta

Qué: Selección de productos (con stock), registrar cantidades, actualizar stock.

Aceptación: Transacción atómica, fecha/hora automática, persistencia de venta y confirmación al usuario.

### Deploy Vercel (frontend)

- Vinculás el repo de frontend con Vercel (Connect GitHub).

- Vercel detecta el proyecto (Next/Vite/React) y construye automáticamente al hacer push.

- Configurar variables de entorno (API_URL, REACT_APP_..., etc.) en el panel de Vercel.

- URL resultante para producción y previews por rama.

### Render (backend)

- Vinculás el repo backend con Render (o deploy manual).

- Configurar start command (por ejemplo npm run start) y variables de entorno (DATABASE_URL, JWT_SECRET, etc.).

- Si usás una base externa (Supabase), poner la connection string completa y activar SSL si es necesario.

### Supabase (DB + Auth)

- Crear proyecto en Supabase, generar credenciales y connection strings.

 Usar Supabase para la base de datos Postgres y/o autenticación (si aplica).

- Configurar tablas (products, sales, users, audit_logs...) y reglas CORS/autorización.

- Copiar la DATABASE_URL o string de conexión a Render/Vercel según corresponda.

## Problemas reportados

- Tuvimos problemas con Render: no nos tomaba correctamente los puertos que nos daba Supabase, lo que provocó que hasta el Proyecto1 no funcionara.

