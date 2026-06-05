<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <h1>Gestión de Productos</h1>
      <button class="btn-primary" @click="openCreate">+ Nuevo Producto</button>
    </div>

    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>Imagen</th><th>Título</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr v-for="p in products" :key="p._id">
          <td><img :src="p.thumbnail" style="width:48px;height:48px;object-fit:cover;border-radius:6px;" /></td>
          <td>{{ p.title }}</td>
          <td>${{ p.price?.toFixed(2) }}</td>
          <td>{{ p.stock }}</td>
          <td>{{ p.category?.name }}</td>
          <td class="actions">
            <button class="btn-sm btn-outline" @click="editProduct(p)">Editar</button>
            <button class="btn-sm btn-danger" @click="deleteProduct(p._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :page="pagination.page" :pages="pagination.pages" @change="loadPage" />

    <!-- Modal -->
    <div v-if="modal" class="modal-overlay" @click.self="modal = false">
      <div class="modal">
        <h3>{{ editing ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
        <form @submit.prevent="saveProduct">
          <div class="form-group"><label>Título</label><input v-model="form.title" required class="input" /></div>
          <div class="form-group"><label>Precio</label><input v-model.number="form.price" type="number" step="0.01" required class="input" /></div>
          <div class="form-group"><label>Stock</label><input v-model.number="form.stock" type="number" required class="input" /></div>
          <div class="form-group"><label>Descripción</label><textarea v-model="form.description" class="input"></textarea></div>
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="form.category" class="input">
              <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
            </select>
          </div>
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
import { productsApi } from '@/api/products'
import { categoriesApi } from '@/api/categories'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'

const toast = useToastStore()
const products = ref([])
const categories = ref([])
const loading = ref(false)
const modal = ref(false)
const editing = ref(null)
const pagination = ref({ page: 1, pages: 1 })
const form = reactive({ title: '', price: 0, stock: 0, description: '', category: '' })

const loadPage = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await productsApi.list({ page, limit: 20 })
    products.value = data.data
    pagination.value = data.pagination
  } finally { loading.value = false }
}

onMounted(async () => {
  loadPage()
  const { data } = await categoriesApi.list()
  categories.value = data.data.categories
})

const openCreate = () => {
  editing.value = null
  Object.assign(form, { title: '', price: 0, stock: 0, description: '', category: categories.value[0]?._id || '' })
  modal.value = true
}

const editProduct = (p) => {
  editing.value = p._id
  Object.assign(form, { title: p.title, price: p.price, stock: p.stock, description: p.description, category: p.category?._id || p.category })
  modal.value = true
}

const saveProduct = async () => {
  try {
    if (editing.value) { await productsApi.update(editing.value, form); toast.success('Producto actualizado') }
    else { await productsApi.create(form); toast.success('Producto creado') }
    modal.value = false
    loadPage(pagination.value.page)
  } catch (err) { toast.error(err.response?.data?.message || 'Error al guardar') }
}

const deleteProduct = async (id) => {
  if (!confirm('¿Eliminar este producto?')) return
  try { await productsApi.remove(id); toast.success('Eliminado'); loadPage(pagination.value.page) }
  catch (err) { toast.error('Delete failed') }
}
</script>
