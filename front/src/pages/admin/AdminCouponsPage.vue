<template>
  <div class="admin-page">
    <div class="admin-page-header">
      <h1>Gestión de Cupones</h1>
      <button class="btn-primary" @click="openCreate">+ Nuevo Cupón</button>
    </div>
    <LoadingSpinner v-if="loading" />
    <table v-else class="admin-table">
      <thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Usado</th><th>Activo</th><th>Vence</th><th>Acciones</th></tr></thead>
      <tbody>
        <tr v-for="c in coupons" :key="c._id">
          <td><strong>{{ c.code }}</strong></td>
          <td>{{ c.discountType }}</td>
          <td>{{ c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}` }}</td>
          <td>{{ c.usedCount }}</td>
          <td>{{ c.isActive ? '✅' : '❌' }}</td>
          <td>{{ c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never' }}</td>
          <td class="actions">
            <button class="btn-sm btn-outline" @click="edit(c)">Editar</button>
            <button class="btn-sm btn-danger" @click="remove(c._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="modal" class="modal-overlay" @click.self="modal = false">
      <div class="modal">
        <h3>{{ editing ? 'Editar Cupón' : 'Nuevo Cupón' }}</h3>
        <form @submit.prevent="save">
          <div class="form-group"><label>Código</label><input v-model="form.code" required class="input" style="text-transform:uppercase" /></div>
          <div class="form-group">
            <label>Tipo</label>
            <select v-model="form.discountType" class="input"><option value="percentage">Porcentaje</option><option value="fixed">Fijo ($)</option></select>
          </div>
          <div class="form-group"><label>Valor</label><input v-model.number="form.discountValue" type="number" step="0.01" required class="input" /></div>
          <div class="form-group"><label>Descripción</label><input v-model="form.description" class="input" /></div>
          <div class="form-group"><label>Fecha de Vencimiento</label><input v-model="form.expiresAt" type="date" class="input" /></div>
          <div class="form-group"><label><input type="checkbox" v-model="form.isActive" /> Activo</label></div>
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
import { couponsApi } from '@/api/coupons'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const toast = useToastStore()
const coupons = ref([])
const loading = ref(false)
const modal = ref(false)
const editing = ref(null)
const form = reactive({ code: '', discountType: 'percentage', discountValue: 10, description: '', expiresAt: '', isActive: true })

const load = async () => {
  loading.value = true
  try { const { data } = await couponsApi.list(); coupons.value = data.data.coupons }
  finally { loading.value = false }
}

const openCreate = () => {
  editing.value = null
  Object.assign(form, { code: '', discountType: 'percentage', discountValue: 10, description: '', expiresAt: '', isActive: true })
  modal.value = true
}

const edit = (c) => {
  editing.value = c._id
  Object.assign(form, { code: c.code, discountType: c.discountType, discountValue: c.discountValue, description: c.description, expiresAt: c.expiresAt ? c.expiresAt.substring(0, 10) : '', isActive: c.isActive })
  modal.value = true
}

const save = async () => {
  try {
    const payload = { ...form, expiresAt: form.expiresAt || null }
    if (editing.value) { await couponsApi.update(editing.value, payload); toast.success('Actualizado') }
    else { await couponsApi.create(payload); toast.success('Creado') }
    modal.value = false; load()
  } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
}

const remove = async (id) => {
  if (!confirm('¿Eliminar cupón?')) return
  try { await couponsApi.remove(id); toast.success('Eliminado'); load() }
  catch { toast.error('Delete failed') }
}

onMounted(load)
</script>
