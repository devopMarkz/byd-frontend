<template>
  <div class="tela">
    <header class="topbar">
      <button class="voltar" aria-label="Voltar" @click="router.back()">←</button>
      <div><span class="eyebrow">Histórico operacional</span><h1>Jornadas</h1></div>
    </header>

    <main class="conteudo">
      <article v-for="jornada in jornadas" :key="jornada.id" class="card" :class="{ aberta: jornada.status === 'EM_ANDAMENTO' }">
        <div class="card-cabecalho">
          <strong>{{ formatarData(jornada.data) }}</strong>
          <span class="status" :class="{ aberta: jornada.status === 'EM_ANDAMENTO' }">{{ jornada.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada' }}</span>
        </div>
        <p class="periodo">{{ jornada.horarioInicio?.slice(0, 5) }} <span>→</span> {{ jornada.horarioFim?.slice(0, 5) || 'Em andamento' }}</p>
        <div class="card-acoes">
          <button class="secundario" @click="abrirGerenciamento(jornada)">Gerenciar horários</button>
          <button v-if="podeReabrir(jornada)" class="secundario" @click="reabrir(jornada)">Reabrir</button>
          <button class="icone perigo" aria-label="Excluir jornada" @click="excluir(jornada)">Excluir</button>
        </div>
      </article>
      <p v-if="!jornadas.length" class="vazio">Nenhuma jornada cadastrada.</p>
    </main>

    <div v-if="editando" class="overlay" @click.self="fechar">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-gerenciamento">
        <header class="modal-cabecalho">
          <div><span class="eyebrow">{{ formatarData(editando.data) }}</span><h2 id="titulo-gerenciamento">Gerenciar horários</h2></div>
          <button class="fechar" aria-label="Fechar" @click="fechar">×</button>
        </header>
        <p class="descricao">Ajuste os horários e as paradas. A sequência e a ordem cronológica são verificadas ao salvar.</p>

        <div class="linha-tempo">
          <div v-for="(evento, indice) in eventos" :key="`${evento.tipo}-${indice}`" class="evento">
            <span class="marcador" :class="evento.tipo.toLowerCase()"></span>
            <div class="evento-conteudo">
              <label :for="`evento-${indice}`">{{ nomes[evento.tipo] }}</label>
              <input :id="`evento-${indice}`" v-model="evento.dataHora" type="datetime-local" step="1" />
            </div>
            <button v-if="evento.tipo === 'INICIO_PARADA'" class="remover" @click="removerParada(indice)">Remover pausa</button>
          </div>
        </div>

        <div class="comandos">
          <button v-if="podePausa" class="secundario" @click="adicionarParada">+ Adicionar parada</button>
          <button v-if="podeFim" class="secundario" @click="adicionarFim">+ Adicionar encerramento</button>
        </div>
        <p v-if="erro" class="erro">{{ erro }}</p>
        <footer class="modal-rodape"><button class="secundario" @click="fechar">Cancelar</button><button class="primario" :disabled="salvando" @click="salvar">{{ salvando ? 'Salvando...' : 'Salvar alterações' }}</button></footer>
      </section>
    </div>
  </div>
    <div v-if="confirmacao" class="overlay confirmacao" @click.self="cancelarConfirmacao"><section class="modal modal-confirmacao" role="alertdialog" aria-modal="true"><span class="icone-confirmacao" :class="confirmacao.tipo">{{ confirmacao.tipo === 'excluir' ? '!' : '↺' }}</span><h2>{{ confirmacao.titulo }}</h2><p>{{ confirmacao.mensagem }}</p><footer class="modal-rodape"><button class="secundario" @click="cancelarConfirmacao">Cancelar</button><button class="primario" :class="{ excluir: confirmacao.tipo === 'excluir' }" :disabled="processandoConfirmacao" @click="confirmarAcao">{{ processandoConfirmacao ? 'Aguarde...' : confirmacao.acao }}</button></footer></section></div>
    <div v-if="mensagemModal" class="overlay confirmacao" @click.self="mensagemModal = ''"><section class="modal modal-confirmacao" role="alertdialog" aria-modal="true"><span class="icone-confirmacao erro-icone">!</span><h2>Não foi possível concluir</h2><p>{{ mensagemModal }}</p><footer class="modal-rodape"><button class="primario" @click="mensagemModal = ''">Entendi</button></footer></section></div></template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jornadaService } from '@/services/jornadaService'
import type { EventoJornada, TipoEventoJornada } from '@/types'
import { formatarDataBrasileira } from '@/utils/data'

const router = useRouter()
const jornadas = ref<any[]>([])
const editando = ref<any>(null)
const eventos = ref<EventoJornada[]>([])
const salvando = ref(false)
const erro = ref('')
const confirmacao = ref<any>(null)
const processandoConfirmacao = ref(false)
const mensagemModal = ref('')
const nomes: Record<TipoEventoJornada, string> = { INICIO: 'Início da jornada', INICIO_PARADA: 'Início da parada', FIM_PARADA: 'Retorno da parada', FIM: 'Encerramento da jornada' }
const formatarData = (valor: string) => formatarDataBrasileira(valor)
const pad = (valor: number) => String(valor).padStart(2, '0')
const agora = () => { const data = new Date(); return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(data.getSeconds())}` }

function eventosDaJornada(jornada: any): EventoJornada[] {
  try {
    if (jornada.horarios) return JSON.parse(jornada.horarios) as EventoJornada[]
    const resultado: EventoJornada[] = [{ tipo: 'INICIO', dataHora: `${jornada.data}T${jornada.horarioInicio}` }]
    if (jornada.horarioFim) resultado.push({ tipo: 'FIM', dataHora: `${jornada.data}T${jornada.horarioFim}` })
    return resultado
  } catch { return [] }
}
function abrirGerenciamento(jornada: any) { editando.value = jornada; erro.value = ''; eventos.value = eventosDaJornada(jornada).map(evento => ({ ...evento, dataHora: evento.dataHora.slice(0, 19) })) }
function fechar() { editando.value = null; eventos.value = []; erro.value = '' }
const ultimo = computed(() => eventos.value.at(-1)?.tipo)
const podePausa = computed(() => ['INICIO', 'FIM_PARADA', 'FIM'].includes(ultimo.value || ''))
const podeFim = computed(() => ultimo.value === 'INICIO' || ultimo.value === 'FIM_PARADA')
function adicionarParada() { const fim = ultimo.value === 'FIM' ? eventos.value.pop() : undefined; const horario = fim?.dataHora || agora(); eventos.value.push({ tipo: 'INICIO_PARADA', dataHora: horario }, { tipo: 'FIM_PARADA', dataHora: horario }); if (fim) eventos.value.push(fim) }
function removerParada(indice: number) { eventos.value.splice(indice, 2) }
function adicionarFim() { eventos.value.push({ tipo: 'FIM', dataHora: agora() }) }
function podeReabrir(jornada: any) { return jornada.status === 'ENCERRADA' && !jornadas.value.some(item => item.status === 'EM_ANDAMENTO') && jornadas.value[0]?.id === jornada.id }
async function carregar() { jornadas.value = await jornadaService.listar() }
async function salvar() { salvando.value = true; erro.value = ''; try { await jornadaService.atualizarHorarios(editando.value.id, eventos.value); fechar(); await carregar() } catch (e: any) { erro.value = e.userMessage || 'Não foi possível salvar os horários.' } finally { salvando.value = false } }
function reabrir(jornada: any) { confirmacao.value = { tipo: 'reabrir', jornada, titulo: 'Reabrir jornada?', mensagem: 'O encerramento será removido e a jornada voltará a ficar em andamento.', acao: 'Reabrir jornada' } }
function excluir(jornada: any) { confirmacao.value = { tipo: 'excluir', jornada, titulo: 'Excluir jornada?', mensagem: 'Esta ação remove a jornada e não pode ser desfeita.', acao: 'Excluir jornada' } }
function cancelarConfirmacao() { if (!processandoConfirmacao.value) confirmacao.value = null }
async function confirmarAcao() { if (!confirmacao.value) return; processandoConfirmacao.value = true; try { if (confirmacao.value.tipo === 'reabrir') await jornadaService.reabrir(confirmacao.value.jornada.id); else await jornadaService.excluir(confirmacao.value.jornada.id); confirmacao.value = null; await carregar() } catch (e: any) { confirmacao.value = null; mensagemModal.value = e.userMessage || 'Ocorreu um erro ao concluir a ação.' } finally { processandoConfirmacao.value = false } }onMounted(carregar)
</script>

<style scoped>
.tela{min-height:100vh;background:linear-gradient(150deg,#0b101a,#05070d);color:var(--text);padding-bottom:2rem}.topbar{display:flex;align-items:center;gap:.85rem;padding:1rem 1.1rem;border-bottom:1px solid var(--border);background:color-mix(in oklab,var(--bg) 82%,transparent)}.topbar h1,.modal h2{margin:.1rem 0 0;font-size:1.15rem}.eyebrow{font-size:.68rem;color:var(--accent);font-weight:700;text-transform:uppercase;letter-spacing:.08em}.voltar,.fechar,.secundario,.primario,.icone,.remover{border-radius:var(--radius);font:inherit;cursor:pointer}.voltar,.fechar,.secundario,.icone{background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text)}.voltar,.fechar{width:38px;height:38px;font-size:1.2rem}.conteudo{max-width:680px;margin:0 auto;padding:1.1rem;display:grid;gap:.75rem}.card{padding:1rem 1.05rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface)}.card.aberta{border-color:rgba(212,255,58,.4)}.card-cabecalho,.card-acoes,.modal-cabecalho,.modal-rodape{display:flex;align-items:center;justify-content:space-between;gap:.65rem}.status{font-size:.68rem;font-weight:700;text-transform:uppercase;color:var(--text-mute);padding:.3rem .55rem;border:1px solid var(--border);border-radius:999px}.status.aberta{color:var(--accent);border-color:rgba(212,255,58,.35);background:rgba(212,255,58,.08)}.periodo{margin:.65rem 0 .9rem;color:var(--text-dim);font-size:.95rem}.periodo span{color:var(--accent);padding:0 .3rem}.card-acoes{justify-content:flex-start}.secundario,.primario,.remover{padding:.58rem .8rem;font-size:.82rem;font-weight:650}.secundario:hover{border-color:var(--accent);color:var(--accent)}.icone{margin-left:auto;padding:.58rem .7rem}.perigo,.remover{color:#ff8793;border-color:rgba(255,107,122,.35)}.vazio{text-align:center;color:var(--text-mute);padding:2rem}.overlay{position:fixed;inset:0;z-index:20;background:rgba(0,0,0,.68);display:grid;place-items:center;padding:1rem;backdrop-filter:blur(5px)}.modal{width:min(620px,100%);max-height:calc(100vh - 2rem);overflow:auto;padding:1.1rem;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);box-shadow:0 28px 70px -30px #000}.descricao{margin:.2rem 0 .4rem;color:var(--text-mute);font-size:.84rem;line-height:1.45}.linha-tempo{display:grid;gap:.65rem;border-left:1px solid var(--border);margin:.7rem 0 .9rem;padding-left:1rem}.evento{position:relative;display:grid;grid-template-columns:1fr auto;gap:.65rem;align-items:end}.marcador{position:absolute;left:-1.32rem;top:.55rem;width:.55rem;height:.55rem;border:2px solid var(--surface);border-radius:50%;background:var(--accent)}.marcador.inicio_parada{background:#ffb454}.marcador.fim{background:#ff6b7a}.evento-conteudo{display:grid;gap:.3rem}.evento label{font-size:.72rem;color:var(--text-mute);font-weight:700;text-transform:uppercase;letter-spacing:.04em}.evento input{width:100%;box-sizing:border-box;padding:.65rem .7rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--input-bg);color:var(--text);font:inherit}.remover{background:rgba(255,107,122,.07);border:1px solid rgba(255,107,122,.28)}.comandos{display:flex;gap:.55rem;flex-wrap:wrap}.erro{color:#ff8793;font-size:.84rem}.modal-rodape{margin-top:1rem;justify-content:flex-end}.primario{border:0;background:var(--accent);color:#10130a}.primario:disabled{opacity:.6;cursor:not-allowed}.modal-confirmacao{max-width:390px;text-align:center;justify-items:center}.modal-confirmacao h2,.modal-confirmacao p{margin:0}.icone-confirmacao{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;font-weight:800;font-size:1.35rem;background:rgba(212,255,58,.12);color:var(--accent)}.icone-confirmacao.excluir,.erro-icone{background:rgba(255,107,122,.13);color:#ff8793}.primario.excluir{background:#ff6b7a;color:#21070b}.modal-confirmacao{max-width:390px;text-align:center;justify-items:center}.modal-confirmacao h2,.modal-confirmacao p{margin:0}.icone-confirmacao{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;font-weight:800;font-size:1.35rem;background:rgba(212,255,58,.12);color:var(--accent)}.icone-confirmacao.excluir,.erro-icone{background:rgba(255,107,122,.13);color:#ff8793}.primario.excluir{background:#ff6b7a;color:#21070b}@media(max-width:520px){.evento{grid-template-columns:1fr}.remover{justify-self:start}.card-acoes{flex-wrap:wrap}.icone{margin-left:0}}
.overlay.confirmacao{z-index:30}.modal-confirmacao{max-width:400px;padding:1.25rem;display:flex;flex-direction:column;align-items:center;gap:1rem;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:calc(var(--radius) + 6px)}.modal-confirmacao h2{margin:0;color:var(--text)!important;font-size:1.1rem;font-weight:700}.modal-confirmacao p{margin:0;color:var(--text-dim)!important;line-height:1.45}.modal-confirmacao .modal-rodape{width:100%;margin-top:.25rem}.modal-confirmacao .modal-rodape>*{flex:1}</style>