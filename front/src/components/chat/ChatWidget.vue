<template>
  <!-- Botón flotante -->
  <div class="chat-fab-wrap">
    <button class="chat-fab" @click="toggleChat" :title="chatStore.isOpen ? 'Cerrar chat' : 'Soporte en línea'">
      <span v-if="!chatStore.isOpen">💬</span>
      <span v-else>✕</span>
      <span v-if="chatStore.totalUnread > 0" class="chat-fab-badge">{{ chatStore.totalUnread }}</span>
    </button>

    <!-- Ventana de chat -->
    <transition name="chat-slide">
      <div v-if="chatStore.isOpen" class="chat-window">

        <!-- Header -->
        <div class="chat-header">
          <div class="chat-header-left">
            <div v-if="chatStore.activeChat" class="chat-back" @click="chatStore.activeChat = null; chatStore.messages = []">←</div>
            <div class="chat-title">
              <span v-if="!chatStore.activeChat">
                {{ authStore.isAdmin ? 'Clientes' : 'Soporte' }}
              </span>
              <span v-else>{{ chatStore.activeChat.name }}</span>
            </div>
            <span v-if="chatStore.activeChat" class="online-dot"
              :class="{ online: isActiveChatOnline }"></span>
          </div>
          <div class="chat-header-right">
            <span v-if="chatStore.connected" class="conn-indicator" title="Conectado">●</span>
            <button v-if="chatStore.activeChat && authStore.isAdmin"
              class="clear-btn" @click="confirmClear" title="Borrar historial">🗑</button>
          </div>
        </div>

        <!-- Lista de conversaciones (cuando no hay chat activo) -->
        <div v-if="!chatStore.activeChat" class="conv-list">
          <div v-if="!chatStore.conversations.length" class="conv-empty">
            <span>{{ authStore.isAdmin ? 'No hay conversaciones aún' : 'Cargando...' }}</span>
          </div>
          <div
            v-for="conv in chatStore.conversations"
            :key="conv._id"
            class="conv-item"
            @click="chatStore.openChat(conv)"
          >
            <div class="conv-avatar" :style="{ background: avatarColor(conv.name) }">
              {{ conv.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="conv-info">
              <p class="conv-name">{{ conv.name }}</p>
              <p class="conv-sub">{{ conv.isOnline ? '● En línea' : '○ Desconectado' }}</p>
            </div>
            <span v-if="conv.unread > 0" class="unread-badge">{{ conv.unread }}</span>
          </div>
        </div>

        <!-- Mensajes -->
        <div v-else class="messages-wrap" ref="messagesEl">
          <div v-if="!chatStore.messages.length" class="messages-empty">
            <p>Envía un mensaje para iniciar la conversación</p>
          </div>
          <div
            v-for="msg in chatStore.messages"
            :key="msg._id"
            :class="['msg-row', isMine(msg) ? 'mine' : 'theirs']"
          >
            <div v-if="msg.deleted" class="bubble deleted">🗑 Eliminado</div>
            <div v-else class="bubble">
              {{ msg.text }}
              <span v-if="msg.edited" class="edited-tag">(editado)</span>
            </div>
            <div class="msg-meta">{{ formatTime(msg.createdAt) }}</div>
            <!-- Acciones solo en mensajes propios -->
            <div v-if="isMine(msg) && !msg.deleted" class="msg-actions">
              <button @click="startEdit(msg)">✏️</button>
              <button @click="chatStore.deleteMessage(msg._id)">🗑</button>
            </div>
          </div>
        </div>

        <!-- Input de edición -->
        <div v-if="editingMsg" class="edit-bar">
          ✏️ Editando — <button @click="cancelEdit">✕ Cancelar</button>
        </div>

        <!-- Input de mensaje -->
        <div v-if="chatStore.activeChat" class="chat-input-wrap">
          <textarea
            v-model="inputText"
            ref="inputEl"
            placeholder="Escribe un mensaje..."
            rows="1"
            @keydown.enter.exact.prevent="send"
            @input="autoResize"
          ></textarea>
          <button class="send-btn" @click="send">➤</button>
        </div>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'

const chatStore = useChatStore()
const authStore = useAuthStore()

const inputText = ref('')
const editingMsg = ref(null)
const messagesEl = ref(null)
const inputEl = ref(null)

// Cargar conversaciones cuando se abre el widget
const toggleChat = async () => {
  chatStore.isOpen = !chatStore.isOpen
  if (chatStore.isOpen && !chatStore.conversations.length) {
    await chatStore.loadConversations()
    // Si es cliente, abrir directamente el chat con el admin
    if (!authStore.isAdmin && chatStore.conversations.length) {
      chatStore.openChat(chatStore.conversations[0])
    }
  }
}

// Scroll al último mensaje
watch(() => chatStore.messages.length, async () => {
  await nextTick()
  if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
})

const isMine = (msg) => {
  const fromId = msg.from?._id || msg.from
  return fromId === authStore.user?._id
}

const isActiveChatOnline = computed(() => {
  const conv = chatStore.conversations.find(c => c._id === chatStore.activeChat?._id)
  return conv?.isOnline || false
})

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

const avatarColor = (name = '') => {
  const colors = ['#6c63ff', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b']
  let h = 0
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h)
  return colors[Math.abs(h) % colors.length]
}

const send = () => {
  if (!inputText.value.trim()) return
  if (editingMsg.value) {
    chatStore.editMessage(editingMsg.value._id, inputText.value.trim())
    cancelEdit()
  } else {
    chatStore.sendMessage(inputText.value.trim())
    inputText.value = ''
  }
}

const startEdit = (msg) => {
  editingMsg.value = msg
  inputText.value = msg.text
  nextTick(() => inputEl.value?.focus())
}

const cancelEdit = () => {
  editingMsg.value = null
  inputText.value = ''
}

const confirmClear = () => {
  if (confirm(`¿Borrar historial con ${chatStore.activeChat?.name}?`)) {
    chatStore.clearHistory()
  }
}

const autoResize = (e) => {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
}
</script>
