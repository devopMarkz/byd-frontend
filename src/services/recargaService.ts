import api from './api'
import type { RecargaRequest, RecargaResponse } from '@/types'

export const recargaService = {
  async listar(inicio?: string, fim?: string): Promise<RecargaResponse[]> {
    const params = new URLSearchParams()
    if (inicio) params.append('inicio', inicio)
    if (fim) params.append('fim', fim)
    const response = await api.get<RecargaResponse[]>(`/recargas?${params.toString()}`)
    return response.data
  },

  async registrar(request: RecargaRequest): Promise<RecargaResponse> {
    const response = await api.post<RecargaResponse>('/recargas', request)
    return response.data
  },

  async atualizar(id: string, request: RecargaRequest): Promise<RecargaResponse> {
    const response = await api.put<RecargaResponse>(`/recargas/${id}`, request)
    return response.data
  },

  async baixarNotaFiscal(id: string): Promise<Blob> {
    const response = await api.get(`/recargas/${id}/nota-fiscal`, { responseType: 'blob' })
    return response.data
  },

  async apagarNotaFiscal(id: string): Promise<void> {
    await api.delete(`/recargas/${id}/nota-fiscal`)
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/recargas/${id}`)
  }
}
