import api from './api'
import type { FormaPagamentoRequest, FormaPagamentoResponse } from '@/types'

export const formaPagamentoService = {
  async listar(): Promise<FormaPagamentoResponse[]> {
    const resposta = await api.get<FormaPagamentoResponse[]>('/formas-pagamento')
    return resposta.data
  },

  async criar(dados: FormaPagamentoRequest): Promise<FormaPagamentoResponse> {
    const resposta = await api.post<FormaPagamentoResponse>('/formas-pagamento', dados)
    return resposta.data
  },

  async editar(id: string, dados: FormaPagamentoRequest): Promise<FormaPagamentoResponse> {
    const resposta = await api.put<FormaPagamentoResponse>(`/formas-pagamento/${id}`, dados)
    return resposta.data
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/formas-pagamento/${id}`)
  }
}
