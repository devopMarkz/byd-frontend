import api from './api'
import type { OrigemRequest, OrigemResponse } from '@/types'

export const origemService = {
  async listar(): Promise<OrigemResponse[]> {
    const resposta = await api.get<OrigemResponse[]>('/origens')
    return resposta.data
  },

  async criar(dados: OrigemRequest): Promise<OrigemResponse> {
    const resposta = await api.post<OrigemResponse>('/origens', dados)
    return resposta.data
  },

  async editar(id: string, dados: OrigemRequest): Promise<OrigemResponse> {
    const resposta = await api.put<OrigemResponse>(`/origens/${id}`, dados)
    return resposta.data
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/origens/${id}`)
  }
}
