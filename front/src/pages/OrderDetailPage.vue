<template>
  <div class="order-detail-page">
    <RouterLink to="/orders" class="back-link">← Volver a Pedidos</RouterLink>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="order">
      <div class="order-detail-header">
        <h1>Order {{ order.orderNumber }}</h1>
        <span :class="['status-badge', `status-${order.status}`]">{{ order.status }}</span>
      </div>
      <div class="order-detail-grid">
        <div class="order-items-section">
          <h3>Artículos</h3>
          <div v-for="item in order.items" :key="item._id" class="order-item">
            <img :src="item.thumbnail || '/images/sneakers.png'" />
            <div>
              <p>{{ item.title }}</p>
              <p class="muted">x{{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
            </div>
            <p>${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>
        <div class="order-summary-section">
          <h3>Resumen</h3>
          <div class="summary-row"><span>Subtotal</span><span>${{ order.subtotal?.toFixed(2) }}</span></div>
          <div v-if="order.discount" class="summary-row discount"><span>Descuento</span><span>-${{ order.discount?.toFixed(2) }}</span></div>
          <div class="summary-row total"><span>Total</span><span>${{ order.total?.toFixed(2) }}</span></div>
          <div v-if="order.status === 'paid' || order.status === 'delivered'" class="mt-4">
            <button class="btn-outline w-full" @click="requestRefund">Solicitar Reembolso</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersApi } from '@/api/orders'
import { refundsApi } from '@/api/refunds'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const toast = useToastStore()
const order = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try { const { data } = await ordersApi.detail(route.params.id); order.value = data.data.order }
  finally { loading.value = false }
})

const requestRefund = async () => {
  const reason = prompt('Por favor describe el motivo de tu reembolso:')
  if (!reason) return
  try {
    await refundsApi.request(order.value._id, reason)
    toast.success('Reembolso solicitado con éxito')
  } catch (err) { toast.error(err.response?.data?.message || 'Failed to request refund') }
}
</script>
