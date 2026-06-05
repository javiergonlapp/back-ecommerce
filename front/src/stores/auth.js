import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'SUPER_ADMIN')

  const setTokens = (at, rt) => {
    accessToken.value = at
    refreshToken.value = rt
    localStorage.setItem('accessToken', at)
    localStorage.setItem('refreshToken', rt)
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const { data } = await authApi.login(credentials)
      setTokens(data.data.accessToken, data.data.refreshToken)
      user.value = data.data.user
      return data.data.user
    } finally { loading.value = false }
  }

  const register = async (payload) => {
    loading.value = true
    try {
      const { data } = await authApi.register(payload)
      return data
    } finally { loading.value = false }
  }

  const logout = async () => {
    try { if (refreshToken.value) await authApi.logout(refreshToken.value) } catch {}
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const fetchMe = async () => {
    if (!accessToken.value) return
    try {
      const { data } = await authApi.me()
      user.value = data.data.user
    } catch { await logout() }
  }

  return { user, accessToken, refreshToken, loading, isAuthenticated, isAdmin, login, register, logout, fetchMe, setTokens }
})
