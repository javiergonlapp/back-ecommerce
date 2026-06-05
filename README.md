# 🛒 JAVIER SHOP

> Plataforma de e-commerce enterprise fullstack construida con Node.js, Vue 3 y MongoDB Atlas.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat-square&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## ✨ Características

- 🔐 **Autenticación JWT** con refresh tokens + Google OAuth
- 🛍️ **Catálogo de 100 productos** importados desde DummyJSON y servidos desde MongoDB
- 🛒 **Carrito persistente** en base de datos (no localStorage)
- 💳 **Pagos reales con Stripe** — Checkout Sessions + Webhooks
- 🎟️ **Sistema de cupones** — usa `JAVIER15` para 15% de descuento
- 💬 **Chat en tiempo real** con Socket.io entre clientes y administrador
- 🔔 **Notificaciones en tiempo real** — nuevos pedidos, mensajes, cambios de estado
- 👥 **Panel de administración** completo con dashboard y métricas
- 📋 **Gestión de pedidos y reembolsos** con flujo de aprobación
- 🔍 **Auditoría completa** de acciones con IP y trazabilidad
- 🌐 **Sessions con MongoDB** + cookies httpOnly
- ✅ **Validaciones** con express-validator en todos los endpoints
- 🐳 **Docker ready** con Nginx como proxy inverso

---

## 🚀 Demo

| Servicio | URL |
|---|---|
| Frontend | https://front-ecommerce-qzyx.onrender.com |
| Backend API | https://back-ecommerce-3trb.onrender.com/api |
| Health Check | https://back-ecommerce-3trb.onrender.com/health |

**Credenciales de prueba:**

```
Admin:   admin@admin.com  /  Password123*
Cupón:   JAVIER15  →  15% de descuento
Stripe:  4242 4242 4242 4242  (cualquier fecha futura, cualquier CVC)
```

---

## 🏗️ Stack Tecnológico

### Backend
| Tecnología | Uso |
|---|---|
| Node.js 20 + Express 5 | Servidor HTTP y API REST |
| MongoDB Atlas + Mongoose 8 | Base de datos en la nube |
| Socket.io 4 | WebSockets — chat y notificaciones |
| JWT + bcryptjs | Autenticación y hash de contraseñas |
| Passport.js | Estrategias JWT + Google OAuth2 |
| express-session + connect-mongo | Sesiones persistidas en MongoDB |
| Stripe | Procesamiento de pagos |
| Winston | Logging estructurado |
| Helmet + CORS + Rate Limit | Seguridad HTTP |
| express-validator | Validación de entradas |

### Frontend
| Tecnología | Uso |
|---|---|
| Vue 3 + Vite | Framework UI + bundler |
| Pinia | Estado global reactivo |
| Vue Router 4 | SPA routing con guards |
| Axios | Cliente HTTP con interceptor de refresh |
| Socket.io-client | Conexión WebSocket al backend |

### DevOps
| Tecnología | Uso |
|---|---|
| Docker + docker-compose | Contenedores de desarrollo y producción |
| Nginx | Proxy inverso + servir SPA |
| GitHub Actions | CI/CD automático |
| Render | Deploy en la nube |

---

## 📁 Estructura del Proyecto

```
javier-shop/
├── back/                          # Backend Node.js
│   ├── src/
│   │   ├── app/                   # Configuración Express
│   │   ├── config/                # Passport strategies
│   │   ├── constants/             # Roles, estados, acciones
│   │   ├── database/              # Conexión MongoDB
│   │   ├── middleware/            # auth, requireRole
│   │   ├── modules/               # 13 módulos de negocio
│   │   │   ├── auth/              # JWT + Google OAuth
│   │   │   ├── users/             # Perfil + admin
│   │   │   ├── products/          # CRUD + búsqueda + filtros
│   │   │   ├── categories/        # CRUD
│   │   │   ├── coupons/           # CRUD + validación
│   │   │   ├── cart/              # Carrito persistente
│   │   │   ├── checkout/          # Stripe session
│   │   │   ├── payments/          # Webhook Stripe
│   │   │   ├── orders/            # Pedidos + estados
│   │   │   ├── refunds/           # Reembolsos
│   │   │   ├── analytics/         # Dashboard métricas
│   │   │   ├── audit/             # Logs de auditoría
│   │   │   └── chat/              # Mensajes REST
│   │   ├── routes/                # Router principal
│   │   ├── scripts/               # Seeds
│   │   ├── shared/                # Utils, errores, logger
│   │   ├── socket.js              # Socket.io — chat y notificaciones
│   │   └── server.js              # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── front/                         # Frontend Vue 3
│   ├── src/
│   │   ├── api/                   # Clientes HTTP por módulo
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── auth/              # LoginForm, RegisterForm
│   │   │   ├── cart/              # CartDrawer, CartItem
│   │   │   ├── chat/              # ChatWidget (Socket.io)
│   │   │   ├── layout/            # AppHeader, AppFooter
│   │   │   ├── products/          # ProductCard, ProductFilters
│   │   │   └── ui/                # Spinner, Skeleton, Toast, Pagination
│   │   ├── pages/                 # 15 páginas usuario + 7 admin
│   │   ├── router/                # Vue Router + guards
│   │   ├── stores/                # Pinia: auth, cart, products, toast, chat
│   │   └── styles/                # CSS global
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## ⚡ Inicio Rápido

### Requisitos
- Node.js 20+
- npm 9+
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com) (tier gratuito)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/javier-shop.git
cd javier-shop
```

### 2. Configurar variables de entorno

```bash
cp back/.env.example back/.env
```

Editar `back/.env` con tus valores:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/javierShop
JWT_SECRET=tu_secreto_jwt_largo
JWT_REFRESH_SECRET=tu_secreto_refresh_largo
SESSION_SECRET=tu_secreto_session
STRIPE_SECRET_KEY=sk_test_...        
```

```bash
# Frontend
echo "VITE_API_URL=http://localhost:3000" > front/.env
```

### 3. Instalar dependencias y poblar la base de datos

```bash
cd back && npm install
npm run seed   # Crea 100 productos, categorías, cupones y el admin
cd ../front && npm install
```

### 4. Correr en desarrollo

```bash
# Terminal 1 — Backend
cd back && npm run dev

# Terminal 2 — Frontend
cd front && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API: http://localhost:3000/api

### 5. Correr con Docker

```bash
docker-compose up --build

# Seed inicial (solo la primera vez)
docker exec javier-shop-backend node src/scripts/seed.js
```

---

## 🔌 API REST — Endpoints Principales

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | — | Registrar usuario |
| POST | `/api/auth/login` | — | Login → tokens JWT |
| POST | `/api/auth/refresh` | — | Renovar access token |
| GET | `/api/auth/google` | — | Login con Google |
| GET | `/api/products` | — | Listar productos (filtros, búsqueda, paginación) |
| GET | `/api/products/:id` | — | Detalle de producto |
| GET | `/api/cart` | USER | Ver carrito |
| POST | `/api/cart/items` | USER | Agregar al carrito |
| POST | `/api/cart/coupon` | USER | Aplicar cupón |
| POST | `/api/checkout/session` | USER | Crear sesión de pago Stripe |
| GET | `/api/orders/my` | USER | Mis pedidos |
| POST | `/api/refunds` | USER | Solicitar reembolso |
| GET | `/api/analytics/dashboard` | ADMIN | Métricas del negocio |
| GET | `/api/orders` | ADMIN | Todos los pedidos |
| PATCH | `/api/orders/:id/status` | ADMIN | Cambiar estado |
| GET | `/api/audit` | ADMIN | Logs de auditoría |
| GET | `/api/chat/conversations` | USER | Conversaciones del chat |

Ver documentación completa de endpoints en `/docs`.

---

## 💬 WebSockets — Eventos Socket.io

```js
// Conectar con autenticación
const socket = io('http://localhost:3000', {
  auth: { token: accessToken }
})

// Enviar mensaje (CLIENT → ADMIN o ADMIN → CLIENT)
socket.emit('sendMessage', destinatarioId, 'Hola, necesito ayuda')

// Recibir mensaje
socket.on('message', (msg) => console.log(msg))

// Notificación de nuevo pedido (solo ADMIN)
socket.on('newOrder', (data) => console.log(`Nuevo pedido: $${data.total}`))
```

---

## 🔒 Seguridad Implementada

- **JWT** con expiración de 15 minutos + refresh tokens de 7 días
- **bcrypt** con cost factor 12 para contraseñas
- **Helmet** — cabeceras HTTP de seguridad
- **CORS** — solo acepta requests del dominio configurado
- **Rate Limiting** — 200 req/15min general, 20 req/15min en auth
- **express-validator** — validación y sanitización de entradas
- **httpOnly cookies** — sesiones inaccesibles desde JavaScript
- **Webhook signature** — verificación criptográfica de eventos Stripe
- **Audit logs** — trazabilidad completa con IP y timestamps

---

## 🗄️ Variables de Entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `MONGODB_URI` | ✅ | Connection string de MongoDB Atlas |
| `JWT_SECRET` | ✅ | Clave para firmar access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Clave para refresh tokens |
| `SESSION_SECRET` | ✅ | Clave para las sesiones |
| `CLIENT_URL` | ✅ | URL del frontend (para CORS) |
| `STRIPE_SECRET_KEY` | ⚠️ | Clave Stripe (opcional — mock mode si no está) |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ | Secret para verificar webhooks |
| `GOOGLE_CLIENT_ID` | ⚠️ | Para Google OAuth (opcional) |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | Para Google OAuth (opcional) |
| `ADMIN_EMAIL` | ✅ | Email del admin creado por el seed |
| `ADMIN_PASSWORD` | ✅ | Password del admin creado por el seed |

Ver `back/.env.example` para la lista completa.

---

## 🐳 Docker

```bash
# Desarrollo y producción local
docker-compose up --build

# Solo backend
docker build -t javier-shop-backend ./back

# Solo frontend
docker build -t javier-shop-frontend ./front
```

El frontend corre en Nginx (puerto 80) con:
- SPA routing (`try_files $uri /index.html`)
- Proxy de `/api/*` al backend
- Caché de 1 año para assets estáticos

---

## 🚀 Deploy en Render

### Backend — Web Service
```
Root Directory:  back
Build Command:   npm install
Start Command:   npm start
```

### Frontend — Static Site
```
Root Directory:    front
Build Command:     npm install && npm run build
Publish Directory: dist
```

Agregar redirect rule: `/* → /index.html (Rewrite)` para el SPA routing.

Ver guía completa de deploy en `docs/DEPLOY.md`.

---

## 🧪 Tests

```bash
cd back

# Todos los tests
npm test

# Solo unit tests
npm run test:unit

# Solo API tests
npm run test:api
```

---

## 📄 Licencia

2026 Javier Gonzales — IDAT Backend Development Program
