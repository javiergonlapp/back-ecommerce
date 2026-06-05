<template>
  <div class="admin-page">
    <h1>Panel de Administración</h1>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="stats" class="dashboard-grid">
      <div class="stat-card">
        <p class="stat-label">Ingresos Totales</p>
        <p class="stat-value">${{ stats.totalRevenue?.toFixed(2) }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Total Pedidos</p>
        <p class="stat-value">{{ stats.totalOrders }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Total Usuarios</p>
        <p class="stat-value">{{ stats.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Productos Activos</p>
        <p class="stat-value">{{ stats.totalProducts }}</p>
      </div>

      <div class="admin-section full-width">
        <h3>Pedidos por Estado</h3>
        <div class="status-bars">
          <div v-for="s in stats.ordersByStatus" :key="s._id" class="status-bar-item">
            <span :class="['status-badge', `status-${s._id}`]">{{ s._id }}</span>
            <span>{{ s.count }}</span>
          </div>
        </div>
      </div>

      <div class="admin-section full-width">
        <h3>Pedidos Recientes</h3>
        <table class="admin-table">
          <thead><tr><th>N° Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr v-for="o in stats.recentOrders" :key="o._id">
              <td>{{ o.orderNumber }}</td>
              <td>{{ o.user?.name }}</td>
              <td>${{ o.total?.toFixed(2) }}</td>
              <td><span :class="['status-badge', `status-${o.status}`]">{{ o.status }}</span></td>
              <td>{{ new Date(o.createdAt).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-section full-width">
        <h3>Productos Top</h3>
        <table class="admin-table">
          <thead><tr><th>Producto</th><th>Unidades Vendidas</th><th>Ingresos</th></tr></thead>
          <tbody>
            <tr v-for="p in stats.topProducts" :key="p._id">
              <td>{{ p.title }}</td>
              <td>{{ p.units }}</td>
              <td>${{ p.revenue?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { analyticsApi } from '@/api/analytics'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const stats = ref(null)
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try { const { data } = await analyticsApi.dashboard(); stats.value = data.data }
  finally { loading.value = false }
})
</script>
