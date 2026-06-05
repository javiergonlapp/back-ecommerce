import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'
import api from '@/api/client'

export const useChatStore = defineStore('chat', () => {
  const socket = ref(null)
  const connected = ref(false)
  const conversations = ref([])   // lista de usuarios con quien chatear
  const activeChat = ref(null)    // { _id, name, role }
  const messages = ref([])        // mensajes de la conversación activa
  const unreadTotal = ref(0)
  const isOpen = ref(false)

  const totalUnread = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
  )

  // ── Conectar socket ──────────────────────────────────────────────────────
  const connect = () => {
    const authStore = useAuthStore()
    if (!authStore.accessToken || socket.value?.connected) return

    socket.value = io(import.meta.env.VITE_API_URL, {
      auth: { token: authStore.accessToken },
      transports: ['websocket'],
    })

    socket.value.on('connect', () => {
      connected.value = true
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('message', (msg) => {
      // Si el mensaje es de la conversación activa, agregarlo
      const isActive =
        activeChat.value &&
        (msg.from?._id === activeChat.value._id || msg.to?._id === activeChat.value._id)

      if (isActive) {
        messages.value.push(msg)
      } else {
        // Incrementar no leídos del remitente
        const conv = conversations.value.find(c => c._id === (msg.from?._id || msg.from))
        if (conv) conv.unread = (conv.unread || 0) + 1
      }
    })

    socket.value.on('messageEdited', ({ id, text }) => {
      const m = messages.value.find(m => m._id === id)
      if (m) { m.text = text; m.edited = true }
    })

    socket.value.on('messageDeleted', (id) => {
      const idx = messages.value.findIndex(m => m._id === id)
      if (idx !== -1) messages.value[idx].deleted = true
    })

    socket.value.on('historyCleared', () => {
      messages.value = []
    })

    socket.value.on('userJoined', (userId) => {
      const conv = conversations.value.find(c => c._id === userId)
      if (conv) conv.isOnline = true
    })

    socket.value.on('userLeft', (userId) => {
      const conv = conversations.value.find(c => c._id === userId)
      if (conv) conv.isOnline = false
    })

    socket.value.on('newMessageNotification', (data) => {
      // Solo admin recibe esto
      loadConversations()
    })

    socket.value.on('newOrder', (data) => {
      // Notificación de nuevo pedido para el admin
      if (authStore.isAdmin) {
        import('@/stores/toast').then(({ useToastStore }) => {
          useToastStore().info(`🛒 Nuevo pedido #${String(data.orderId).slice(-6).toUpperCase()} — $${data.total?.toFixed(2)}`)
        })
      }
    })

    socket.value.on('connect_error', (err) => {
      console.warn('Socket error:', err.message)
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    connected.value = false
    activeChat.value = null
    messages.value = []
    conversations.value = []
  }

  // ── Cargar conversaciones ────────────────────────────────────────────────
  const loadConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations')
      conversations.value = data.data.conversations
    } catch {}
  }

  // ── Abrir chat con un usuario ────────────────────────────────────────────
  const openChat = async (user) => {
    activeChat.value = user
    isOpen.value = true
    messages.value = []

    try {
      const { data } = await api.get(`/chat/history?with=${user._id}`)
      messages.value = data.data.messages

      // Resetear unread
      const conv = conversations.value.find(c => c._id === user._id)
      if (conv) conv.unread = 0
    } catch {}
  }

  // ── Enviar mensaje ───────────────────────────────────────────────────────
  const sendMessage = (text) => {
    if (!socket.value || !activeChat.value || !text.trim()) return
    socket.value.emit('sendMessage', activeChat.value._id, text.trim())
  }

  // ── Editar mensaje ───────────────────────────────────────────────────────
  const editMessage = (msgId, newText) => {
    if (!socket.value) return
    socket.value.emit('editMessage', msgId, newText)
  }

  // ── Eliminar mensaje ─────────────────────────────────────────────────────
  const deleteMessage = (msgId) => {
    if (!socket.value) return
    socket.value.emit('deleteMessage', msgId)
  }

  // ── Borrar historial ─────────────────────────────────────────────────────
  const clearHistory = () => {
    if (!socket.value || !activeChat.value) return
    socket.value.emit('clearHistory', activeChat.value._id)
  }

  return {
    socket, connected, conversations, activeChat, messages,
    isOpen, totalUnread,
    connect, disconnect, loadConversations, openChat,
    sendMessage, editMessage, deleteMessage, clearHistory,
  }
})
