import api from './api'
import type { DashboardMensalResponse, DashboardPeriodoResponse, DashboardResponse, DashboardSemanalResponse, DespesaPorCategoriaResponse } from '@/types'

export const dashboardService = {
  async obterPorPeriodo(periodo: 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ANUAL' | 'PERSONALIZADO', referencia: string, inicio?: string, fim?: string): Promise<DashboardPeriodoResponse> {
    const parametros = new URLSearchParams({ periodo, referencia })
    if (inicio) parametros.set('inicio', inicio)
    if (fim) parametros.set('fim', fim)
    const resposta = await api.get<DashboardPeriodoResponse>(`/dashboard?${parametros.toString()}`)
    return resposta.data
  },

  async obterHoje(): Promise<DashboardResponse> {
    const hoje = new Date().toISOString().split('T')[0]
    const response = await api.get<DashboardResponse>(`/dashboard/financeiro?data=${hoje}`)
    return response.data
  },

  async obterPorData(data: string): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(`/dashboard/financeiro?data=${data}`)
    return response.data
  },

  async obterSemanal(dataReferencia: string): Promise<DashboardSemanalResponse> {
    const response = await api.get<DashboardSemanalResponse>(`/dashboard/semanal?dataReferencia=${dataReferencia}`)
    return response.data
  },

  async obterMensal(mesReferencia: string): Promise<DashboardMensalResponse> {
    const mes = mesReferencia.slice(0, 7)
    const response = await api.get<DashboardMensalResponse>(`/dashboard/mensal?mesReferencia=${mes}`)
    return response.data
  },

  async obterDespesasPorCategoria(inicio: string, fim: string): Promise<DespesaPorCategoriaResponse[]> {
    const response = await api.get<DespesaPorCategoriaResponse[]>(`/dashboard/despesas-por-categoria?inicio=${inicio}&fim=${fim}`)
    return response.data
  }
}
