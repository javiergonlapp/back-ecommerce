import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 0

  const add = (message, type = 'info', duration = 3500) => {
    const id = ++nextId
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  const remove = (id) => { toasts.value = toasts.value.filter((t) => t.id !== id) }
  const success = (msg) => add(msg, 'success')
  const error = (msg) => add(msg, 'error')
  const info = (msg) => add(msg, 'info')

  return { toasts, success, error, info, remove }
})
