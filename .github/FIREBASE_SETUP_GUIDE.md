# Guía visual: Configurar Firebase para Templa

## Paso 1: Crear proyecto en Firebase

1. Abre [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombre: `templa`
4. Desactiva "Google Analytics"
5. Espera ~30 segundos

## Paso 2: Habilitar Google Sign-In

**En el panel izquierdo:**
```
Build
  └─ Authentication
```

1. Haz clic en **"Comenzar"**
2. Busca **"Google"** y haz clic
3. Activa el toggle azul
4. Email de asistencia = tu email (ej: tu@gmail.com)
5. Haz clic en **"Guardar"**

## Paso 3: Crear Firestore Database

**En el panel izquierdo:**
```
Build
  └─ Firestore Database
```

1. Haz clic en **"Crear base de datos"**
2. Ubicación: elige la más cercana (Sudamérica - São Paulo para Chile)
3. Reglas: **"Comenzar en modo de producción"**
4. Haz clic en **"Crear"**

## Paso 4: Copiar credenciales

**En el panel izquierdo:**
```
Configuración del proyecto (engranaje)
  └─ General
     └─ Tus apps (scroll abajo)
```

1. Haz clic en **"</>"** para registrar app web
2. Alias: `templa-web`
3. Marca "Configura Firebase Hosting"
4. Haz clic en **"Registrar app"**
5. **COPIA el bloque `firebaseConfig`** (todo el `const firebaseConfig = { ... }`)

## Paso 5: Llenar tu `.env`

Abre `/Users/lean/Desktop/Templa/.env` y reemplaza los valores:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=templa-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=templa-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=templa-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:xxxxxxxxxxxx
```

**Quita o desactiva:** `VITE_DEV_NO_AUTH=true`

## Paso 6: Publicar reglas de seguridad

**En Firebase:**
```
Build
  └─ Firestore Database
     └─ Reglas
```

1. Abre el archivo `firestore.rules` del repo (en tu editor)
2. Copia TODO su contenido
3. Pégalo en el editor de reglas de la consola
4. Haz clic en **"Publicar"**

## Paso 7: Autorizar dominios

**En Firebase:**
```
Build
  └─ Authentication
     └─ Settings
        └─ Authorized domains
```

1. Haz clic en **"Agregar dominio"**
2. Agrega: `localhost`
3. Más adelante, agrega: `tu-usuario.github.io`

## ¿Listo?

Prueba localmente:
```bash
cd /Users/lean/Desktop/Templa
npm run dev
```

Deberías poder hacer login con tu cuenta de Google sin problemas.

---

## Notas útiles

- **Si te pide permisos de OAuth:** es normal. Firebase está pidiendo confirmación de que es una app legítima. Haz clic en "Continuar" o similar.
- **Si ves error "auth/invalid-api-key":** probablemente copiaste mal una credencial. Verifica carácter por carácter.
- **Si el login falla:** revisa que `localhost` esté en "Authorized domains" de Firebase.
