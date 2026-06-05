<template>
  <div class="profile-page">
    <h1>Mi Perfil</h1>
    <form class="auth-form" @submit.prevent="save">
      <div class="form-group"><label>Nombre</label><input v-model="form.name" class="input" /></div>
      <div class="form-group"><label>Email</label><input :value="authStore.user?.email" disabled class="input" /></div>
      <p v-if="success" class="form-success">{{ success }}</p>
      <button type="submit" class="btn-primary">Guardar Cambios</button>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/client'

const authStore = useAuthStore()
const form = reactive({ name: '' })
const success = ref('')
onMounted(() => { form.name = authStore.user?.name || '' })

const save = async () => {
  try {
    const { data } = await api.patch('/users/profile', { name: form.name })
    authStore.user = data.data.user
    success.value = '¡Perfil actualizado!'
    setTimeout(() => (success.value = ''), 2000)
  } catch {}
}
</script>
