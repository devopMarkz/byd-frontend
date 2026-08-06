export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tipo: string
  expiracao: number
  tenantId: string
  usuarioId: string
  email: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface PerfilResponse {
  id: string
  nome: string
  email: string
  perfil: string
}

export interface AtualizarPerfilRequest {
  nome: string
}

export interface AlterarSenhaRequest {
  senhaAtual: string
  novaSenha: string
}

export interface DiaResumoResponse {
  data: string
  faturamento: number
  despesas: number
  lucroLiquido: number
  custoEnergetico: number
  quilometrosPercorridos: number
  horasTrabalhadas: number
  totalViagens: number
}

export interface DashboardResponse {
  data: string
  faturamento: number
  despesas: number
  lucroLiquido: number
  custoEnergetico: number
  custoPorKm: number
  ganhoPorHora: number
  quilometrosPercorridos: number
  kWhConsumidos: number
  totalViagens: number
  horasTrabalhadas: number
  faturamentoMedioPorHora: number
  faturamentoMedioPorKm: number
  custoPorViagem: number
  custoPorHora: number
  percentualDespesasSobreReceita: number
  metaDiaria: number
  percentualMetaAtingida: number
}

export interface DashboardSemanalResponse {
  dataInicio: string
  dataFim: string
  faturamentoTotal: number
  despesasTotais: number
  lucroLiquidoTotal: number
  quilometrosTotais: number
  horasTrabalhadasTotais: number
  totalViagens: number
  dias: DiaResumoResponse[]
}

export interface DashboardMensalResponse {
  mes: string
  faturamentoTotal: number
  despesasTotais: number
  lucroLiquidoTotal: number
  quilometrosTotais: number
  horasTrabalhadasTotais: number
  totalViagens: number
  dias: DiaResumoResponse[]
}

export interface DespesaPorCategoriaResponse {
  categoria: string
  total: number
  percentual: number
}

export interface OrigemRequest {
  nome: string
  descricao?: string | null
  imagemBase64?: string | null
}

export interface OrigemResponse extends OrigemRequest {
  id: string
}

export interface CategoriaSaidaRequest {
  nome: string
  descricao?: string | null
  tipo: 'CUSTO_FIXO' | 'CUSTO_VARIAVEL'
}

export interface CategoriaSaidaResponse extends CategoriaSaidaRequest {
  id: string
}

export interface FormaPagamentoRequest {
  nome: string
}

export interface FormaPagamentoResponse extends FormaPagamentoRequest {
  id: string
}

export interface ReceitaRequest {
  valor: number
  data: string
  horario: string
  dataHoraInicio: string
  dataHoraFim: string
  origemId?: string
  jornadaId?: string | null
  plataforma?: string | null
  diaSemana?: string
  quantidadeViagens?: number
  quilometrosRodados?: number
  horasTrabalhadas?: number
  observacao?: string | null
  notaFiscalBase64?: string | null
  notaFiscalNome?: string | null
  notaFiscalTipo?: string | null
}

export interface ReceitaResponse extends ReceitaRequest {
  id: string
  origemNome: string
  possuiNotaFiscal: boolean
}

export interface DespesaRequest {
  valor: number
  categoriaSaidaId?: string
  categoriaDespesaId?: string
  formaPagamentoId?: string | null
  data: string
  jornadaId?: string | null
  diaSemana?: string
  tipoGasto?: string
  descricao?: string | null
  itemManutencao?: string | null
  notaFiscalBase64?: string | null
  notaFiscalNome?: string | null
  notaFiscalTipo?: string | null
  observacao?: string | null
}

export interface DespesaResponse extends DespesaRequest {
  id: string
  categoriaSaidaNome: string
  formaPagamentoNome: string | null
  nomeCategoria?: string
  possuiNotaFiscal: boolean
}

export interface CategoriaDespesaResponse {
  id: string
  nome: string
  descricao: string | null
  padrao: boolean
}

export interface EstatisticasPeriodoResponse {
  totalViagens: number
  horasTrabalhadas: number
  quilometrosRodados: number
  receitaPorViagem: number
  receitaPorHora: number
  receitaPorKm: number
  lucroPorViagem: number
  lucroPorHora: number
  lucroPorKm: number
}

export interface OrigemDashboardResponse {
  id: string
  nome: string
  imagemBase64: string | null
  receita: number
  percentualDaMaior: number
}

export interface ResumoJornadaResponse {
  data: string
  inicio: string
  fim: string | null
  horasTrabalhadas: number
  quilometrosPercorridos: number
}

export interface AtualizarJornadaRequest {
  data: string
  horarioInicio: string
  horarioFim: string
}

export interface DashboardPeriodoResponse {
  inicio: string
  fim: string
  receita: number
  despesas: number
  saldo: number
  estatisticas: EstatisticasPeriodoResponse
  receitasPorOrigem: OrigemDashboardResponse[]
  ultimaJornada: ResumoJornadaResponse | null
}

export interface IniciarJornadaRequest {
  veiculoId: string
  data: string
  horarioInicio: string
  odometroInicial: number
  percentualBateriaInicial: number
}

export interface EncerrarJornadaRequest {
  jornadaId: string
  horarioFim: string
  odometroFinal: number
  percentualBateriaFinal: number
}

export type TipoEventoJornada = 'INICIO' | 'INICIO_PARADA' | 'FIM_PARADA' | 'FIM'
export interface EventoJornada { tipo: TipoEventoJornada; dataHora: string }

export interface JornadaResponse {
  id: string
  veiculoId: string
  data: string
  horarioInicio: string
  horarioFim: string | null
  odometroInicial: number
  odometroFinal: number | null
  percentualBateriaInicial: number
  percentualBateriaFinal: number | null
  status: string
  horarios?: string | null
  eventos?: EventoJornada[]
  horasTrabalhadas?: number
}

export interface VeiculoRequest {
  marca: string
  modelo: string
  ano: number
  tipo: string
  capacidadeBateriaKwh: number
  autonomiaKm: number
  consumoMedioKwhKm: number
}

export interface VeiculoResponse extends VeiculoRequest {
  id: string
}

export interface RecargaRequest {
  data: string
  valor: number
  kwhConsumidos: number
  localRecarga?: string
  observacao?: string | null
  notaFiscalBase64?: string | null
  notaFiscalNome?: string | null
  notaFiscalTipo?: string | null
}

export interface RecargaResponse {
  id: string
  veiculoId: string
  despesaId: string | null
  data: string
  horario: string
  kwhConsumidos: number
  tarifaKwh: number
  custo: number
  localRecarga: string | null
  observacao: string | null
  notaFiscalNome: string | null
  notaFiscalTipo: string | null
  possuiNotaFiscal: boolean
}

export interface TarifaEnergiaRequest {
  tarifaEnergiaKwh: number
}
