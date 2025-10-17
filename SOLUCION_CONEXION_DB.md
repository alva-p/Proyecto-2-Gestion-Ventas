# 🔌 Solución al Error de Conexión con Supabase

## ❌ Error Actual:
```
ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
Error: Connection terminated due to connection timeout
```

## 🎯 Causas Posibles:

1. **Proyecto de Supabase pausado** - Si no lo usas por un tiempo, se pausa automáticamente
2. **Credenciales incorrectas** - El host, puerto, usuario o contraseña están mal
3. **Firewall/Red** - Tu red o firewall están bloqueando la conexión
4. **Modo de pooler incorrecto** - Transaction vs Session mode

---

## ✅ SOLUCIÓN PASO A PASO:

### **Paso 1: Verifica que tu proyecto de Supabase esté activo**

1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto
3. Si ves un mensaje de "Paused" o "Inactive", haz clic en **"Restore project"** o **"Resume"**
4. Espera 1-2 minutos a que se active completamente

---

### **Paso 2: Obtén las credenciales correctas**

1. En tu proyecto de Supabase, ve a **Settings** (⚙️)
2. Luego a **Database**
3. Busca la sección **"Connection string"** o **"Connection info"**
4. Verás dos opciones:

#### **Opción A: Connection Pooling (Recomendado para desarrollo)**
```
Host: aws-0-[region].pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.[tu-referencia]
Password: [tu-password]
```

#### **Opción B: Direct Connection (Más estable pero limitado)**
```
Host: db.[tu-referencia].supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [tu-password]
```

---

### **Paso 3: Actualiza tu archivo `.env`**

**IMPORTANTE:** Usa una de estas dos configuraciones:

#### **🔹 Configuración 1: Connection Pooling (Mode: Transaction)**
```env
DB_HOST=aws-0-us-east-2.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.dddicemyfftrutoohyzo
DB_PASS=matesutn2025
DB_NAME=postgres
```

#### **🔹 Configuración 2: Direct Connection** (Prueba esta si la de arriba falla)
```env
DB_HOST=db.dddicemyfftrutoohyzo.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASS=matesutn2025
DB_NAME=postgres
```

---

### **Paso 4: Verifica el archivo `data-source.ts`**

Asegúrate de que esté leyendo las variables correctamente:

```typescript
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // IMPORTANTE para Supabase
  },
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

---

### **Paso 5: Reinicia el backend**

```powershell
# Detén el servidor si está corriendo (Ctrl + C)
cd backend
npm run start:dev
```

---

## 🧪 Prueba de Conexión Manual

Si aún no funciona, prueba la conexión manualmente con `psql`:

```powershell
# Instala PostgreSQL client si no lo tienes
# Luego ejecuta:
psql "postgresql://postgres.dddicemyfftrutoohyzo:matesutn2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
```

Si esto tampoco funciona, el problema es de red o las credenciales están mal.

---

## 🔍 Verificaciones Adicionales:

### ✅ Checklist:
- [ ] Proyecto de Supabase está activo (no pausado)
- [ ] Las credenciales están correctas (copia-pega desde Supabase)
- [ ] El puerto 6543 o 5432 no está bloqueado por firewall
- [ ] Tienes conexión a internet
- [ ] El archivo `.env` está en la carpeta `backend/`
- [ ] No hay espacios extra en las variables del `.env`

---

## 🚨 Si NADA funciona:

### **Opción 1: Usa la URI completa**

En lugar de separar las credenciales, usa la URI completa:

1. Ve a Supabase → Settings → Database
2. Copia la **"Connection string"** completa
3. En `data-source.ts` usa:

```typescript
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.dddicemyfftrutoohyzo:matesutn2025@aws-0-us-east-2.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
```

### **Opción 2: Prueba con otro cliente**

Instala DBeaver o pgAdmin y prueba conectarte con las mismas credenciales. Si no funciona ahí tampoco, el problema es de red o las credenciales están mal.

---

## 📞 Información de Contacto de Supabase

Si después de todo esto no funciona:
- Revisa el status de Supabase: https://status.supabase.com/
- Contacta soporte de Supabase en su Discord

---

¡Avísame qué configuración funcionó! 😊
