<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <h1>Categorías</h1>
      <button class="btn-primary" @click="openCreate">+ Nueva Categoría</button>
    </div>
    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>Nombre</th><th>Slug</th><th>Activo</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr v-for="c in categories" :key="c._id">
          <td>{{ c.name }}</td>
          <td>{{ c.slug }}</td>
          <td>{{ c.isActive ? '✅' : '❌' }}</td>
          <td class="actions">
            <button class="btn-sm btn-danger" @click="remove(c._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="modal" class="modal-overlay" @click.self="modal = false">
      <div class="modal">
        <h3>Nueva Categoría</h3>
        <form @submit.prevent="save">
          <div class="form-group"><label>Nombre</label><input v-model="form.name" required class="input" /></div>
          <div class="form-group"><label>Slug</label><input v-model="form.slug" required class="input" /></div>
          <div class="form-group"><label>Descripción</label><input v-model="form.description" class="input" /></div>
          <div class="modal-actions">
            <button type="submit" class="btn-primary">Guardar</button>
            <button type="button" class="btn-outline" @click="modal = false">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { categoriesApi } from '@/api/categories'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToastStore()
const categories = ref([])
const loading = ref(false)
const modal = ref(false)
const form = reactive({ name: '', slug: '', description: '' })

const load = async () => {
  loading.value = true
  try { const { data } = await categoriesApi.list(); categories.value = data.data.categories }
  finally { loading.value = false }
}

const openCreate = () => { Object.assign(form, { name: '', slug: '', description: '' }); modal.value = true }
const save = async () => {
  try { await categoriesApi.create(form); toast.success('Creada'); modal.value = false; load() }
  catch (err) { toast.error(err.response?.data?.message || 'Failed') }
}
const remove = async (id) => {
  if (!confirm('¿Eliminar categoría?')) return
  try { await categoriesApi.remove(id); toast.success('Deleted'); load() }
  catch { toast.error('Failed') }
}

onMounted(load)
</script>
