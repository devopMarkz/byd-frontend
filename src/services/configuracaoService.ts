import api from './api'

export const configuracaoService = {
  async obterTarifaEnergia(): Promise<number> {
    const resposta = await api.get<number>('/configuracoes/tarifa-energia')
    return resposta.data
  },
  async atualizarTarifaEnergia(dados: { tarifaEnergiaKwh: number }): Promise<void> {
    await api.put('/configuracoes/tarifa-energia', dados)
  }
}
