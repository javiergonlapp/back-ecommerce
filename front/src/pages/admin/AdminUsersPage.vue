<template>
  <div class="admin-page">
    <h1>Usuarios</h1>
    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th><th>Registro</th></tr></thead>
      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td><span :class="['status-badge', u.role === 'SUPER_ADMIN' ? 'status-paid' : 'status-pending']">{{ u.role }}</span></td>
          <td>{{ u.isActive ? '✅' : '❌' }}</td>
          <td>{{ new Date(u.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
    <Pagination :page="pagination.page" :pages="pagination.pages" @change="load" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'

const users = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, pages: 1 })

const load = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await api.get('/users', { params: { page } })
    users.value = data.data
    pagination.value = data.pagination
  } finally { loading.value = false }
}

onMounted(() => load())
</script>
