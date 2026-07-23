import api from './api'
import type { LoginRequest, TokenResponse } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/login', credentials)
    return response.data
  },

  async refresh(): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/refresh')
    return response.data
  }
}
