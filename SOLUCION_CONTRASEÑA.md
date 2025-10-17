# 🔐 Solución al Problema de Contraseña Incorrecta

## 📋 Problema
La contraseña que guardaste en Supabase **NO está hasheada con bcrypt**, pero el login intenta comparar con `bcrypt.compare()`. Por eso siempre falla.

---

## ✅ SOLUCIÓN RÁPIDA (3 opciones)

### **Opción 1: Usar la ruta temporal para hashear tu contraseña** (Recomendado)

1. **Inicia el backend** si no está corriendo:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Usa Postman, Thunder Client o curl** para llamar a la nueva ruta:
   ```bash
   POST http://localhost:3000/auth/hash-password
   ```

   **Body (JSON)**:
   ```json
   {
     "password": "TU_CONTRASEÑA_ACTUAL"
   }
   ```

3. **Respuesta que obtendrás**:
   ```json
   {
     "originalPassword": "TU_CONTRASEÑA_ACTUAL",
     "hashedPassword": "$2b$10$abc123....",
     "message": "Copia el hashedPassword y actualízalo en Supabase en la columna contrasena"
   }
   ```

4. **Ve a Supabase** (https://supabase.com/dashboard):
   - Abre tu proyecto
   - Ve a `Table Editor` → tabla `users`
   - Busca tu usuario por correo
   - **Edita** la columna `contrasena` y pega el `hashedPassword` completo
   - Guarda los cambios

5. **¡Listo!** Ahora podrás iniciar sesión con tu contraseña original

---

### **Opción 2: Registrarte de nuevo a través del frontend**

Si no tienes datos importantes en tu usuario actual:

1. Ve a la página de registro: `http://localhost:5173/register`
2. Regístrate con un nuevo correo o borra el usuario actual en Supabase primero
3. Al registrarte, la contraseña se hasheará automáticamente ✅

---

### **Opción 3: Actualizar directamente en Supabase con SQL**

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este query (reemplaza los valores):

```sql
UPDATE users 
SET contrasena = crypt('TU_CONTRASEÑA', gen_salt('bf'))
WHERE correo = 'tu_correo@ejemplo.com';
```

⚠️ **NOTA**: Esta opción solo funciona si Supabase tiene la extensión `pgcrypto` habilitada.

---

## 🔍 Verificar que funcionó

Después de actualizar la contraseña hasheada:

1. Ve al login: `http://localhost:5173/login`
2. Ingresa tu correo y contraseña ORIGINAL (no el hash)
3. Deberías poder iniciar sesión sin problemas ✅

---

## 🧹 Limpieza (IMPORTANTE)

**Una vez resuelto el problema**, por seguridad:

1. **Elimina la ruta temporal** del archivo `auth.controller.ts`:
   ```typescript
   // ELIMINAR estas líneas:
   @Post('hash-password')
   async hashPassword(@Body() body: { password: string }) {
     const hash = await this.authService.hashPassword(body.password);
     return { 
       originalPassword: body.password,
       hashedPassword: hash,
       message: 'Copia el hashedPassword y actualízalo en Supabase'
     };
   }
   ```

2. **Elimina el archivo** `hash-password.dto.ts` (si lo creamos)

---

## 📚 ¿Por qué pasó esto?

- Cuando creas un usuario **manualmente en Supabase**, la contraseña se guarda como **texto plano**
- Cuando creas un usuario **a través del endpoint `/auth/register`**, la contraseña se hashea automáticamente con bcrypt
- El login siempre usa `bcrypt.compare()` que necesita un hash, no texto plano

---

## 🎯 Prevención futura

**Siempre crea usuarios a través de:**
- El endpoint `/auth/register` del backend
- La pantalla de registro del frontend

**Nunca** insertes usuarios manualmente en Supabase con contraseñas en texto plano.

---

## 🆘 Si aún no funciona

Verifica en Supabase que:
1. La tabla `users` existe
2. La columna `contrasena` existe y es de tipo `VARCHAR`
3. El campo `rol_id` tiene un valor válido (debe existir un rol con ese ID en la tabla `rol`)
4. El campo `activo` está en `true`

---

¿Necesitas más ayuda? Avísame! 😊
