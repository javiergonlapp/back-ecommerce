<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
    <ToastContainer />
    <ChatWidget v-if="authStore.isAuthenticated" />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import ChatWidget from '@/components/chat/ChatWidget.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useChatStore } from '@/stores/chat'

const authStore = useAuthStore()
const cartStore = useCartStore()
const chatStore = useChatStore()

onMounted(async () => {
  if (authStore.accessToken) {
    await authStore.fetchMe()
    if (authStore.isAuthenticated) {
      await cartStore.fetchCart()
      chatStore.connect()          // conectar socket al cargar
    }
  }
})

// Conectar/desconectar socket cuando cambia el estado de auth
watch(() => authStore.isAuthenticated, (val) => {
  if (val) chatStore.connect()
  else chatStore.disconnect()
})
</script>
