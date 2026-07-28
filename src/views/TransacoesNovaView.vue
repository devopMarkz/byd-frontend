<template>
  <div class="tela">
    <div class="ambient glow-1" />
    <div class="ambient glow-2" />

    <header class="topbar">
      <div class="head-txt">
        <span class="eyebrow"><span class="dot" /> BYD Dolphin</span>
        <h1>Transações</h1>
      </div>
      <div class="topbar-botoes">
        <button class="botao-tutorial" aria-label="Iniciar tutorial" @click="iniciarTutorialTransacoes">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Tutorial
        </button>
      </div>
    </header>

    <main class="conteudo">
      <div class="abas">
        <button :class="{ ativa: tipo === 'E' }" @click="trocarTipo('E')">Entradas</button>
        <button :class="{ ativa: tipo === 'S' }" @click="trocarTipo('S')">Saídas</button>
        <button :class="{ ativa: tipo === 'R' }" @click="trocarTipo('R')">Recargas</button>
      </div>

      <div class="filtros" :class="{ 'com-extra': tipo === 'E' || tipo === 'S' }">
        <label class="field">
          <span>Início</span>
          <input v-model="inicio" type="date" @change="carregar" />
        </label>
        <label class="field">
          <span>Fim</span>
          <input v-model="fim" type="date" @change="carregar" />
        </label>
        <label v-if="tipo === 'E'" class="field">
          <span>Origem</span>
          <select v-model="filtroOrigemId">
            <option value="">Todas</option>
            <option v-for="origem in origens" :key="origem.id" :value="origem.id">{{ origem.nome }}</option>
          </select>
        </label>
        <label v-if="tipo === 'S'" class="field">
          <span>Categoria</span>
          <select v-model="filtroCategoriaId">
            <option value="">Todas</option>
            <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nome }}</option>
          </select>
        </label>
      </div>

      <p v-if="erro" class="mensagem erro">{{ erro }}</p>

      <section class="lista">
        <article
          v-for="item in itensExibidos"
          :key="item.id"
          class="item"
          role="button"
          tabindex="0"
          @click="abrirPreview(item)"
          @keydown.enter="abrirPreview(item)"
          @keydown.space.prevent="abrirPreview(item)"
        >
          <div class="item-body">
            <strong v-if="tipo === 'R'">
              {{ formatar(item.data) }} · {{ item.localRecarga || 'Local não informado' }}
            </strong>
            <strong v-else>
              {{ formatar(item.data) }} · {{ tipo === 'E' ? item.origemNome : item.categoriaSaidaNome }}
            </strong>
            <p v-if="tipo === 'E'" class="meta">
              {{ item.quantidadeViagens }} viagens · {{ item.quilometrosRodados }} km · {{ formatarDuracao(item.horasTrabalhadas) }}
            </p>
            <p v-else-if="tipo === 'S'" class="meta">{{ item.tipoGasto }}</p>
            <p v-else class="meta">
              {{ item.kwhConsumidos }} kWh · Tarifa: {{ moeda(item.tarifaKwh) }}/kWh
            </p>
            <p v-if="item.observacao || item.descricao" class="obs">
              {{ item.observacao || item.descricao }}
            </p>
          </div>

          <div class="item-tail">
            <b class="valor" :class="{ saida: tipo === 'S' || tipo === 'R' }">
              {{ moeda(tipo === 'R' ? item.custo : item.valor) }}
            </b>
            <div class="acoes">
              <button class="ic-btn" @click.stop="editar(item)" title="Editar"><IconeApp nome="editar" :tamanho="16" /></button>
              <button v-if="tipo === 'S'" class="ic-btn" @click.stop="duplicar(item)" title="Duplicar">⎘</button>
              <button v-if="item.possuiNotaFiscal" class="ic-btn" @click.stop="baixar(item)" title="Baixar NF"><IconeApp nome="baixar" :tamanho="16" /></button>
              <button class="ic-btn danger" @click.stop="pedirExclusao(item)" title="Excluir"><IconeApp nome="excluir" :tamanho="16" /></button>
            </div>
          </div>
        </article>

        <div v-if="!itensExibidos.length" class="vazio">
          <span class="vazio-icon"><IconeApp nome="documento" :tamanho="28" /></span>
          <p>Nenhum lançamento no período.</p>
        </div>
      </section>
    </main>

    <router-link :to="rotaNova" class="fab" :aria-label="`Nova ${rotuloTipo.toLowerCase()}`">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
      </svg>
    </router-link>

    <nav class="menu-inferior">
      <router-link to="/"><IconeApp nome="painel" />Painel</router-link>
      <router-link to="/transacoes" class="ativo"><IconeApp nome="transacoes" />Transações</router-link>
      <router-link to="/configuracoes"><IconeApp nome="configuracoes" />Configurações</router-link>
    </nav>

    <!-- Modal de preview / detalhes -->
    <transition name="modal">
      <div v-if="preview" class="modal-backdrop" @click.self="fecharPreview">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="preview-titulo">
          <header class="modal-head">
            <div class="modal-head-txt">
              <span class="modal-tag" :class="tagClasse">{{ rotuloTipo }}</span>
              <h2 id="preview-titulo">{{ formatar(preview.data) }}</h2>
            </div>
            <button class="modal-close" @click="fecharPreview" title="Fechar" aria-label="Fechar"><IconeApp nome="fechar" :tamanho="16" /></button>
          </header>

          <div class="modal-valor" :class="{ saida: tipo === 'S' || tipo === 'R' }">
            {{ moeda(tipo === 'R' ? preview.custo : preview.valor) }}
          </div>

          <dl class="detalhes">
            <template v-if="tipo === 'E'">
              <div class="detalhe"><dt>Origem</dt><dd>{{ preview.origemNome || '—' }}</dd></div>
              <div class="detalhe"><dt>Viagens</dt><dd>{{ preview.quantidadeViagens ?? '—' }}</dd></div>
              <div class="detalhe"><dt>Quilômetros</dt><dd>{{ preview.quilometrosRodados ?? '—' }} km</dd></div>
              <div class="detalhe"><dt>Horas</dt><dd>{{ preview.horasTrabalhadas == null ? '—' : formatarDuracao(preview.horasTrabalhadas) }}</dd></div>
            </template>
            <template v-else-if="tipo === 'S'">
              <div class="detalhe"><dt>Categoria</dt><dd>{{ preview.categoriaSaidaNome || '—' }}</dd></div>
              <div class="detalhe"><dt>Tipo de gasto</dt><dd>{{ preview.tipoGasto || '—' }}</dd></div>
            </template>
            <template v-else>
              <div class="detalhe"><dt>Local</dt><dd>{{ preview.localRecarga || '—' }}</dd></div>
              <div class="detalhe"><dt>kWh consumidos</dt><dd>{{ preview.kwhConsumidos ?? '—' }} kWh</dd></div>
              <div class="detalhe"><dt>Tarifa</dt><dd>{{ moeda(preview.tarifaKwh || 0) }}/kWh</dd></div>
            </template>
            <div v-if="preview.observacao || preview.descricao" class="detalhe full">
              <dt>Observação</dt>
              <dd>{{ preview.observacao || preview.descricao }}</dd>
            </div>
            <div v-if="preview.possuiNotaFiscal" class="detalhe full">
              <dt>Nota fiscal</dt>
              <dd>{{ preview.notaFiscalNome || 'Anexada' }}</dd>
            </div>
          </dl>

          <footer class="modal-acoes">
            <button v-if="preview.possuiNotaFiscal" class="btn-sec" @click="baixar(preview)"><IconeApp nome="baixar" :tamanho="16" />Baixar NF</button>
            <button class="btn-sec" @click="editar(preview)"><IconeApp nome="editar" :tamanho="16" />Editar</button>
            <button class="btn-danger" @click="pedirExclusao(preview)"><IconeApp nome="excluir" :tamanho="16" />Excluir</button>
          </footer>
        </div>
      </div>
    </transition>

    <!-- Modal de confirmação de exclusão -->
    <transition name="modal">
      <div v-if="aExcluir" class="modal-backdrop" @click.self="cancelarExclusao">
        <div class="modal-card confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-titulo">
          <div class="confirm-icon"><IconeApp nome="excluir" :tamanho="24" /></div>
          <h2 id="confirm-titulo">Excluir {{ rotuloExclusao }}?</h2>
          <p class="confirm-texto">Esta ação não pode ser desfeita.</p>
          <div class="confirm-resumo">
            <span>{{ formatar(aExcluir.data) }}</span>
            <b :class="{ saida: tipo === 'S' || tipo === 'R' }">
              {{ moeda(tipo === 'R' ? aExcluir.custo : aExcluir.valor) }}
            </b>
          </div>
          <div class="modal-acoes">
            <button class="btn-sec" :disabled="excluindo" @click="cancelarExclusao">Cancelar</button>
            <button class="btn-danger" :disabled="excluindo" @click="confirmarExclusao">
              {{ excluindo ? 'Excluindo…' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, onUnmounted, nextTick } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import '@/assets/driver-custom.css'
import IconeApp from '@/components/IconeApp.vue'
import { useRoute, useRouter } from 'vue-router'
import { receitaService } from '@/services/receitaService'
import { despesaService } from '@/services/despesaService'
import { recargaService } from '@/services/recargaService'
import { origemService } from '@/services/origemService'
import { categoriaSaidaService } from '@/services/categoriaSaidaService'
import { dataAtualBrasil, formatarDataBrasileira } from '@/utils/data'

const router = useRouter(),
  route = useRoute(),
  tipoInicial = (route.query.tipo === 'S' || route.query.tipo === 'R') ? route.query.tipo as 'S' | 'R' : 'E',
  tipo = ref<'E' | 'S' | 'R'>(tipoInicial),
  hoje = dataAtualBrasil(),
  inicio = ref(hoje.slice(0, 7) + '-01'),
  fim = ref(hoje),
  itens = ref<any[]>([]),
  origens = ref<any[]>([]),
  categorias = ref<any[]>([]),
  filtroOrigemId = ref(''),
  filtroCategoriaId = ref(''),
  erro = ref(''),
  preview = ref<any | null>(null),
  aExcluir = ref<any | null>(null),
  excluindo = ref(false)

const rotuloTipo = computed(() =>
  tipo.value === 'E' ? 'Entrada' : tipo.value === 'S' ? 'Saída' : 'Recarga'
)
const tagClasse = computed(() => (tipo.value === 'E' ? 'tag-entrada' : 'tag-saida'))
const rotuloExclusao = computed(() =>
  tipo.value === 'E' ? 'esta receita' : tipo.value === 'S' ? 'esta despesa' : 'esta recarga'
)
const rotaNova = computed(() => {
  if (tipo.value === 'E') return { path: '/transacoes/nova', query: { tipo: 'ENTRADA' } }
  if (tipo.value === 'S') return { path: '/transacoes/nova', query: { tipo: 'SAIDA' } }
  return { path: '/transacoes/recarga' }
})

const itensExibidos = computed(() => {
  if (tipo.value === 'E' && filtroOrigemId.value) {
    return itens.value.filter(i => i.origemId === filtroOrigemId.value)
  }
  if (tipo.value === 'S' && filtroCategoriaId.value) {
    return itens.value.filter(i => i.categoriaSaidaId === filtroCategoriaId.value)
  }
  return itens.value
})

function trocarTipo(novo: 'E' | 'S' | 'R') {
  tipo.value = novo
  filtroOrigemId.value = ''
  filtroCategoriaId.value = ''
  router.replace({ path: '/transacoes', query: { tipo: novo } })
  carregar()
}

// Mantém a aba sincronizada caso a URL mude (ex.: voltar do formulário com ?tipo=S)
watch(() => route.query.tipo, (novo) => {
  const t = (novo === 'S' || novo === 'R') ? novo as 'S' | 'R' : 'E'
  if (t !== tipo.value) {
    tipo.value = t
    filtroOrigemId.value = ''
    filtroCategoriaId.value = ''
    carregar()
  }
})

function moeda(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}
function formatar(v: string) {
  return formatarDataBrasileira(v)
}
function formatarDuracao(v: number) {
  const minutos = Math.max(0, Math.round(Number(v ?? 0) * 60))
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`
}
async function carregar() {
  erro.value = ''
  try {
    if (tipo.value === 'R') {
      itens.value = await recargaService.listar(inicio.value, fim.value)
    } else {
      itens.value =
        tipo.value === 'E'
          ? await receitaService.listar(inicio.value, fim.value)
          : await despesaService.listar(inicio.value, fim.value)
    }
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao carregar.'
  }
}

function abrirPreview(item: any) {
  preview.value = item
}
function fecharPreview() {
  preview.value = null
}

function editar(i: any) {
  fecharPreview()
  if (tipo.value === 'R') {
    router.push({ path: `/transacoes/recarga/editar/${i.id}`, query: { dados: JSON.stringify(i) } })
    return
  }
  router.push({
    path: `/transacoes/editar/${i.id}`,
    query: { tipo: tipo.value === 'E' ? 'ENTRADA' : 'SAIDA', dados: JSON.stringify(i) }
  })
}
async function baixar(i: any) {
  try {
    const arquivo =
      tipo.value === 'E'
        ? await receitaService.baixarNotaFiscal(i.id)
        : tipo.value === 'S'
        ? await despesaService.baixarNotaFiscal(i.id)
        : await recargaService.baixarNotaFiscal(i.id)
    const url = URL.createObjectURL(arquivo),
      a = document.createElement('a')
    a.href = url
    a.download = i.notaFiscalNome || `nota_${i.data.replaceAll('-', '')}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao baixar arquivo.'
  }
}
function duplicar(item: any) {
  const copia = {
    ...item,
    id: undefined,
    data: dataAtualBrasil(),
    notaFiscalBase64: null,
    notaFiscalNome: null,
    notaFiscalTipo: null,
    possuiNotaFiscal: false
  }
  router.push({ path: '/transacoes/nova', query: { tipo: 'SAIDA', dados: JSON.stringify(copia) } })
}

function pedirExclusao(item: any) {
  aExcluir.value = item
}
function cancelarExclusao() {
  if (excluindo.value) return
  aExcluir.value = null
}
async function confirmarExclusao() {
  if (!aExcluir.value) return
  excluindo.value = true
  erro.value = ''
  try {
    const id = aExcluir.value.id
    if (tipo.value === 'E') {
      await receitaService.excluir(id)
    } else if (tipo.value === 'S') {
      await despesaService.excluir(id)
    } else {
      await recargaService.excluir(id)
    }
    aExcluir.value = null
    preview.value = null
    await carregar()
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao excluir.'
  } finally {
    excluindo.value = false
  }
}

function aoTeclar(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (aExcluir.value) cancelarExclusao()
    else if (preview.value) fecharPreview()
  }
}

onMounted(async () => {
  try {
    ;[origens.value, categorias.value] = await Promise.all([
      origemService.listar(),
      categoriaSaidaService.listar()
    ])
  } catch {
    // filtros opcionais — lista principal ainda carrega abaixo
  }
  await carregar()
  window.addEventListener('keydown', aoTeclar)
})
onUnmounted(() => window.removeEventListener('keydown', aoTeclar))

const aguardarElemento = async (selector: string) => {
  for (let i = 0; i < 30; i++) {
    const el = document.querySelector(selector)
    if (el) return el
    await new Promise(r => setTimeout(r, 100))
  }
  throw new Error(`Elemento não encontrado: ${selector}`)
}

function iniciarTutorialEntradas() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    closeBtnText: 'Fechar',
    steps: [
      {
        element: '.abas button:nth-child(1)',
        popover: {
          title: 'Aba Entradas',
          description: 'Registra todo o dinheiro que você recebe das plataformas de trabalho (ganho bruto).',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(1) input',
        popover: {
          title: 'Filtro Data Início',
          description: 'Defina a data inicial para filtrar suas transações.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(2) input',
        popover: {
          title: 'Filtro Data Fim',
          description: 'Defina a data final para filtrar suas transações.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(3) select',
        popover: {
          title: 'Filtro de Origem',
          description: 'Filtre por plataforma de trabalho (Uber, 99, etc) para ver quanto ganhou em cada uma.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.lista',
        popover: {
          title: 'Lista de Entradas',
          description: 'Visualize todas as suas receitas organizadas por data. Cada item mostra viagens, KM e horas trabalhadas.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Nova Entrada',
          description: 'Clique aqui para registrar uma nova receita das plataformas de trabalho.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.abas button:nth-child(2)',
        popover: {
          title: 'Aba Saídas',
          description: 'Registra todos os custos do seu trabalho que reduzem seu lucro. Clique em "Próximo" para ver as despesas.',
          side: 'bottom',
          align: 'center',
          onNextClick: async () => {
            driverObj.destroy()
            await router.push({ path: '/transacoes', query: { tipo: 'S' } })
            await router.isReady()
            await nextTick()
            await new Promise(resolve => setTimeout(resolve, 500))
            await aguardarElemento('.filtros .field:nth-child(3) select')
            iniciarTutorialSaidas()
          }
        }
      }
    ]
  })
  driverObj.drive()
}

function iniciarTutorialSaidas() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    closeBtnText: 'Fechar',
    steps: [
      {
        element: '.filtros .field:nth-child(3) select',
        popover: {
          title: 'Filtro de Categoria',
          description: 'Filtre por tipo de despesa (manutenção, lavagem, etc) para analisar gastos por categoria.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.lista',
        popover: {
          title: 'Lista de Saídas',
          description: 'Visualize todas as suas despesas organizadas por data. Cada item mostra o tipo de gasto.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Nova Saída',
          description: 'Clique aqui para registrar uma nova despesa do seu trabalho.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.abas button:nth-child(3)',
        popover: {
          title: 'Aba Recargas',
          description: 'Registra o abastecimento de energia do seu veículo elétrico. Clique em "Próximo" para ver as recargas.',
          side: 'bottom',
          align: 'center',
          onNextClick: async () => {
            driverObj.destroy()
            await router.push({ path: '/transacoes', query: { tipo: 'R' } })
            await router.isReady()
            await nextTick()
            await new Promise(resolve => setTimeout(resolve, 500))
            await aguardarElemento('.lista')
            iniciarTutorialRecargas()
          }
        }
      }
    ]
  })
  driverObj.drive()
}

function iniciarTutorialRecargas() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    closeBtnText: 'Fechar',
    steps: [
      {
        element: '.lista',
        popover: {
          title: 'Lista de Recargas',
          description: 'Visualize todas as suas recargas de energia. Cada item mostra kWh consumidos e tarifa.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Nova Recarga',
          description: 'Clique aqui para registrar uma nova recarga de energia do veículo elétrico.',
          side: 'left',
          align: 'center'
        }
      }
    ]
  })
  driverObj.drive()
}

function iniciarTutorialTransacoes() {
  if (tipo.value !== 'E') {
    router.push({ path: '/transacoes', query: { tipo: 'E' } })
  }
  iniciarTutorialEntradas()
}
</script>

<style scoped>
.tela {
  position: relative; min-height: 100vh;
  background:
    radial-gradient(120% 60% at 0% 0%, #0f1a24 0%, transparent 55%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
  color: var(--text);
  overflow-x: hidden;
  padding-bottom: 6rem;
}
:root[data-tema="claro"] .tela {
  background:
    radial-gradient(120% 60% at 0% 0%, #eaf2ff 0%, transparent 55%),
    linear-gradient(160deg, #f5f7fc 0%, #eef1f8 100%);
}

.ambient { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.glow-1 { width: 360px; height: 360px; background: #d4ff3a; opacity: .09; top: -140px; left: -120px; }
.glow-2 { width: 300px; height: 300px; background: #7cf5c4; opacity: .07; bottom: -140px; right: -100px; }

.topbar {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between; gap: .75rem;
  padding: 1rem 1.1rem;
  background: color-mix(in oklab, var(--bg) 75%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.topbar-botoes{display:flex;align-items:center;gap:.5rem}
.botao-tutorial{display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border:1px solid var(--accent);border-radius:8px;background:rgba(212,255,58,.08);color:var(--text);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s ease}
.botao-tutorial:hover{background:rgba(212,255,58,.15);transform:scale(1.05)}
.botao-tutorial:active{transform:scale(.95)}
.botao-tutorial svg{width:14px;height:14px;fill:var(--accent)}
.head-txt { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.eyebrow {
  display: inline-flex; align-items: center; gap: .4rem;
  font-size: .68rem; color: var(--accent); font-weight: 600;
  letter-spacing: .06em; text-transform: uppercase;
}
.dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
h1 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -.02em; color: var(--text); }

.fab {
  position: fixed;
  right: 1.15rem;
  bottom: calc(4.7rem + env(safe-area-inset-bottom, 0));
  z-index: 20;
  width: 56px; height: 56px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--accent) 0%, #b8e628 100%);
  color: #07090f; text-decoration: none;
  box-shadow: 0 14px 34px -10px rgba(212,255,58,.6), inset 0 1px 0 rgba(255,255,255,.4);
  transition: transform .15s ease, box-shadow .2s ease;
}
.fab:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 20px 42px -10px rgba(212,255,58,.75), inset 0 1px 0 rgba(255,255,255,.45);
}
.fab:active { transform: scale(.96); }
.fab:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(212,255,58,.35), 0 14px 34px -10px rgba(212,255,58,.6); }
.fab svg { width: 26px; height: 26px; }
@media (min-width: 720px) {
  .fab { right: calc(50% - 360px + 1.15rem); }
}

.conteudo {
  position: relative; z-index: 1;
  padding: 1.1rem;
  max-width: 720px; margin: 0 auto;
  display: flex; flex-direction: column; gap: .9rem;
}

.abas {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: .4rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: .3rem;
}
.abas button {
  border: 0; background: transparent; color: var(--text-dim);
  padding: .65rem .5rem; border-radius: calc(var(--radius) - 1px);
  font-weight: 600; font-size: .82rem; cursor: pointer;
  font-family: inherit; transition: all .2s;
}
.abas button:hover { color: var(--text); }
.abas .ativa {
  background: rgba(212,255,58,.1); color: var(--accent);
  border: 1px solid rgba(212,255,58,.25);
}

.filtros { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.filtros.com-extra { grid-template-columns: 1fr 1fr 1fr; }
@media (max-width: 560px) {
  .filtros, .filtros.com-extra { grid-template-columns: 1fr; }
}
.field { display: flex; flex-direction: column; gap: .3rem; }
.field span {
  font-size: .68rem; color: var(--text-mute);
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
}
input[type="date"], select {
  width: 100%; padding: .75rem .85rem;
  background: var(--input-bg); border: 1px solid var(--border);
  border-radius: var(--radius); color: var(--text);
  font-size: .9rem; font-family: inherit;
  box-sizing: border-box; color-scheme: dark; transition: all .2s;
}
:root[data-tema="claro"] input[type="date"] { color-scheme: light; }
input[type="date"]:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px rgba(212,255,58,.12); }

.lista { display: flex; flex-direction: column; gap: .55rem; }

.item {
  display: grid; grid-template-columns: minmax(0,1fr) auto; gap: .75rem;
  align-items: center;
  padding: .95rem 1rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color .2s ease, transform .1s ease;
  cursor: pointer;
}
.item:hover { border-color: var(--border-strong); }
.item:active { transform: scale(.995); }
.item:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(212,255,58,.15); }
.item-body { min-width: 0; display: flex; flex-direction: column; gap: .2rem; }
.item-body strong {
  font-size: .9rem; color: var(--text); font-weight: 700;
  letter-spacing: -.01em;
}
.meta {
  margin: 0; font-size: .76rem; color: var(--text-dim);
}
.obs { margin: 0; font-size: .74rem; color: var(--text-mute); font-style: italic; }

.item-tail { display: flex; flex-direction: column; align-items: flex-end; gap: .35rem; }
.valor {
  font-size: .95rem; font-weight: 700; letter-spacing: -.01em;
  color: var(--accent);
}
.valor.saida { color: var(--danger); }
.acoes { display: flex; gap: .3rem; }
.ic-btn {
  width: 30px; height: 30px; border-radius: var(--radius);
  background: rgba(212,255,58,.08);
  border: 1px solid rgba(212,255,58,.2);
  color: var(--accent); cursor: pointer; font-size: .85rem;
  display: grid; place-items: center; transition: all .2s;
}
.ic-btn:hover { background: rgba(212,255,58,.16); }
.ic-btn.danger {
  background: rgba(255,107,122,.08);
  border-color: rgba(255,107,122,.25);
  color: var(--danger);
}
.ic-btn.danger:hover { background: rgba(255,107,122,.16); }

.vazio {
  display: flex; flex-direction: column; align-items: center; gap: .6rem;
  padding: 2rem 1rem;
  border: 1px dashed var(--border); border-radius: var(--radius);
  color: var(--text-mute);
}
.vazio-icon { font-size: 1.8rem; opacity: .6; }
.vazio p { margin: 0; font-size: .88rem; }

.mensagem {
  margin: 0; padding: .75rem .9rem;
  border-radius: var(--radius); font-size: .85rem;
  text-align: center;
}
.mensagem.erro {
  color: var(--danger);
  background: rgba(255,107,122,.08);
  border: 1px solid rgba(255,107,122,.25);
}

.menu-inferior {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-around;
  padding: .5rem .5rem calc(.5rem + env(safe-area-inset-bottom, 0));
  background: color-mix(in oklab, var(--bg) 75%, transparent);
  border-top: 1px solid var(--border);
  backdrop-filter: blur(14px); z-index: 10;
}
.menu-inferior a {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: .2rem;
  padding: .5rem; text-decoration: none; color: var(--text-mute);
  font-size: .72rem; font-weight: 600; border-radius: var(--radius);
  transition: all .2s;
}
.menu-inferior a :deep(.icone-app) { width: 20px; height: 20px; }
.menu-inferior .ativo { color: var(--accent); }

/* ---------- Modais ---------- */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 50;
  display: flex; align-items: flex-end; justify-content: center;
  padding: 1rem;
  background: rgba(3, 6, 12, .6);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
}
@media (min-width: 560px) { .modal-backdrop { align-items: center; } }

.modal-card {
  width: 100%; max-width: 460px;
  background: var(--surface);
  border: 1px solid var(--border-strong, var(--border));
  border-radius: calc(var(--radius) + 6px);
  padding: 1.25rem;
  box-shadow: 0 24px 60px -20px rgba(0,0,0,.65);
  display: flex; flex-direction: column; gap: 1rem;
}

.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .75rem; }
.modal-head-txt { display: flex; flex-direction: column; gap: .4rem; min-width: 0; }
.modal-head h2 { margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text); letter-spacing: -.01em; }
.modal-tag {
  align-self: flex-start;
  font-size: .66rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: .2rem .55rem; border-radius: 999px;
}
.tag-entrada { background: rgba(212,255,58,.12); color: var(--accent); border: 1px solid rgba(212,255,58,.3); }
.tag-saida { background: rgba(255,107,122,.1); color: var(--danger); border: 1px solid rgba(255,107,122,.3); }
.modal-close {
  flex-shrink: 0;
  width: 32px; height: 32px; border-radius: var(--radius);
  background: transparent; border: 1px solid var(--border);
  color: var(--text-dim); cursor: pointer; font-size: .9rem;
  display: grid; place-items: center; transition: all .2s;
}
.modal-close:hover { color: var(--text); border-color: var(--border-strong, var(--border)); }

.modal-valor {
  font-size: 1.9rem; font-weight: 800; letter-spacing: -.02em;
  color: var(--accent);
}
.modal-valor.saida { color: var(--danger); }

.detalhes {
  margin: 0;
  display: grid; grid-template-columns: 1fr 1fr; gap: .7rem;
}
.detalhe { display: flex; flex-direction: column; gap: .2rem; min-width: 0; }
.detalhe.full { grid-column: 1 / -1; }
.detalhe dt {
  font-size: .66rem; color: var(--text-mute);
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
}
.detalhe dd { margin: 0; font-size: .88rem; color: var(--text); font-weight: 600; word-break: break-word; }

.modal-acoes { display: flex; gap: .5rem; flex-wrap: wrap; }
.modal-acoes > * { flex: 1; min-width: 110px; }
.btn-sec, .btn-danger {
  padding: .7rem .9rem; border-radius: var(--radius);
  font-weight: 700; font-size: .85rem; cursor: pointer;
  font-family: inherit; transition: all .2s;
}
.btn-sec, .btn-danger { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; }
.btn-sec {
  background: rgba(212,255,58,.08);
  border: 1px solid rgba(212,255,58,.22);
  color: var(--accent);
}
.btn-sec:hover:not(:disabled) { background: rgba(212,255,58,.16); }
.btn-danger {
  background: linear-gradient(180deg, var(--danger) 0%, #e05464 100%);
  border: 1px solid rgba(255,107,122,.4);
  color: #1a0508;
}
.btn-danger:hover:not(:disabled) { filter: brightness(1.08); }
.btn-sec:disabled, .btn-danger:disabled { opacity: .55; cursor: not-allowed; }

/* Confirmação */
.modal-card.confirm { max-width: 400px; align-items: center; text-align: center; }
.confirm-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: grid; place-items: center; font-size: 1.5rem;
  background: rgba(255,107,122,.1);
  border: 1px solid rgba(255,107,122,.3);
}
.modal-card.confirm h2 { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--text); }
.confirm-texto { margin: 0; font-size: .85rem; color: var(--text-mute); }
.confirm-resumo {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: .7rem .9rem; border-radius: var(--radius);
  background: var(--input-bg, rgba(255,255,255,.03));
  border: 1px solid var(--border);
  font-size: .85rem; color: var(--text-dim);
}
.confirm-resumo b { color: var(--accent); }
.confirm-resumo b.saida { color: var(--danger); }
.modal-card.confirm .modal-acoes { width: 100%; }

/* Transições */
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-card, .modal-leave-active .modal-card { transition: transform .22s cubic-bezier(.16,1,.3,1); }
.modal-enter-from .modal-card { transform: translateY(16px) scale(.98); }
.modal-leave-to .modal-card { transform: translateY(16px) scale(.98); }

@media (min-width: 700px) {
  .menu-inferior {
    left: 50%; transform: translateX(-50%);
    max-width: 520px; bottom: 16px;
    border-radius: var(--radius); border: 1px solid var(--border);
  }
}
</style>
