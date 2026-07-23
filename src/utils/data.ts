export function dataAtualBrasil(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

export function horarioAtualBrasil(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date())
}

export function dataHoraAtualBrasil(): { data: string; horario: string } {
  return { data: dataAtualBrasil(), horario: horarioAtualBrasil() }
}

export function formatarDataBrasileira(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}
