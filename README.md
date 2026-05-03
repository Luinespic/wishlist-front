# WishList App — Frontend

Interfaz de usuario de la plataforma WishList App, desarrollada con React 19, Vite y Tailwind CSS 4. Una experiencia SPA (Single Page Application) moderna, rápida y responsive.

---

## Tecnologías principales

- **React 19** — Biblioteca para construir la interfaz de usuario.
- **Vite** — Herramienta de construcción (build tool) de última generación.
- **Tailwind CSS 4** — Framework de estilos basados en utilidades.
- **React Query (TanStack)** — Gestión de estado asíncrono y caché de datos de la API.
- **Axios** — Cliente HTTP para peticiones al backend.
- **React Router 7** — Enrutamiento dinámico de la aplicación.

---

## Requisitos previos

- Node.js 18 o superior
- Tener el backend configurado y en ejecución

---

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/Luinespic/wishlist-front.git
cd wishlist-front

# Instala las dependencias
npm install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# URL de la API del backend
VITE_API_URL="http://localhost:3000/api"

# URL base del backend
VITE_BACKEND_URL="http://localhost:3000"

---

## Scripts de ejecucion

```bash
# Desarrollo con recarga automática (HMR)
npm run dev

# Construcción para producción
npm run build

# Vista previa de la build de producción localmente
npm run preview

# Linter para verificar calidad de código
npm run lint
```

---

## Estructura de carpetas

```
src/
├── api/
│   └── admin.js
│   └── axios.js
│   └── lists.js
│   └── products.js
│   └── reservations.js            
├── assets/
├── components/
│   └── Button.jsx
│   └── Card.jsx
│   └── Input.jsx
│   └── Navbar.jsx
├── context/
│   ├── AuthContext.js
│   ├── AuthProvider.jsx
├── hooks/
│   ├── useAuth.js
├── pages/
│   └── admin/
│       └── AdminPage.jsx
│   └── auth/
│       └── GoogleCallbackPage.jsx
│       └── LoginPage.jsx
│       └── RegisterPage.jsx
│   └── lists/
│       └── AddProductPage.jsx
│       └── CreateListPage.jsx
│       └── DashboardPage.jsx
│       └── EditListPage.jsx
│       └── EditProductPage.jsx
│       └── ListDetailPage.jsx
│       └── MyReservationsPage.jsx
│       └── PublicListPage.jsx
│   └── profile/
│       └── ProfilePage.jsx
│   └── LandingPage.jsx
│   └── NotFoundPage.jsx
├── utils/
├── App.jsx
├── index.css
└── main.jsx
index.html
```

---

## Convencion de commits

Este repositorio sigue la convencion Conventional Commits:

- feat: nueva funcionalidad
- fix: correccion de bug
- chore: mantenimiento y configuracion
- style: cambios de estilos o formato
- docs: documentacion
