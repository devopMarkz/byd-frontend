import api from './api'
import type { ReceitaRequest, ReceitaResponse } from '@/types'

export const receitaService = {
  async listar(inicio?: string, fim?: string): Promise<ReceitaResponse[]> {
    const params = new URLSearchParams()
    if (inicio) params.append('inicio', inicio)
    if (fim) params.append('fim', fim)
    const response = await api.get<ReceitaResponse[]>(`/receitas?${params.toString()}`)
    return response.data
  },

  async registrar(request: ReceitaRequest): Promise<ReceitaResponse> {
    const response = await api.post<ReceitaResponse>('/receitas', request)
    return response.data
  },

  async atualizar(id: string, request: ReceitaRequest): Promise<ReceitaResponse> {
    const response = await api.put<ReceitaResponse>(`/receitas/${id}`, request)
    return response.data
  },

  async baixarNotaFiscal(id: string): Promise<Blob> {
    const response = await api.get(`/receitas/${id}/nota-fiscal`, { responseType: 'blob' })
    return response.data
  },

  async apagarNotaFiscal(id: string): Promise<void> {
    await api.delete(`/receitas/${id}/nota-fiscal`)
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/receitas/${id}`)
  }
}
