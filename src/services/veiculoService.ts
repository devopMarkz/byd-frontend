import api from './api'
import type { VeiculoRequest, VeiculoResponse } from '@/types'

export const veiculoService = {
  async listar(): Promise<VeiculoResponse[]> {
    const response = await api.get<VeiculoResponse[]>('/veiculos')
    return response.data
  },

  async registrar(request: VeiculoRequest): Promise<VeiculoResponse> {
    const response = await api.post<VeiculoResponse>('/veiculos', request)
    return response.data
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/veiculos/${id}`)
  }
}
