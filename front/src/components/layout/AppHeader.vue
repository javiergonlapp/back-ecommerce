<template>
  <header class="header-glass">
    <div class="header-inner">
      <RouterLink to="/" class="brand">
        <div class="brand-logo">J</div>
        <span class="brand-name">JAVIER SHOP</span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink to="/products">Productos</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" class="admin-link">Admin</RouterLink>
      </nav>

      <div class="header-actions">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/orders" class="action-btn">Mis Pedidos</RouterLink>
          <button class="cart-trigger" @click="cartOpen = true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span class="cart-badge" v-if="cartStore.itemCount > 0">{{ cartStore.itemCount }}</span>
          </button>
          <button class="action-btn" @click="handleLogout">Cerrar Sesión</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="action-btn">Iniciar Sesión</RouterLink>
          <RouterLink to="/register" class="btn-primary-sm">Registrarse</RouterLink>
        </template>
      </div>
    </div>
  </header>

  <CartDrawer :open="cartOpen" @close="cartOpen = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import CartDrawer from '@/components/cart/CartDrawer.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const cartOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
