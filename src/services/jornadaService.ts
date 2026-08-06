import api from './api'
import type { AtualizarJornadaRequest, EncerrarJornadaRequest, EventoJornada, IniciarJornadaRequest, JornadaResponse } from '@/types'

export const jornadaService = {
  async listar(inicio?: string, fim?: string): Promise<JornadaResponse[]> {
    const params = new URLSearchParams(); if (inicio) params.append('inicio', inicio); if (fim) params.append('fim', fim)
    return (await api.get<JornadaResponse[]>(`/jornadas?${params.toString()}`)).data
  },
  async iniciarAgora() { return (await api.post<JornadaResponse>('/jornadas/iniciar-agora')).data },
  async encerrarAtual() { return (await api.post<JornadaResponse>('/jornadas/encerrar-atual')).data },
  async iniciar(request: IniciarJornadaRequest) { return (await api.post<JornadaResponse>('/jornadas/inicio', request)).data },
  async encerrar(request: EncerrarJornadaRequest) { return (await api.post<JornadaResponse>('/jornadas/fim', request)).data },
  async iniciarParada(jornadaId: string) { return (await api.post<JornadaResponse>('/jornadas/iniciar-parada', { jornadaId })).data },
  async retornarParada(jornadaId: string) { return (await api.post<JornadaResponse>('/jornadas/retornar-parada', { jornadaId })).data },
  async atualizarHorarios(id: string, horarios: EventoJornada[]) { return (await api.put<JornadaResponse>(`/jornadas/${id}/horarios`, { horarios })).data },
  async reabrir(id: string) { return (await api.post<JornadaResponse>(`/jornadas/${id}/reabrir`)).data },
  async atualizar(id: string, request: AtualizarJornadaRequest) { return (await api.put<JornadaResponse>(`/jornadas/${id}`, request)).data },
  async excluir(id: string): Promise<void> { await api.delete(`/jornadas/${id}`) },
}