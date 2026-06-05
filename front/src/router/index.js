import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/pages/HomePage.vue') },
  { path: '/login', component: () => import('@/pages/LoginPage.vue'), meta: { guestOnly: true } },
  { path: '/register', component: () => import('@/pages/RegisterPage.vue'), meta: { guestOnly: true } },
  { path: '/products', component: () => import('@/pages/ProductsPage.vue') },
  { path: '/products/:id', component: () => import('@/pages/ProductDetailPage.vue') },
  { path: '/cart', component: () => import('@/pages/CartPage.vue'), meta: { requiresAuth: true } },
  { path: '/checkout', component: () => import('@/pages/CheckoutPage.vue'), meta: { requiresAuth: true } },
  { path: '/checkout/success', component: () => import('@/pages/CheckoutSuccessPage.vue') },
  { path: '/checkout/cancel', component: () => import('@/pages/CheckoutCancelPage.vue') },
  { path: '/orders', component: () => import('@/pages/OrdersPage.vue'), meta: { requiresAuth: true } },
  { path: '/orders/:id', component: () => import('@/pages/OrderDetailPage.vue'), meta: { requiresAuth: true } },
  { path: '/refunds', component: () => import('@/pages/RefundsPage.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('@/pages/ProfilePage.vue'), meta: { requiresAuth: true } },
  { path: '/auth/oauth-callback', component: () => import('@/pages/OAuthCallbackPage.vue') },
  // Admin
  { path: '/admin', component: () => import('@/pages/admin/DashboardPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/products', component: () => import('@/pages/admin/AdminProductsPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categories', component: () => import('@/pages/admin/AdminCategoriesPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/coupons', component: () => import('@/pages/admin/AdminCouponsPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/orders', component: () => import('@/pages/admin/AdminOrdersPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/refunds', component: () => import('@/pages/admin/AdminRefundsPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', component: () => import('@/pages/admin/AdminUsersPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (auth.accessToken && !auth.user) await auth.fetchMe()

  if (to.meta.requiresAuth && !auth.isAuthenticated) return next('/login')
  if (to.meta.requiresAdmin && !auth.isAdmin) return next('/')
  if (to.meta.guestOnly && auth.isAuthenticated) return next('/')
  next()
})

export default router
