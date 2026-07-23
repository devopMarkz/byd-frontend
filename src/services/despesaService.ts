import api from './api'
import type { DespesaRequest, DespesaResponse, CategoriaDespesaResponse } from '@/types'

export const despesaService = {
  async listarCategorias(): Promise<CategoriaDespesaResponse[]> {
    const response = await api.get<CategoriaDespesaResponse[]>('/categorias-despesa')
    return response.data
  },

  async listar(inicio?: string, fim?: string): Promise<DespesaResponse[]> {
    const params = new URLSearchParams()
    if (inicio) params.append('inicio', inicio)
    if (fim) params.append('fim', fim)
    const response = await api.get<DespesaResponse[]>(`/despesas?${params.toString()}`)
    return response.data
  },

  async registrar(request: DespesaRequest): Promise<DespesaResponse> {
    const response = await api.post<DespesaResponse>('/despesas', request)
    return response.data
  },

  async atualizar(id: string, request: DespesaRequest): Promise<DespesaResponse> {
    const response = await api.put<DespesaResponse>(`/despesas/${id}`, request)
    return response.data
  },

  async baixarNotaFiscal(id: string): Promise<Blob> {
    const response = await api.get(`/despesas/${id}/nota-fiscal`, { responseType: 'blob' })
    return response.data
  },

  async apagarNotaFiscal(id: string): Promise<void> {
    await api.delete(`/despesas/${id}/nota-fiscal`)
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/despesas/${id}`)
  }
}
