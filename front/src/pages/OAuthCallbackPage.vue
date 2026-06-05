<template><div class="auth-page"><LoadingSpinner text="Autenticando..." /></div></template>
<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(async () => {
  const { token, refresh } = route.query
  if (token && refresh) {
    authStore.setTokens(token, refresh)
    await authStore.fetchMe()
    await cartStore.fetchCart()
    router.push(authStore.isAdmin ? '/admin' : '/')
  } else {
    router.push('/login')
  }
})
</script>
