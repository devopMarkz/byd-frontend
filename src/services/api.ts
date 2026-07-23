import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { extrairMensagemErro } from '@/utils/erro'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = extrairMensagemErro(error)

    if (error.response?.status === 401) {
      const requisicaoLogin = error.config?.url?.includes('/auth/login') ?? false
      if (!requisicaoLogin) {
        useAuthStore().logout()
        return new Promise(() => {})
      }
    }
    return Promise.reject(error)
  }
)

export default api
