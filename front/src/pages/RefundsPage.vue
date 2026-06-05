<template>
  <div class="refunds-page">
    <h1>Mis Reembolsos</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!refunds.length" class="empty-state"><p>No tienes solicitudes de reembolso.</p></div>
    <div v-else class="refunds-list">
      <div v-for="r in refunds" :key="r._id" class="refund-card">
        <div class="refund-header">
          <span>Pedido: {{ r.order?.orderNumber }}</span>
          <span :class="['status-badge', `status-${r.status}`]">{{ r.status }}</span>
        </div>
        <p>{{ r.reason }}</p>
        <p class="muted">Monto: ${{ r.amount?.toFixed(2) }}</p>
        <p v-if="r.adminNote" class="admin-note">Nota del admin: {{ r.adminNote }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { refundsApi } from '@/api/refunds'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const refunds = ref([])
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data } = await refundsApi.myRefunds(); refunds.value = data.data.refunds }
  finally { loading.value = false }
})
</script>
