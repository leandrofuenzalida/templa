# Templa

Convierte cualquier texto en una plantilla editable: pega un mensaje, selecciona las
partes que cambian y márcalas como variables (como el editor de texto de Atajos de
iOS). Después abre la plantilla, completa los datos y copia o envía el mensaje ya
armado por WhatsApp.

MVP: login con Google, plan gratis limitado a 3 plantillas guardadas.

## Stack

- React + Vite (JavaScript)
- React Router (`HashRouter`)
- Tailwind CSS 4
- Firebase (Auth con Google + Firestore)
- Deploy: Vercel (automático desde GitHub)

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar con la config de tu proyecto de Firebase
npm run dev
```

### Probar sin login ni proyecto de Firebase

Para ver la app andando sin crear un proyecto de Firebase todavía, agrega esto a tu `.env`:

```
VITE_DEV_NO_AUTH=true
```

Con esto `npm run dev` entra directo (sin pasar por el login de Google) y las
plantillas se guardan en `localStorage` del navegador en vez de Firestore. Solo
funciona en modo desarrollo — `npm run build` lo ignora siempre, así que nunca
llega a producción.

## Configuración pendiente (una sola vez)

> **Guía visual paso a paso:** ver [`.github/FIREBASE_SETUP_GUIDE.md`](.github/FIREBASE_SETUP_GUIDE.md) mientras configuras.

### Checklist rápido

- [ ] Proyecto creado en Firebase console
- [ ] Google Sign-In habilitado
- [ ] Firestore Database creada (modo producción)
- [ ] Credenciales copiadas al `.env` local
- [ ] `VITE_DEV_NO_AUTH` desactivado en `.env`
- [ ] Reglas de seguridad publicadas
- [ ] `localhost` autorizado en Firebase Auth
- [ ] Índice compuesto de `templates` creado (aparece solo al guardar la primera plantilla)
- [ ] `npm run dev` funciona y puedo hacer login con Google

### 1. Firebase (paso a paso)

#### 1a. Crear proyecto

1. Abre [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"** (o "Add project" si está en inglés)
3. Dale un nombre, ej: "templa"
4. **Desactiva** "Habilitar Google Analytics para este proyecto" (no lo necesitas)
5. Haz clic en **"Crear proyecto"** y espera ~30 segundos a que se cree

#### 1b. Habilitar Google Sign-In

1. En el panel izquierdo, ve a **"Build" → "Authentication"**
2. Haz clic en el botón **"Comenzar"** o **"Get started"**
3. En "Sign-in method", busca **"Google"** y haz clic en él
4. En la ventana que se abre:
   - Activa el toggle **"Habilitado"** (azul)
   - En "Nombre del proyecto que se mostrará para los usuarios", deja "Templa" o lo que pusiste
   - En "Email de asistencia del proyecto", ingresa tu email (ej: tu@gmail.com)
   - Haz clic en **"Guardar"** (abajo a la derecha)

#### 1c. Crear base de datos Firestore

1. En el panel izquierdo, ve a **"Build" → "Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. En "Ubicación", elige la más cercana a ti (ej: "Sudamérica (São Paulo)" si estás en Chile)
4. En "Reglas de seguridad", selecciona **"Comenzar en modo de producción"** (no el de prueba)
5. Haz clic en **"Crear"** y espera unos segundos

#### 1d. Registrar tu app web y copiar credenciales

1. Ve a **"Configuración del proyecto"** (ícono de engranaje arriba a la izquierda)
2. En la pestaña **"General"**, desplázate hasta "Tus apps"
3. Haz clic en el ícono **"</>**" (web app)
4. Dale un alias, ej: "templa-web"
5. **Marca la casilla** "También configura Firebase Hosting para este proyecto" (opcional pero útil)
6. Haz clic en **"Registrar app"**
7. Se abrirá un bloque de código. **No lo cierres todavía**, cópialo entero. Dentro verás algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "templa-xxxxx.firebaseapp.com",
  projectId: "templa-xxxxx",
  storageBucket: "templa-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxx"
};
```

8. Abre tu archivo `.env` (en `/Users/lean/Desktop/Templa/.env`) y reemplaza los valores:
   - `VITE_FIREBASE_API_KEY` = el `apiKey` de arriba
   - `VITE_FIREBASE_AUTH_DOMAIN` = el `authDomain`
   - `VITE_FIREBASE_PROJECT_ID` = el `projectId`
   - `VITE_FIREBASE_STORAGE_BUCKET` = el `storageBucket`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = el `messagingSenderId`
   - `VITE_FIREBASE_APP_ID` = el `appId`
   - **Quita** la línea `VITE_DEV_NO_AUTH=true` (o ponla en `false`)

9. Vuelve a la consola y haz clic en **"Continuar a la consola"**

#### 1e. Publicar reglas de seguridad de Firestore

1. Ve a **"Build" → "Firestore Database"**
2. Haz clic en la pestaña **"Reglas"**
3. Ve al archivo [`firestore.rules`](firestore.rules) en el repo, copia **todo su contenido**
4. Pégalo entero en el editor de reglas de la consola (reemplazando lo que ya está)
5. Haz clic en **"Publicar"** (arriba a la derecha)

#### 1f. Autorizar localhost + tu dominio de GitHub Pages

1. En la consola, ve a **"Build" → "Authentication"**
2. Haz clic en la pestaña **"Settings"** (engranaje)
3. Desplázate hasta **"Authorized domains"**
4. Haz clic en **"Agregar dominio"** y añade:
   - `localhost` (para desarrollo local)
5. Para despliegue después: agrega también `tu-usuario.github.io` (reemplaza `tu-usuario` por tu usuario de GitHub real, ej: `lean.github.io`)

#### 1g. Crear el índice compuesto de `templates`

La lista de plantillas consulta por dueño y las ordena por fecha, y Firestore exige
un índice para eso. No hace falta crearlo a mano de entrada: la primera vez que
guardes una plantilla vas a ver este error en la consola del navegador (F12):

```
FirebaseError: [code=failed-precondition]: The query requires an index.
You can create it here: https://console.firebase.google.com/...
```

1. Copia ese link completo y ábrelo en el navegador
2. Te lleva directo a la consola con el índice pre-configurado
3. Haz clic en **"Crear índice"**
4. Espera 1-2 minutos a que termine de construirse (verás el estado "Habilitando" → "Habilitado")
5. Vuelve a intentar guardar la plantilla

**¡Listo con Firebase!** Guarda el archivo `.env` y ya podés hacer `npm run dev` con login de verdad.

### 2. Vercel (cuando estés listo para desplegar)

#### 2a. Crear el repo en GitHub

1. Abre [https://github.com/new](https://github.com/new)
2. En "Repository name", escribe: `templa`
3. Descripción (opcional): "Template generator with WhatsApp integration"
4. Elige **"Public"**
5. Haz clic en **"Create repository"**

#### 2b. Hacer push del código local a GitHub

En tu terminal, desde `/Users/lean/Desktop/Templa/`:

```bash
git remote add origin https://github.com/tu-usuario/templa.git
git branch -M main
git push -u origin main
```

(Reemplaza `tu-usuario` con tu usuario real de GitHub)

#### 2c. Conectar Vercel a GitHub

1. Abre [https://vercel.com](https://vercel.com) y haz login con GitHub
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa el repositorio `templa`
4. Vercel auto-detecta que es un proyecto Vite ✅

#### 2d. Agregar variables de entorno en Vercel

En el dashboard de Vercel, en la sección **"Environment Variables"**, agrega:

- `VITE_FIREBASE_API_KEY`: tu `apiKey`
- `VITE_FIREBASE_AUTH_DOMAIN`: tu `authDomain`
- `VITE_FIREBASE_PROJECT_ID`: tu `projectId`
- `VITE_FIREBASE_STORAGE_BUCKET`: tu `storageBucket`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: tu `messagingSenderId`
- `VITE_FIREBASE_APP_ID`: tu `appId`

(Vercel ya leyó los valores del `vercel.json`, así que solo necesitas copiar los valores)

#### 2e. Deploy automático

¡Listo! Cualquier push a `main` despliega automáticamente.

Tu app estará en: `https://templa-[random].vercel.app` (o tu dominio custom si lo configuras)

(Puede tomar ~2 minutos la primera vez. Verifica en "Actions" que el workflow pasó.)

## Modelo de datos (Firestore)

- `users/{uid}`: `{ email, displayName, templateCount }`
- `templates/{id}`: `{ ownerId, title, body, variables: [{ key, label, type, placeholder, defaultValue, required, options }], createdAt, updatedAt }`
  - `type` es uno de: `short_text`, `long_text`, `number`, `date`, `list`, `boolean`. `options` solo aplica a `list`.

El límite de 3 plantillas del plan gratis se aplica en una transacción al crear
(lee y actualiza `templateCount` de forma atómica) y además queda reforzado por
`firestore.rules`, para que no dependa solo del código del cliente.
