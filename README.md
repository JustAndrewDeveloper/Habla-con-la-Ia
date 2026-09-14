# Hasta el Amanecer — Despliegue en Vercel (100% gratis)

## Qué hay en esta carpeta
- `index.html` — el juego (frontend).
- `api/turno.js` — la función que habla con la IA de forma segura (backend),
  usando **Groq** (gratis, sin tarjeta de crédito).

## Pasos para publicarlo

### 1. Consigue una API key de Groq (gratis)
1. Entra a https://console.groq.com y crea una cuenta (no pide tarjeta).
2. Ve a "API Keys" y genera una nueva key.
3. Cópiala, la vas a necesitar en el paso 3.

### 2. Sube esta carpeta a GitHub
- Crea un repositorio nuevo en https://github.com (puede ser privado).
- Sube estos 3 archivos/carpetas: `index.html`, `api/turno.js`, `README.md`
  manteniendo la carpeta `api/` tal cual.

### 3. Despliega en Vercel (gratis)
1. Entra a https://vercel.com y crea una cuenta gratis (puedes entrar
   directo con tu cuenta de GitHub).
2. Click en "Add New" → "Project".
3. Selecciona el repositorio que subiste.
4. Antes de darle a "Deploy", abre la sección "Environment Variables" y
   agrega:
   - Nombre: `GROQ_API_KEY`
   - Valor: (pega la key que generaste en el paso 1)
5. Dale a "Deploy" y espera un minuto.
6. Vercel te da una URL pública (algo como `tu-proyecto.vercel.app`) —
   esa es la que abres en la computadora de la feria.

### 4. Pruébalo antes del día del evento
Abre la URL, juega un par de turnos, y confirma que las respuestas
llegan bien y rápido. Si algo falla, en Vercel puedes ir a la pestaña
"Logs" del proyecto para ver el error exacto que devolvió la función.

## Sobre los límites gratuitos
El plan gratis de Groq permite miles de peticiones al día — más que
suficiente para un día entero de feria con muchos estudiantes probando
el juego, uno tras otro.

## Nota de seguridad
Como la key vive en la variable de entorno de Vercel (no en el HTML),
nadie que inspeccione la página en el navegador puede verla ni copiarla.
