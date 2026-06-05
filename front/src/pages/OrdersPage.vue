<template>
  <div class="orders-page">
    <h1>Mis Pedidos</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!orders.length" class="empty-state">
      <p>Aún no tienes pedidos.</p>
      <RouterLink to="/products" class="btn-primary">Empezar a Comprar</RouterLink>
    </div>
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order._id" class="order-card">
        <div class="order-header">
          <span class="order-number">{{ order.orderNumber }}</span>
          <span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span>
        </div>
        <div class="order-meta">
          <span>{{ new Date(order.createdAt).toLocaleDateString() }}</span>
          <span>{{ order.items.length }} artículos</span>
          <span class="order-total">${{ order.total.toFixed(2) }}</span>
        </div>
        <RouterLink :to="`/orders/${order._id}`" class="btn-outline btn-sm">Ver Detalle</RouterLink>
      </div>
    </div>
    <Pagination :page="pagination.page" :pages="pagination.pages" @change="loadPage" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ordersApi } from '@/api/orders'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'

const orders = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, pages: 1 })

const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await ordersApi.myOrders({ page })
    orders.value = data.data
    pagination.value = data.pagination
  } finally { loading.value = false }
}
onMounted(() => loadPage())
</script>
