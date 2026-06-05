<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2>Bienvenido</h2>
    <p class="auth-sub">Inicia sesión en tu cuenta</p>

    <div class="form-group">
      <label>Email</label>
      <input v-model="form.email" type="email" required placeholder="you@example.com" class="input" />
    </div>
    <div class="form-group">
      <label>Contraseña</label>
      <input v-model="form.password" type="password" required placeholder="••••••••" class="input" />
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>

    <button type="submit" class="btn-primary w-full" :disabled="loading">
      {{ loading ? 'Ingresando...' : 'Sign In' }}
    </button>

    <a :href="`${apiUrl}/api/auth/google`" class="btn-google w-full">
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      Continuar con Google
    </a>

    <p class="auth-link">¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink></p>
  </form>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    const user = await authStore.login(form)
    await cartStore.fetchCart()
    router.push(user.role === 'SUPER_ADMIN' ? '/admin' : '/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  } finally { loading.value = false }
}
</script>
