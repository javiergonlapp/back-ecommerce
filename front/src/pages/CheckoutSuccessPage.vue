<template>
  <div class="result-page">
    <div class="result-card success">
      <div class="result-icon">✅</div>
      <h1>¡Pago Exitoso!</h1>
      <p>Tu pedido fue realizado con éxito.</p>
      <p v-if="orderId" class="order-ref">N° de Pedido: {{ orderId }}</p>
      <div class="result-actions">
        <RouterLink to="/orders" class="btn-primary">Ver Mis Pedidos</RouterLink>
        <RouterLink to="/products" class="btn-outline">Seguir Comprando</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const orderId = computed(() => route.query.orderId)

onMounted(() => {
  cartStore.clear()
})
</script>