<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2>Crear cuenta</h2>
    <p class="auth-sub">Únete a JAVIER SHOP hoy</p>

    <div class="form-group">
      <label>Nombre completo</label>
      <input v-model="form.name" type="text" required placeholder="Juan Pérez" class="input" />
    </div>
    <div class="form-group">
      <label>Email</label>
      <input v-model="form.email" type="email" required placeholder="you@example.com" class="input" />
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <input v-model="form.password" type="password" required placeholder="Mínimo 8 caracteres" class="input" />
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-if="success" class="form-success">{{ success }}</p>

    <button type="submit" class="btn-primary w-full" :disabled="loading">
      {{ loading ? 'Creando...' : 'Crear Cuenta' }}
    </button>
    <p class="auth-link">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
  </form>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const form = reactive({ name: '', email: '', password: '' })
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.register(form)
    success.value = '¡Cuenta creada! Redirigiendo...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally { loading.value = false }
}
</script>
