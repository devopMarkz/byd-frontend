import api from './api'
import type { AlterarSenhaRequest, AtualizarPerfilRequest, PerfilResponse } from '@/types'

export const perfilService = {
  async obter(): Promise<PerfilResponse> {
    const resposta = await api.get<PerfilResponse>('/perfil')
    return resposta.data
  },

  async atualizar(dados: AtualizarPerfilRequest): Promise<PerfilResponse> {
    const resposta = await api.put<PerfilResponse>('/perfil', dados)
    return resposta.data
  },

  async alterarSenha(dados: AlterarSenhaRequest): Promise<void> {
    await api.put('/perfil/senha', dados)
  }
}
