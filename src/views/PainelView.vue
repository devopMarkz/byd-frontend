<template>
  <div class="tela">
    <div class="ambient glow-1" />
    <div class="ambient glow-2" />

    <header class="topbar">
      <div class="head-txt">
        <span class="eyebrow"><span class="dot" /> BYD Dolphin</span>
        <h1>Seu painel</h1>
      </div>
      <div class="topbar-botoes">
        <button class="botao-tutorial" aria-label="Iniciar tutorial" @click="iniciarTutorialPainel">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Tutorial
        </button>
        <button class="icone-botao" aria-label="Sair" @click="auth.logout"><IconeApp nome="sair" /></button>
      </div>
    </header>

    <main class="conteudo">
      <section class="periodo">
        <div class="abas">
          <button v-for="opcao in opcoesPeriodo" :key="opcao.valor" :class="{ ativa: periodo === opcao.valor }" @click="selecionarPeriodo(opcao.valor)">
            {{ opcao.rotulo }}
          </button>
        </div>
        <div v-if="periodo === 'PERSONALIZADO'" class="datas">
          <label>De<input v-model="inicio" type="date" @change="carregar" /></label>
          <label>Até<input v-model="fim" type="date" @change="carregar" /></label>
        </div>
        <input v-else-if="periodo === 'MENSAL'" v-model="mes" class="campo-data" type="month" @change="carregar" />
        <input v-else-if="periodo === 'ANUAL'" v-model="ano" class="campo-data" type="number" min="2020" max="2100" @change="carregar" />
        <input v-else v-model="referencia" class="campo-data" type="date" @change="carregar" />
      </section>

      <div v-if="carregando" class="estado">Carregando painel...</div>
      <div v-else-if="erro" class="estado erro">{{ erro }}</div>

      <template v-else-if="painel">
        <section class="resumo">
          <article class="cartao receita"><span>Receita</span><strong>{{ moeda(painel.receita) }}</strong></article>
          <article class="cartao despesa"><span>Despesas</span><strong>{{ moeda(painel.despesas) }}</strong></article>
          <article class="cartao saldo"><span>Saldo</span><strong>{{ moeda(painel.saldo) }}</strong></article>
        </section>

        <section class="secao">
          <div class="titulo-secao"><h2>Estatísticas</h2><span>{{ intervalo }}</span></div>
          <div class="estatisticas">
            <div><span>Viagens</span><strong>{{ painel.estatisticas.totalViagens }}</strong></div>
            <div><span>Horas</span><strong>{{ formatarDuracao(painel.estatisticas.horasTrabalhadas) }}</strong></div>
            <div><span>KM</span><strong>{{ numero(painel.estatisticas.quilometrosRodados) }}</strong></div>
            <div><span>R$/viagem</span><strong>{{ moeda(painel.estatisticas.receitaPorViagem) }}</strong></div>
            <div><span>R$/hora</span><strong>{{ moeda(painel.estatisticas.receitaPorHora) }}</strong></div>
            <div><span>R$/KM</span><strong>{{ moeda(painel.estatisticas.receitaPorKm) }}</strong></div>
            <div><span>Lucro/viagem</span><strong>{{ moeda(painel.estatisticas.lucroPorViagem) }}</strong></div>
            <div><span>Lucro/hora</span><strong>{{ moeda(painel.estatisticas.lucroPorHora) }}</strong></div>
            <div><span>Lucro/KM</span><strong>{{ moeda(painel.estatisticas.lucroPorKm) }}</strong></div>
          </div>
        </section>

        <section class="secao">
          <div class="titulo-secao"><h2>Receita por origem</h2><span>{{ moeda(painel.receita) }}</span></div>
          <div v-if="painel.receitasPorOrigem.length" class="origens" id="receitas-por-origem">
            <article v-for="origem in painel.receitasPorOrigem" :key="origem.id" class="origem">
              <div class="origem-cabecalho">
                <img v-if="origem.imagemBase64" :src="origem.imagemBase64" :alt="origem.nome" />
                <span v-else class="avatar">{{ origem.nome.charAt(0) }}</span>
                <strong>{{ origem.nome }}</strong>
                <b>{{ moeda(origem.receita) }}</b>
              </div>
              <div class="barra"><span :style="{ width: `${origem.percentualDaMaior}%` }" /></div>
            </article>
          </div>
          <p v-else class="vazio">Nenhuma receita no período.</p>
        </section>

        <section class="secao">
          <div class="titulo-secao"><h2>Última jornada</h2></div>
          <div v-if="painel.ultimaJornada" class="jornada-resumo" id="ultima-jornada">
            <div><span>Início</span><strong>{{ formatarData(painel.ultimaJornada.data) }} · {{ horario(painel.ultimaJornada.inicio) }}</strong></div>
            <div><span>Fim</span><strong>{{ painel.ultimaJornada.fim ? horario(painel.ultimaJornada.fim) : 'Em andamento' }}</strong></div>
            <div><span>Horas</span><strong>{{ formatarDuracao(painel.ultimaJornada.horasTrabalhadas) }}</strong></div>
            <div><span>KM</span><strong>{{ numero(painel.ultimaJornada.quilometrosPercorridos) }}</strong></div>
          </div>
          <p v-else class="vazio">Você ainda não registrou jornadas.</p>
        </section>
      </template>
    </main>

    <router-link to="/jornada" class="fab">
      <IconeApp nome="carro" :tamanho="18" />{{ jornadaAberta ? 'Finalizar jornada' : 'Iniciar jornada' }}
    </router-link>

    <nav class="menu-inferior">
      <router-link to="/" class="ativo"><IconeApp nome="painel" />Painel</router-link>
      <router-link to="/transacoes"><IconeApp nome="transacoes" />Transações</router-link>
      <router-link to="/configuracoes"><IconeApp nome="configuracoes" />Configurações</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import IconeApp from '@/components/IconeApp.vue'
import { useAuthStore } from '@/stores/auth'
import { dashboardService } from '@/services/dashboardService'
import { jornadaService } from '@/services/jornadaService'
import { dataAtualBrasil, formatarDataBrasileira } from '@/utils/data'
import type { DashboardPeriodoResponse } from '@/types'

type Periodo = 'DIARIO' | 'SEMANAL' | 'MENSAL' | 'ANUAL' | 'PERSONALIZADO'

const auth = useAuthStore()
const opcoesPeriodo: { valor: Periodo; rotulo: string }[] = [
  { valor: 'DIARIO', rotulo: 'Diário' }, { valor: 'SEMANAL', rotulo: 'Semanal' }, { valor: 'MENSAL', rotulo: 'Mensal' }, { valor: 'ANUAL', rotulo: 'Anual' }, { valor: 'PERSONALIZADO', rotulo: 'Personalizado' }
]
const PERIODOS_VALIDOS: Periodo[] = ['DIARIO', 'SEMANAL', 'MENSAL', 'ANUAL', 'PERSONALIZADO']
const STORAGE_KEY = 'painel-periodo'

const hoje = dataAtualBrasil()

function obterPeriodoSalvo(): Periodo {
  const salvo = localStorage.getItem(STORAGE_KEY)

  return salvo && PERIODOS_VALIDOS.includes(salvo as Periodo)
    ? salvo as Periodo
    : 'DIARIO'
}

const periodo = ref<Periodo>(obterPeriodoSalvo())
const referencia = ref(hoje)
const inicio = ref(hoje)
const fim = ref(hoje)
const mes = ref(hoje.slice(0, 7))
const ano = ref(hoje.slice(0, 4))
const painel = ref<DashboardPeriodoResponse | null>(null)
const carregando = ref(true), erro = ref(''), jornadaAberta = ref(false)

const intervalo = computed(() => painel.value ? `${formatarData(painel.value.inicio)} a ${formatarData(painel.value.fim)}` : '')
function moeda(v: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0) }
function numero(v: number) { return Number(v ?? 0).toFixed(2) }
function formatarDuracao(v: number) { const minutos = Math.max(0, Math.round(Number(v ?? 0) * 60)); return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}` }
function formatarData(d: string) { return formatarDataBrasileira(d) }
function horario(v: string) { return v?.slice(0, 5) }
function selecionarPeriodo(v: Periodo) {
  periodo.value = v
  localStorage.setItem(STORAGE_KEY, v)
  carregar()
}
async function carregar() {
  carregando.value = true; erro.value = ''
  try {
    const ref = periodo.value === 'MENSAL' ? `${mes.value}-01` : periodo.value === 'ANUAL' ? `${ano.value}-01-01` : referencia.value
    painel.value = await dashboardService.obterPorPeriodo(periodo.value, ref, inicio.value, fim.value)
  } catch (e: any) { erro.value = e.userMessage || 'Não foi possível carregar o painel.' }
  finally { carregando.value = false }
}
function iniciarTutorialPainel() {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: 'nav.menu-inferior a[href="/"]',
        popover: {
          title: 'Menu - Painel',
          description: 'Aqui você vê o resumo financeiro, estatísticas detalhadas e o controle de jornada.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: 'nav.menu-inferior a[href="/transacoes"]',
        popover: {
          title: 'Menu - Transações',
          description: 'Aqui você registra entradas (receitas), saídas (despesas) e recargas de energia.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: 'nav.menu-inferior a[href="/configuracoes"]',
        popover: {
          title: 'Menu - Configurações',
          description: 'Aqui você cadastra categorias de gastos, plataformas onde trabalha (origens), formas de pagamento, verifica histórico de jornadas e configura suas preferências do sistema.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.periodo .abas button',
        popover: {
          title: 'Seleção de Período',
          description: 'Escolha entre Diário, Semanal, Mensal, Anual ou Personalizado para analisar seus dados em diferentes escalas de tempo.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(1)',
        popover: {
          title: 'Receita (Ganho Bruto)',
          description: 'Este é o valor total que você recebeu das plataformas antes de descontar qualquer despesa.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(2)',
        popover: {
          title: 'Despesas',
          description: 'Este é o valor total de todos os seus custos (energia, manutenção, lavagem, etc).',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(3)',
        popover: {
          title: 'Saldo (Ganho Líquido)',
          description: 'Este é o valor que realmente sobrou no seu bolso: Receita - Despesas.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(1)',
        popover: {
          title: 'Viagens',
          description: 'Número total de corridas realizadas no período. Conta todas as viagens registradas nas entradas.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(2)',
        popover: {
          title: 'Horas Trabalhadas',
          description: 'Tempo total trabalhado no período, calculado somando as horas de todas as jornadas.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(3)',
        popover: {
          title: 'Quilômetros Rodados',
          description: 'Distância total percorrida em quilômetros. Importante para calcular custo por KM e desgaste do veículo.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(4)',
        popover: {
          title: 'R$/viagem (Ganho Bruto)',
          description: 'Quanto você ganha em média por cada corrida antes de descontar despesas. Calculado: Receita total ÷ Número de viagens.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(5)',
        popover: {
          title: 'R$/hora (Ganho Bruto)',
          description: 'Quanto você ganha em média por cada hora trabalhada antes de descontar despesas. Calculado: Receita total ÷ Horas trabalhadas.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(6)',
        popover: {
          title: 'R$/KM (Ganho Bruto)',
          description: 'Quanto você ganha em média por quilômetro rodado antes de descontar despesas. Calculado: Receita total ÷ Quilômetros rodados.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(7)',
        popover: {
          title: 'Lucro/viagem (Ganho Líquido)',
          description: 'Quanto realmente sobra no bolso por cada corrida após descontar despesas. Calculado: (Receita - Despesas) ÷ Número de viagens.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(8)',
        popover: {
          title: 'Lucro/hora (Ganho Líquido)',
          description: 'Quanto realmente sobra no bolso por cada hora trabalhada após descontar despesas. Calculado: (Receita - Despesas) ÷ Horas trabalhadas.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.estatisticas div:nth-child(9)',
        popover: {
          title: 'Lucro/KM (Ganho Líquido)',
          description: 'Quanto realmente sobra no bolso por quilômetro rodado após descontar despesas. Calculado: (Receita - Despesas) ÷ Quilômetros rodados.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#receitas-por-origem',
        popover: {
          title: 'Receita por Origem',
          description: 'Veja quanto ganhou em cada plataforma (Uber, 99, etc) e identifique qual é mais rentável.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '#ultima-jornada',
        popover: {
          title: 'Última Jornada',
          description: 'Acompanhe rapidamente sua última atividade e veja se há uma jornada em andamento.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Controle de Jornada',
          description: 'Use este botão para iniciar ou encerrar seu turno de trabalho rapidamente.',
          side: 'left',
          align: 'center'
        }
      }
    ]
  })

  driverObj.drive()
}

onMounted(async () => { await Promise.all([carregar(), jornadaService.listar().then(lista => { jornadaAberta.value = lista.some(j => j.status === 'EM_ANDAMENTO') })]) })
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);padding-bottom:9rem;overflow-x:hidden}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:400px;height:400px;background:#d4ff3a;opacity:.09;top:-160px;left:-120px}
.glow-2{width:340px;height:340px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}
.topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.head-txt{display:flex;flex-direction:column;gap:.15rem;min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.4rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}
.topbar-botoes{display:flex;align-items:center;gap:.5rem}
.botao-tutorial{display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border:4px solid var(--accent);border-radius:8px;background:transparent;color:var(--text);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s ease}
.botao-tutorial:hover{background:rgba(212,255,58,.1);transform:scale(1.05)}
.botao-tutorial:active{transform:scale(.95)}
.botao-tutorial svg{width:14px;height:14px;fill:var(--accent)}
.icone-botao{width:40px;height:40px;display:grid;place-items:center;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);cursor:pointer;font-size:1.15rem;flex-shrink:0}
.icone-botao:hover{border-color:var(--accent);color:var(--accent)}
.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}
.periodo{padding:.85rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.abas{display:flex;gap:.35rem;overflow-x:auto;scrollbar-width:none}
.abas::-webkit-scrollbar{display:none}
.abas button{border:0;background:transparent;color:var(--text-dim);border-radius:var(--radius);padding:.6rem .9rem;font-weight:600;font-size:.82rem;white-space:nowrap;cursor:pointer;font-family:inherit;transition:all .2s}
.abas button:hover{color:var(--text)}
.abas .ativa{background:rgba(212,255,58,.1);color:var(--accent);box-shadow:inset 0 0 0 1px rgba(212,255,58,.25)}
.datas{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.6rem}
.datas label{display:flex;flex-direction:column;gap:.3rem;font-size:.72rem;color:var(--text-mute);font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.datas input,.campo-data{width:100%;margin-top:.6rem;padding:.75rem .9rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font:inherit;box-sizing:border-box;appearance:none}
.datas input{margin-top:0}
.datas input:focus,.campo-data:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgba(212,255,58,.12)}
.estado{text-align:center;color:var(--text-mute);padding:2rem}
.estado.erro{color:var(--danger)}
.resumo{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem}
.cartao{padding:1rem .85rem;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);display:flex;flex-direction:column;gap:.35rem}
.cartao span{font-size:.68rem;color:var(--text-mute);font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.cartao strong{font-size:.98rem;letter-spacing:-.01em}
.cartao.receita{background:linear-gradient(160deg,rgba(124,245,196,.08),transparent);border-color:rgba(124,245,196,.25)}
.cartao.receita strong{color:var(--accent-2)}
.cartao.despesa{background:linear-gradient(160deg,rgba(255,107,122,.08),transparent);border-color:rgba(255,107,122,.25)}
.cartao.despesa strong{color:var(--danger)}
.cartao.saldo{background:linear-gradient(160deg,rgba(212,255,58,.08),transparent);border-color:rgba(212,255,58,.28)}
.cartao.saldo strong{color:var(--accent)}
.secao{padding:1.15rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.titulo-secao{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.titulo-secao h2{margin:0;font-size:.98rem;font-weight:700;color:var(--text)}
.titulo-secao span{font-size:.7rem;color:var(--text-mute)}
.estatisticas{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-top:.85rem}
.estatisticas div{padding:.75rem .55rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);display:flex;flex-direction:column;gap:.25rem}
.estatisticas span{font-size:.62rem;color:var(--text-mute);font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.estatisticas strong{font-size:.82rem;color:var(--text)}
.origens{margin-top:.85rem;display:flex;flex-direction:column;gap:.85rem}
.origem-cabecalho{display:flex;align-items:center;gap:.6rem}
.origem img,.avatar{width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0}
.avatar{background:rgba(212,255,58,.1);color:var(--accent);display:grid;place-items:center;font-weight:800;font-size:.85rem;border:1px solid rgba(212,255,58,.25)}
.origem-cabecalho strong{flex:1;font-size:.9rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.origem-cabecalho b{font-size:.85rem;color:var(--accent);font-weight:700}
.barra{height:6px;background:rgba(255,255,255,.04);border-radius:99px;overflow:hidden;margin-top:.5rem}
.barra span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--accent),var(--accent-2));box-shadow:0 0 12px rgba(212,255,58,.5)}
.jornada-resumo{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;margin-top:.85rem}
.jornada-resumo div{display:flex;flex-direction:column;gap:.25rem}
.jornada-resumo span{font-size:.68rem;color:var(--text-mute);font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.jornada-resumo strong{font-size:.85rem;color:var(--text)}
.vazio{text-align:center;color:var(--text-mute);padding:1rem;font-size:.85rem;margin:0}
.fab{position:fixed;right:1rem;bottom:5.5rem;display:flex;align-items:center;gap:.5rem;padding:.85rem 1.15rem;border-radius:var(--radius);background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-weight:700;font-size:.9rem;text-decoration:none;box-shadow:0 14px 40px -10px rgba(212,255,58,.6),inset 0 1px 0 rgba(255,255,255,.35);z-index:11;transition:transform .15s}
.fab:hover{transform:translateY(-2px)}
.menu-inferior{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;padding:.5rem .5rem calc(.5rem + env(safe-area-inset-bottom,0));background:color-mix(in oklab,var(--bg) 75%,transparent);border-top:1px solid var(--border);backdrop-filter:blur(14px);z-index:10}
.menu-inferior a{flex:1;display:flex;flex-direction:column;align-items:center;gap:.2rem;padding:.5rem;text-decoration:none;color:var(--text-mute);font-size:.72rem;font-weight:600;border-radius:var(--radius)}
.menu-inferior a :deep(.icone-app){width:20px;height:20px}
.menu-inferior .ativo{color:var(--accent)}
@media(min-width:700px){
  .estatisticas{grid-template-columns:repeat(5,1fr)}
  .menu-inferior{left:50%;transform:translateX(-50%);max-width:520px;bottom:16px;border-radius:var(--radius);border:1px solid var(--border)}
  .fab{right:max(1rem,calc(50% - 260px));bottom:5.5rem}
}
</style>
