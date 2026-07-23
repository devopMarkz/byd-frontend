import type { AxiosError } from 'axios'

const MENSAGENS_PADRAO: Record<number, string> = {
  400: 'Requisição inválida.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não possui permissão para acessar este recurso.',
  404: 'Recurso não encontrado.',
  409: 'Não foi possível concluir a operação devido a um conflito.',
  422: 'Dados inválidos. Verifique os campos informados.',
  500: 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
}

function extrairDeCorpo(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null

  const corpo = data as Record<string, unknown>

  if (typeof corpo.message === 'string' && corpo.message.trim()) {
    return corpo.message.trim()
  }

  if (typeof corpo.mensagem === 'string' && corpo.mensagem.trim()) {
    return corpo.mensagem.trim()
  }

  if (Array.isArray(corpo.mensagens)) {
    const primeira = corpo.mensagens.find((item) => typeof item === 'string' && item.trim())
    if (typeof primeira === 'string') return primeira.trim()
  }

  return null
}

export function extrairMensagemErro(erro: unknown, fallback?: string): string {
  try {
    const axiosError = erro as AxiosError
    const mensagem = extrairDeCorpo(axiosError.response?.data)
    if (mensagem) return mensagem

    const status = axiosError.response?.status
    if (status && MENSAGENS_PADRAO[status]) {
      return MENSAGENS_PADRAO[status]
    }
  } catch {
    // Ignora falhas durante o parsing para evitar erro em cascata.
  }

  return fallback ?? 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
}
