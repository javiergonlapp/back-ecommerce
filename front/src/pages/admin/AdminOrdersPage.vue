<template>
  <div class="admin-page">
    <h1>Gestión de Pedidos</h1>
    <div class="filters-row">
      <select v-model="statusFilter" @change="load(1)" class="input">
        <option value="">Todos los estados</option>
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>N° Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr v-for="o in orders" :key="o._id">
          <td>{{ o.orderNumber }}</td>
          <td>{{ o.user?.name }}<br /><small>{{ o.user?.email }}</small></td>
          <td>${{ o.total?.toFixed(2) }}</td>
          <td><span :class="['status-badge', `status-${o.status}`]">{{ o.status }}</span></td>
          <td>{{ new Date(o.createdAt).toLocaleDateString() }}</td>
          <td>
            <select :value="o.status" @change="changeStatus(o._id, $event.target.value)" class="input input-sm">
              <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :page="pagination.page" :pages="pagination.pages" @change="load" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ordersApi } from '@/api/orders'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'

const toast = useToastStore()
const orders = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, pages: 1 })
const statusFilter = ref('')
const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded']

const load = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await ordersApi.adminList({ page, status: statusFilter.value })
    orders.value = data.data
    pagination.value = data.pagination
  } finally { loading.value = false }
}

const changeStatus = async (id, status) => {
  try { await ordersApi.updateStatus(id, status); toast.success('Estado actualizado'); load(pagination.value.page) }
  catch (err) { toast.error('Error al actualizar estado') }
}

onMounted(() => load())
</script>
