<template>
  <div class="admin-page">
    <h1>Gestión de Reembolsos</h1>
    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>Pedido</th><th>Cliente</th><th>Monto</th><th>Motivo</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr v-for="r in refunds" :key="r._id">
          <td>{{ r.order?.orderNumber }}</td>
          <td>{{ r.user?.name }}</td>
          <td>${{ r.amount?.toFixed(2) }}</td>
          <td>{{ r.reason }}</td>
          <td><span :class="['status-badge', `status-${r.status}`]">{{ r.status }}</span></td>
          <td class="actions" v-if="r.status === 'pending'">
            <button class="btn-sm btn-primary" @click="approve(r._id)">Aprobar</button>
            <button class="btn-sm btn-danger" @click="reject(r._id)">Rechazar</button>
          </td>
          <td v-else>{{ r.adminNote || '—' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { refundsApi } from '@/api/refunds'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToastStore()
const refunds = ref([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try { const { data } = await refundsApi.adminList(); refunds.value = data.data.refunds }
  finally { loading.value = false }
}

const approve = async (id) => {
  const note = prompt('Nota del admin (opcional):') || ''
  try { await refundsApi.approve(id, note); toast.success('Reembolso aprobado'); load() }
  catch (err) { toast.error(err.response?.data?.message || 'Failed') }
}

const reject = async (id) => {
  const note = prompt('Motivo de rechazo:')
  if (!note) return
  try { await refundsApi.reject(id, note); toast.success('Reembolso rechazado'); load() }
  catch (err) { toast.error(err.response?.data?.message || 'Failed') }
}

onMounted(load)
</script>
