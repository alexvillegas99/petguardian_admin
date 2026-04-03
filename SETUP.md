# PetGuardian - Guia de Configuracion e Instalacion

Esta guia detalla paso a paso como configurar y levantar los 3 componentes del proyecto PetGuardian:

- **petguardian_app** - Aplicacion movil (Flutter)
- **petguardian_api** - Backend/API (NestJS)
- **petguardian_admin** - Panel de administracion (Angular)

---

## A. Requisitos previos

Asegurate de tener instalado lo siguiente:

| Herramienta | Version minima | Verificar con |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Flutter SDK | 3.x | `flutter --version` |
| Angular CLI | 17+ | `ng version` |
| MongoDB | 6+ (local) o Atlas (nube) | `mongod --version` |
| Android Studio / VS Code | Ultima version | - |
| Git | 2.x | `git --version` |

---

## B. Firebase Console - Crear proyecto

1. Ir a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click en **"Agregar proyecto"** (o "Add project")
3. Nombre del proyecto: `PetGuardian`
4. En el paso de Google Analytics: **desactivar** (es opcional y no se necesita para desarrollo)
5. Click en **"Crear proyecto"** y esperar a que se configure

---

## C. Firebase Authentication - Configurar

1. En la consola de Firebase, ir a **Authentication** en el menu lateral
2. Click en la pestana **"Sign-in method"**
3. Habilitar **Email/Password**:
   - Click en "Email/Password"
   - Activar el toggle de "Enable"
   - Guardar
4. (Opcional) Habilitar **Google Sign-In**:
   - Click en "Google"
   - Activar el toggle
   - Configurar el email de soporte del proyecto
   - Guardar

### Crear usuarios de prueba

5. Ir a la pestana **"Users"** en Authentication
6. Click en **"Add user"** y crear los siguientes usuarios:

| Email | Password | Rol en la app |
|---|---|---|
| `user1@pet.com` | `123456` | Dueno de mascotas (pet_owner) |
| `user2@pet.com` | `123456` | Empleado de clinica (employee) |

7. **IMPORTANTE**: Copiar el **UID** que Firebase genera para cada usuario. Lo necesitaras mas adelante al crear los usuarios en la base de datos.

Para obtener el UID:
- En la tabla de Users, cada fila muestra el "User UID"
- Ejemplo: `abc123DEF456...`
- Guarda estos valores, los usaras en la seccion K

---

## D. Firebase - Obtener credenciales Android (Flutter App)

1. En Firebase Console, ir a **Project Settings** (icono de engranaje arriba a la izquierda) > **General**
2. En la seccion "Your apps", click en **"Add app"** > seleccionar icono de **Android**
3. Configurar:
   - **Android package name**: `com.petguardian.petguardian_app`
   - **App nickname**: `PetGuardian App` (opcional)
   - **Debug signing certificate SHA-1**: (opcional, necesario solo para Google Sign-In)
4. Click en **"Register app"**
5. **Descargar `google-services.json`**
6. Colocar el archivo descargado en:
   ```
   petguardian_app/android/app/google-services.json
   ```
7. Continuar con "Next" en los pasos restantes del wizard de Firebase

> **Nota**: El archivo `build.gradle.kts` del proyecto ya tiene configuradas las dependencias de Google Services. No necesitas agregar nada manualmente a los archivos Gradle.

---

## E. Firebase - Obtener credenciales Web (Angular Admin)

1. En Firebase Console, ir a **Project Settings** > **General**
2. En la seccion "Your apps", click en **"Add app"** > seleccionar icono de **Web** (`</>`)
3. **App nickname**: `PetGuardian Admin`
4. No marcar Firebase Hosting (no se necesita por ahora)
5. Click en **"Register app"**
6. Firebase mostrara un bloque de configuracion. Copiar los valores del objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "petguardian-xxxxx.firebaseapp.com",
  projectId: "petguardian-xxxxx",
  storageBucket: "petguardian-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

7. Abrir el archivo `petguardian_admin/src/environments/environment.ts` y reemplazar los placeholders:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  firebase: {
    apiKey: 'AIzaSy...',                              // Tu apiKey real
    authDomain: 'petguardian-xxxxx.firebaseapp.com',  // Tu authDomain real
    projectId: 'petguardian-xxxxx',                   // Tu projectId real
    storageBucket: 'petguardian-xxxxx.appspot.com',   // Tu storageBucket real
    messagingSenderId: '123456789',                   // Tu messagingSenderId real
    appId: '1:123456789:web:abcdef123456',            // Tu appId real
  },
};
```

8. Hacer lo mismo para `petguardian_admin/src/environments/environment.prod.ts` (con la URL de produccion cuando corresponda)

---

## F. Firebase - Obtener Service Account (NestJS Backend)

El backend necesita un Service Account de Firebase para verificar los tokens de autenticacion.

1. En Firebase Console, ir a **Project Settings** > **Service accounts**
2. Asegurarse de que esta seleccionado **"Firebase Admin SDK"** y el lenguaje **"Node.js"**
3. Click en **"Generate new private key"**
4. Se descargara un archivo JSON (ej: `petguardian-xxxxx-firebase-adminsdk-xxxxx.json`)

### Opcion A: Como variable de entorno (recomendado para deploy)

5. Abrir el JSON descargado, copiar **todo** su contenido
6. En `petguardian_api/.env`, pegar el contenido completo como una sola linea:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"petguardian-xxxxx","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@petguardian-xxxxx.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

### Opcion B: Como archivo (mas comodo para desarrollo)

5. Renombrar el archivo descargado a `firebase-service-account.json`
6. Colocarlo en la raiz de `petguardian_api/`:
   ```
   petguardian_api/firebase-service-account.json
   ```
7. Configurar la variable de entorno para que apunte al archivo (si el backend lo soporta)

### Modo desarrollo (sin Firebase)

> **Nota importante**: Si dejas la variable `FIREBASE_SERVICE_ACCOUNT` vacia en el `.env`, el backend arrancara en **modo desarrollo** sin verificacion de Firebase Auth. Esto es util para probar los endpoints de la API directamente con Swagger sin necesidad de tokens de autenticacion. Perfecto para desarrollo local.

---

## G. MongoDB - Configurar

Tienes dos opciones: instalacion local o usar MongoDB Atlas (nube gratuita).

### Opcion 1: MongoDB Local

1. Descargar e instalar [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Iniciar el servicio:
   ```bash
   # Windows (si se instalo como servicio, ya esta corriendo)
   # Si no, ejecutar:
   mongod
   ```
3. La URI por defecto es:
   ```
   mongodb://localhost:27017/petguardian
   ```
4. (Opcional) Instalar [MongoDB Compass](https://www.mongodb.com/products/compass) para ver la base de datos graficamente

### Opcion 2: MongoDB Atlas (nube gratuita)

1. Crear cuenta en [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Crear un **nuevo cluster**:
   - Seleccionar el tier gratuito **M0 (Free)**
   - Elegir el proveedor de nube y region mas cercana
   - Click en "Create Cluster"
3. **Crear usuario de base de datos**:
   - Ir a "Database Access" en el menu lateral
   - Click en "Add New Database User"
   - Metodo: Password
   - Username: `petguardian_user`
   - Password: generar una segura (guardarla)
   - Rol: "Read and write to any database"
4. **Configurar acceso de red (IP Whitelist)**:
   - Ir a "Network Access"
   - Click en "Add IP Address"
   - Para desarrollo, usar: `0.0.0.0/0` (permite todas las IPs)
   - **IMPORTANTE**: En produccion, restringir a IPs especificas
5. **Obtener connection string**:
   - Ir a "Database" > Click en "Connect" en tu cluster
   - Seleccionar "Connect your application"
   - Driver: Node.js
   - Copiar el connection string:
   ```
   mongodb+srv://petguardian_user:<password>@cluster0.xxxxx.mongodb.net/petguardian?retryWrites=true&w=majority
   ```
   - Reemplazar `<password>` con la password real del paso 3
6. Pegar la URI en `petguardian_api/.env`:
   ```env
   MONGODB_URI=mongodb+srv://petguardian_user:tu_password@cluster0.xxxxx.mongodb.net/petguardian?retryWrites=true&w=majority
   ```

---

## H. Levantar el Backend (NestJS)

```bash
cd petguardian_api

# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Copiar el archivo de configuracion de ejemplo
cp .env.example .env

# 3. Editar .env con tus valores reales:
#    - MONGODB_URI (de la seccion G)
#    - FIREBASE_SERVICE_ACCOUNT (de la seccion F, o dejarlo vacio para modo dev)
#    - PORT (por defecto 3000)

# 4. Levantar el servidor en modo desarrollo
npm run start:dev
```

Si todo salio bien, veras en la consola:
```
[Nest] LOG [NestApplication] Nest application successfully started
```

- **API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger (documentacion interactiva)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## I. Levantar la Flutter App

```bash
cd petguardian_app

# 1. Verificar que Flutter esta bien configurado
flutter doctor

# 2. Instalar dependencias
flutter pub get

# 3. Asegurarse de tener google-services.json en android/app/
# (ver seccion D)

# 4. Ejecutar la app
flutter run
```

### Configurar la URL del API

La app usa la variable `API_BASE_URL` para conectarse al backend. Los valores por defecto son:

- **Emulador Android**: `http://10.0.2.2:3000/api` (ya configurado por defecto)
- **Dispositivo fisico**: Necesitas usar la IP local de tu computadora:

```bash
# Para dispositivo fisico Android conectado por USB/WiFi:
flutter run --dart-define=API_BASE_URL=http://192.168.X.X:3000/api
```

> Reemplaza `192.168.X.X` con la IP real de tu computadora en la red local.
> Para obtenerla: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)

- **iOS Simulator**: `http://localhost:3000/api`
- **Web**: `http://localhost:3000/api`

```bash
# Para iOS o Web:
flutter run --dart-define=API_BASE_URL=http://localhost:3000/api
```

---

## J. Levantar el Angular Admin

```bash
cd petguardian_admin

# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Asegurarse de tener las credenciales Firebase en
#    src/environments/environment.ts (ver seccion E)

# 3. Levantar el servidor de desarrollo
ng serve
```

- **Admin Panel**: [http://localhost:4200](http://localhost:4200)

> Si el puerto 4200 esta ocupado, usar: `ng serve --port 4201`

---

## K. Crear datos de prueba

Una vez que el backend esta corriendo, abrir Swagger en [http://localhost:3000/api/docs](http://localhost:3000/api/docs) para crear los datos iniciales.

### Paso 1: Crear usuario dueno de mascotas

**POST** `/api/users`

```json
{
  "firebaseUid": "PEGAR_UID_DE_USER1_AQUI",
  "email": "user1@pet.com",
  "documentId": "1234567890",
  "name": "Carlos Martinez",
  "phone": "+57 300 123 4567",
  "address": "Calle 100 #15-20, Bogota",
  "role": "pet_owner"
}
```

> **IMPORTANTE**: Reemplaza `PEGAR_UID_DE_USER1_AQUI` con el UID real de Firebase del usuario `user1@pet.com` (lo copiaste en la seccion C, paso 7). Si estas en modo desarrollo (sin Firebase), puedes usar cualquier string unico, por ejemplo: `dev-user1-uid-12345`.

**Guardar el `_id` de la respuesta** (ej: `6650a1b2c3d4e5f6a7b8c9d0`). Lo necesitaras para crear la mascota y la clinica.

### Paso 2: Crear la clinica

**POST** `/api/clinics`

```json
{
  "name": "Clinica Veterinaria PetCare",
  "address": "Carrera 7 #45-10, Bogota",
  "phone": "+57 601 234 5678",
  "email": "contacto@petcare.com",
  "ownerId": "PEGAR_ID_DEL_USUARIO_DUENO",
  "schedule": {
    "lunes": "08:00 - 18:00",
    "martes": "08:00 - 18:00",
    "miercoles": "08:00 - 18:00",
    "jueves": "08:00 - 18:00",
    "viernes": "08:00 - 18:00",
    "sabado": "09:00 - 14:00",
    "domingo": "Cerrado"
  }
}
```

> Reemplaza `PEGAR_ID_DEL_USUARIO_DUENO` con el `_id` del usuario creado en el Paso 1.

**Guardar el `_id` de la clinica** (ej: `6650b2c3d4e5f6a7b8c9d0e1`).

### Paso 3: Crear usuario empleado de clinica

**POST** `/api/users`

```json
{
  "firebaseUid": "PEGAR_UID_DE_USER2_AQUI",
  "email": "user2@pet.com",
  "documentId": "0987654321",
  "name": "Ana Rodriguez",
  "phone": "+57 310 987 6543",
  "address": "Avenida 68 #30-15, Bogota",
  "role": "employee",
  "clinicId": "PEGAR_ID_DE_LA_CLINICA"
}
```

> Reemplaza:
> - `PEGAR_UID_DE_USER2_AQUI` con el UID de Firebase de `user2@pet.com` (o `dev-user2-uid-67890` en modo dev)
> - `PEGAR_ID_DE_LA_CLINICA` con el `_id` de la clinica del Paso 2

**Guardar el `_id` de este usuario** para el siguiente paso.

### Paso 4: Crear registro de empleado

**POST** `/api/employees`

```json
{
  "userId": "PEGAR_ID_DEL_USUARIO_EMPLEADO",
  "clinicId": "PEGAR_ID_DE_LA_CLINICA",
  "internalRole": "veterinarian",
  "licenseNumber": "VET-2024-001"
}
```

> Reemplaza:
> - `PEGAR_ID_DEL_USUARIO_EMPLEADO` con el `_id` del usuario del Paso 3
> - `PEGAR_ID_DE_LA_CLINICA` con el `_id` de la clinica del Paso 2

### Paso 5: Crear mascota vinculada al dueno

**POST** `/api/pets`

```json
{
  "name": "Luna",
  "species": "dog",
  "breed": "Golden Retriever",
  "dateOfBirth": "2022-03-15",
  "weight": 28.5,
  "color": "Dorado",
  "sex": "female",
  "microchipId": "985141000123456",
  "ownerId": "PEGAR_ID_DEL_USUARIO_DUENO",
  "createdByClinicId": "PEGAR_ID_DE_LA_CLINICA",
  "allergies": ["Pollo"],
  "chronicConditions": []
}
```

> Reemplaza:
> - `PEGAR_ID_DEL_USUARIO_DUENO` con el `_id` del usuario del Paso 1
> - `PEGAR_ID_DE_LA_CLINICA` con el `_id` de la clinica del Paso 2

### (Opcional) Crear una segunda mascota

**POST** `/api/pets`

```json
{
  "name": "Milo",
  "species": "cat",
  "breed": "Siames",
  "dateOfBirth": "2023-06-20",
  "weight": 4.2,
  "color": "Crema con puntas oscuras",
  "sex": "male",
  "ownerId": "PEGAR_ID_DEL_USUARIO_DUENO",
  "allergies": [],
  "chronicConditions": []
}
```

---

## Resumen de puertos y URLs

| Servicio | URL | Puerto |
|---|---|---|
| Backend API | http://localhost:3000/api | 3000 |
| Swagger Docs | http://localhost:3000/api/docs | 3000 |
| Angular Admin | http://localhost:4200 | 4200 |
| Flutter App | Emulador / Dispositivo | - |
| MongoDB (local) | mongodb://localhost:27017 | 27017 |

---

## Solucion de problemas comunes

### El backend no conecta a MongoDB
- Verificar que MongoDB esta corriendo (`mongod --version`)
- Revisar que la URI en `.env` es correcta
- Si usas Atlas, verificar que tu IP esta en el whitelist

### La Flutter app no conecta al backend
- En emulador Android, la URL debe ser `http://10.0.2.2:3000/api` (no `localhost`)
- En dispositivo fisico, usar la IP local de tu computadora
- Verificar que el backend esta corriendo

### Error "google-services.json not found"
- Asegurarse de que el archivo esta en `petguardian_app/android/app/google-services.json`
- Ver la seccion D de esta guia

### Error de CORS en Angular Admin
- Verificar que el backend tiene CORS habilitado para `http://localhost:4200`

### Firebase Auth no funciona
- Verificar que el `FIREBASE_SERVICE_ACCOUNT` en `.env` tiene el JSON completo y correcto
- O dejarlo vacio para modo desarrollo sin autenticacion
