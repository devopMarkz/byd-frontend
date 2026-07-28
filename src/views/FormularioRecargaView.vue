<template>
  <div class="tela">
    <div class="ambient glow-1" />
    <div class="ambient glow-2" />

    <header class="topbar">
      <button class="voltar" @click="router.back()" aria-label="Voltar">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="head-txt">
        <span class="eyebrow"><span class="dot" /> Energia</span>
        <h1>{{ modoEdicao ? 'Editar recarga' : 'Nova recarga' }}</h1>
      </div>
      <div class="topbar-botoes">
        <button class="botao-tutorial" aria-label="Iniciar tutorial" @click="iniciarTutorial">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Tutorial
        </button>
      </div>
    </header>

    <main class="conteudo">
      <form class="formulario" @submit.prevent="salvar">
        <div class="row">
          <div class="field"><label>Data</label><input v-model="data" type="date" required /></div>
          <div class="field"><label>Dia da semana</label><input :value="diaSemana" disabled /></div>
        </div>

        <div class="secao">
          <span class="secao-titulo">Cálculo automático</span>
          <div class="row-3">
            <div class="field">
              <label>Potência (kW)</label>
              <input v-model.number="potenciaKw" type="number" min="0.1" step="0.1" placeholder="Ex: 7.4" @input="calcularAutomatico" />
            </div>
            <div class="field">
              <label>Horas carregando</label>
              <input v-model.number="horas" type="number" min="0.1" step="0.1" placeholder="Ex: 4" @input="calcularAutomatico" />
            </div>
            <div class="field">
              <label>
                Tarifa (R$/kWh)
              </label>
              <input v-model.number="tarifa" type="number" min="0.01" step="0.001" placeholder="Ex: 0.95" @input="onTarifaManual" />
            </div>
          </div>
          <p class="dica">
            A tarifa é preenchida automaticamente com o valor salvo em Personalizações, mas você pode editá-la.
            Preencha os 3 campos acima para calcular automaticamente, ou edite manualmente os campos abaixo.
          </p>
        </div>

        <div class="row">
          <div class="field">
            <label>Valor (R$)</label>
            <input id="valor" v-model.number="valor" type="number" min="0.01" step="0.01" required @input="onValorManual" />
          </div>
          <div class="field">
            <label>kWh consumidos</label>
            <input id="kwh-consumidos" v-model.number="kwh" type="number" min="0.01" step="0.001" required @input="onKwhManual" />
          </div>
        </div>
        <div class="field">
          <label>Local</label>
          <select id="local" v-model="local"><option>Casa</option><option>Rua</option><option>Shopping</option><option>Trabalho</option><option>Outro</option></select>
        </div>
        <div class="field"><label>Observação</label><textarea id="observacao" v-model="observacao" rows="3" /></div>
        <p v-if="erro" class="mensagem erro">{{ erro }}</p>
        <button class="salvar" :disabled="salvando">{{ salvando ? 'Salvando...' : (modoEdicao ? 'Atualizar recarga' : 'Salvar recarga') }}</button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { driver } from 'driver.js'
import type { Side, Alignment } from 'driver.js'
import 'driver.js/dist/driver.css'
import '@/assets/driver-custom.css'
import { useRoute, useRouter } from 'vue-router'
import { recargaService } from '@/services/recargaService'
import { configuracaoService } from '@/services/configuracaoService'
import { dataAtualBrasil } from '@/utils/data'
const router = useRouter(), route = useRoute(), data = ref(dataAtualBrasil()), valor = ref<number>(), kwh = ref<number>(), local = ref('Casa'), observacao = ref(''), erro = ref(''), salvando = ref(false)
const potenciaKw = ref<number>(), horas = ref<number>(), tarifa = ref<number>()
const tarifaPreenchida = ref(false)
const recargaId = ref<string | null>((route.params.id as string) || null)
const modoEdicao = computed(() => !!recargaId.value)
const diaSemana = computed(() => new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date(`${data.value}T12:00:00`)))

const arred = (n: number, casas = 3) => Math.round(n * 10 ** casas) / 10 ** casas

// Aceita número puro ou objeto { tarifaEnergiaKwh } vindo da API.
function extrairTarifa(resp: any): number | undefined {
  if (resp == null) return undefined
  if (typeof resp === 'number') return resp
  const v = resp.tarifaEnergiaKwh ?? resp.tarifa ?? resp.valor
  return v != null ? Number(v) : undefined
}

// Pré-preenche os campos quando estiver editando uma recarga existente.
function preencherComDados(d: any) {
  if (!d) return
  if (d.data) data.value = d.data
  if (d.custo != null) valor.value = Number(d.custo)
  else if (d.valor != null) valor.value = Number(d.valor)
  if (d.kwhConsumidos != null) kwh.value = Number(d.kwhConsumidos)
  if (d.tarifaKwh != null) { tarifa.value = Number(d.tarifaKwh); tarifaPreenchida.value = false }
  if (d.localRecarga) local.value = d.localRecarga
  if (d.observacao) observacao.value = d.observacao
  // Reconstrói a potência estimada a partir dos dados salvos, se possível.
  if (kwh.value && tarifa.value && !valor.value) valor.value = arred(kwh.value * tarifa.value, 2)
}

onMounted(async () => {
  // Modo edição: usa os dados passados via query e evita sobrescrever a tarifa salva.
  if (modoEdicao.value) {
    const raw = route.query.dados
    if (typeof raw === 'string') {
      try { preencherComDados(JSON.parse(raw)) } catch { /* ignora json inválido */ }
    }
    return
  }
  // Nova recarga: preenche a tarifa automaticamente com o valor salvo em Personalizações.
  try {
    const t = extrairTarifa(await configuracaoService.obterTarifaEnergia())
    if (t != null && !Number.isNaN(t)) {
      tarifa.value = t
      tarifaPreenchida.value = true
    }
  } catch {
    // silencioso: usuário informa a tarifa manualmente
  }
})

function calcularAutomatico() {
  if (potenciaKw.value && horas.value) kwh.value = arred(potenciaKw.value * horas.value, 3)
  if (kwh.value && tarifa.value) valor.value = arred(kwh.value * tarifa.value, 2)
}
function onTarifaManual() {
  tarifaPreenchida.value = false
  calcularAutomatico()
}
function onKwhManual() {
  if (kwh.value && potenciaKw.value) horas.value = arred(kwh.value / potenciaKw.value, 2)
  else if (kwh.value && horas.value) potenciaKw.value = arred(kwh.value / horas.value, 2)
  if (valor.value && kwh.value) tarifa.value = arred(valor.value / kwh.value, 3)
  else if (tarifa.value && kwh.value) valor.value = arred(kwh.value * tarifa.value, 2)
}
function onValorManual() {
  if (valor.value && kwh.value) { tarifa.value = arred(valor.value / kwh.value, 3); tarifaPreenchida.value = false }
}

async function salvar() {
  if (!valor.value || !kwh.value) { erro.value = 'Preencha valor e kWh.'; return }
  salvando.value = true
  erro.value = ''
  try {
    const payload = { data: data.value, valor: valor.value, kwhConsumidos: kwh.value, localRecarga: local.value, observacao: observacao.value || null }
    if (modoEdicao.value && recargaId.value) {
      await recargaService.atualizar(recargaId.value, payload)
    } else {
      await recargaService.registrar(payload)
    }
    router.replace({ path: '/transacoes', query: { tipo: 'R' } })
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao salvar.'
  } finally {
    salvando.value = false
  }
}

function iniciarTutorial() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    steps: [
      {
        element: '.voltar',
        popover: {
          title: 'Voltar',
          description: 'Clique para voltar para a lista de transações.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.formulario .row:nth-child(1) .field:nth-child(1) input',
        popover: {
          title: 'Data',
          description: 'Selecione a data em que realizou a recarga.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.formulario .row:nth-child(1) .field:nth-child(2) input',
        popover: {
          title: 'Dia da semana',
          description: 'Calculado automaticamente a partir da data selecionada.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.secao',
        popover: {
          title: 'Cálculo automático',
          description: 'Preencha os 3 campos (potência, horas, tarifa) para calcular automaticamente o valor e kWh. Ou edite manualmente os campos abaixo.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.row-3 .field:nth-child(1) input',
        popover: {
          title: 'Potência (kW)',
          description: 'Digite a potência do carregador em kW (ex: 7.4 para carregamento rápido, 3.3 para normal).',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.row-3 .field:nth-child(2) input',
        popover: {
          title: 'Horas carregando',
          description: 'Digite quanto tempo o veículo ficou carregando em horas (ex: 4 para 4 horas).',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.row-3 .field:nth-child(3) input',
        popover: {
          title: 'Tarifa (R$/kWh)',
          description: 'Preço por kWh de energia. Preenchido automaticamente com o valor salvo em Personalizações, mas você pode editar.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#valor',
        popover: {
          title: 'Valor (R$)',
          description: 'Custo total da recarga. Calculado automaticamente (kWh × tarifa), mas você pode editar manualmente.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#kwh-consumidos',
        popover: {
          title: 'kWh consumidos',
          description: 'Quantidade de energia carregada em kWh. Calculado automaticamente (potência × horas), mas você pode editar manualmente.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#local',
        popover: {
          title: 'Local',
          description: 'Selecione onde realizou a recarga (casa, rua, shopping, trabalho ou outro).',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#observacao',
        popover: {
          title: 'Observação',
          description: 'Adicione notas sobre esta recarga (opcional).',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '.formulario .salvar',
        popover: {
          title: 'Salvar',
          description: 'Clique para registrar esta recarga no sistema.',
          side: 'top' as Side,
          align: 'center' as Alignment
        }
      }
    ]
  })

  driverObj.drive()
}
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden;padding-bottom:2rem}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:360px;height:360px;background:#d4ff3a;opacity:.09;top:-140px;left:-120px}
.glow-2{width:300px;height:300px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}
.topbar{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.topbar-botoes{display:flex;align-items:center;gap:.5rem}
.botao-tutorial{display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border:1px solid var(--accent);border-radius:8px;background:rgba(212,255,58,.08);color:var(--text);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s ease}
.botao-tutorial:hover{background:rgba(212,255,58,.15);transform:scale(1.05)}
.botao-tutorial:active{transform:scale(.95)}
.botao-tutorial svg{width:14px;height:14px;fill:var(--accent)}
.voltar{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);cursor:pointer}
.voltar:hover{border-color:var(--accent);color:var(--accent)}
.voltar svg{width:18px;height:18px}
.head-txt{display:flex;flex-direction:column;gap:.15rem;min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.15rem;font-weight:700;letter-spacing:-.02em}
.spacer{width:40px}
.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:600px;margin:0 auto}
.formulario{display:flex;flex-direction:column;gap:.85rem;padding:1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.row{display:grid;grid-template-columns:1fr;gap:.75rem}
.row-3{display:grid;grid-template-columns:1fr;gap:.75rem}
@media (min-width:520px){.row{grid-template-columns:1fr 1fr}.row-3{grid-template-columns:1fr 1fr 1fr}}
.field{display:flex;flex-direction:column;gap:.4rem;min-width:0}
.secao{display:flex;flex-direction:column;gap:.6rem;padding:.9rem;background:rgba(212,255,58,.04);border:1px dashed color-mix(in oklab,var(--accent) 40%,var(--border));border-radius:var(--radius)}
.secao-titulo{font-size:.68rem;color:var(--accent);font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.dica{margin:0;font-size:.72rem;color:var(--text-mute);line-height:1.4}
label{display:inline-flex;align-items:center;gap:.4rem;font-size:.72rem;color:var(--text-mute);font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.badge-auto{font-size:.6rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:.1rem .35rem;border-radius:999px;background:rgba(124,245,196,.14);color:var(--accent-2, #7cf5c4);border:1px solid rgba(124,245,196,.3)}
input,select,textarea{width:100%;padding:.85rem 1rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;font-family:inherit;box-sizing:border-box;transition:all .2s;appearance:none}
textarea{resize:vertical;min-height:80px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgba(212,255,58,.12)}
input:disabled{opacity:.7}
.salvar{margin-top:.35rem;padding:.95rem 1rem;border:none;border-radius:var(--radius);background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-size:.98rem;font-weight:700;cursor:pointer;box-shadow:0 10px 30px -12px rgba(212,255,58,.55),inset 0 1px 0 rgba(255,255,255,.35);font-family:inherit;transition:transform .15s,box-shadow .2s}
.salvar:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px -12px rgba(212,255,58,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.salvar:disabled{opacity:.6;cursor:not-allowed}
.mensagem{margin:0;padding:.75rem .9rem;border-radius:var(--radius);font-size:.88rem;text-align:center}
.mensagem.erro{color:var(--danger);background:rgba(255,107,122,.08);border:1px solid rgba(255,107,122,.25)}
</style>
