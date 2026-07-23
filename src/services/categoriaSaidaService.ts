import api from './api'
import type { CategoriaSaidaRequest, CategoriaSaidaResponse } from '@/types'

export const categoriaSaidaService = {
  async listar(): Promise<CategoriaSaidaResponse[]> {
    const resposta = await api.get<CategoriaSaidaResponse[]>('/categorias-saida')
    return resposta.data
  },

  async criar(dados: CategoriaSaidaRequest): Promise<CategoriaSaidaResponse> {
    const resposta = await api.post<CategoriaSaidaResponse>('/categorias-saida', dados)
    return resposta.data
  },

  async editar(id: string, dados: CategoriaSaidaRequest): Promise<CategoriaSaidaResponse> {
    const resposta = await api.put<CategoriaSaidaResponse>(`/categorias-saida/${id}`, dados)
    return resposta.data
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/categorias-saida/${id}`)
  }
}
