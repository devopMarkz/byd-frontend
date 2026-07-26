/** Converte horas decimais da API para uma duração legível (ex.: 6.65 -> 06:39). */
export function formatarDuracao(horas?: number | null): string {
  const minutos = Math.max(0, Math.round(Number(horas ?? 0) * 60))
  const horasInteiras = Math.floor(minutos / 60)
  const minutosRestantes = minutos % 60
  return `${String(horasInteiras).padStart(2, '0')}:${String(minutosRestantes).padStart(2, '0')}`
}

/** Converte uma duração no formato HH:mm para o número decimal esperado pela API. */
export function duracaoParaHoras(valor: string): number | null {
  const partes = /^(\d+):([0-5]\d)$/.exec(valor.trim())
  return partes ? Number(partes[1]) + Number(partes[2]) / 60 : null
}
