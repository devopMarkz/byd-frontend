import api from './api'
import type {
  EncerrarJornadaRequest,
  IniciarJornadaRequest,
  JornadaResponse,
  AtualizarJornadaRequest,
} from '@/types'

// Corresponde ao AtualizarJornadaRequest do backend (data + horários).
// export interface AtualizarJornadaRequest {
//   data: string          // yyyy-MM-dd
//   horarioInicio: string // HH:mm ou HH:mm:ss
//   horarioFim: string    // HH:mm ou HH:mm:ss
// }

export const jornadaService = {
  async listar(inicio?: string, fim?: string): Promise<JornadaResponse[]> {
    const params = new URLSearchParams()
    if (inicio) params.append('inicio', inicio)
    if (fim) params.append('fim', fim)
    const response = await api.get<JornadaResponse[]>(`/jornadas?${params.toString()}`)
    return response.data
  },

  async iniciarAgora(): Promise<JornadaResponse> {
    const response = await api.post<JornadaResponse>('/jornadas/iniciar-agora')
    return response.data
  },

  async encerrarAtual(): Promise<JornadaResponse> {
    const response = await api.post<JornadaResponse>('/jornadas/encerrar-atual')
    return response.data
  },

  async iniciar(request: IniciarJornadaRequest): Promise<JornadaResponse> {
    const response = await api.post<JornadaResponse>('/jornadas/inicio', request)
    return response.data
  },

  async encerrar(request: EncerrarJornadaRequest): Promise<JornadaResponse> {
    const response = await api.post<JornadaResponse>('/jornadas/fim', request)
    return response.data
  },

  async atualizar(id: string, request: AtualizarJornadaRequest): Promise<JornadaResponse> {
    const response = await api.put<JornadaResponse>(`/jornadas/${id}`, request)
    return response.data
  },

  async excluir(id: string): Promise<void> {
    await api.delete(`/jornadas/${id}`)
  }
}
