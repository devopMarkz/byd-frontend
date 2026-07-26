<template>
  <div class="tela">
    <div class="ambient glow-1" />
    <div class="ambient glow-2" />

    <header class="topbar">
      <button class="voltar" @click="router.back" aria-label="Voltar">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="head-txt">
        <span class="eyebrow"><span class="dot" /> Turno</span>
        <h1>Jornada</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <div v-if="carregando" class="info"><span class="spinner-mute" /> Carregando...</div>

      <template v-else-if="jornadaAberta">
        <section class="resumo">
          <div class="resumo-head">
            <span class="pulse-dot" />
            <span class="resumo-label">Jornada em aberto</span>
          </div>
          <div class="resumo-grid">
            <div class="resumo-item">
              <span class="mini-label">Início</span>
              <span class="mini-value">{{ jornadaAberta.horarioInicio }}</span>
            </div>
            <div class="resumo-item">
              <span class="mini-label">Odômetro</span>
              <span class="mini-value">{{ jornadaAberta.odometroInicial }} <small>km</small></span>
            </div>
            <div class="resumo-item">
              <span class="mini-label">Bateria</span>
              <span class="mini-value">{{ jornadaAberta.percentualBateriaInicial }}<small>%</small></span>
            </div>
          </div>
        </section>

        <form class="formulario" @submit.prevent="encerrar">
          <h2>Encerrar jornada</h2>
          <div class="field">
            <label for="horarioFim">Horário de término</label>
            <input id="horarioFim" v-model="horarioFim" type="time" required />
          </div>

          <div class="field">
            <label for="odometroFinal">Odômetro final (km)</label>
            <input id="odometroFinal" v-model="odometroFinal" type="number" step="0.01" min="0" required />
          </div>

          <div class="field">
            <label for="percentualBateriaFinal">Bateria final (%)</label>
            <input id="percentualBateriaFinal" v-model="percentualBateriaFinal" type="number" min="0" max="100" required />
          </div>

          <button type="submit" class="btn-danger" :disabled="salvando">
            <span v-if="!salvando">Encerrar Jornada</span>
            <span v-else class="loading"><span class="spinner" /> Encerrando...</span>
          </button>
        </form>
      </template>

      <template v-else>
        <div class="hero-card">
          <div class="hero-icon"><IconeApp nome="carro" :tamanho="36" /></div>
          <div class="hero-txt">
            <span class="hero-label">Nenhuma jornada ativa</span>
            <p>Comece um novo turno para registrar suas corridas de hoje.</p>
          </div>
        </div>

        <form class="formulario" @submit.prevent="iniciar">
          <h2>Iniciar jornada</h2>
          <div class="field">
            <label for="veiculo">Veículo</label>
            <select id="veiculo" v-model="veiculoId" required>
              <option value="">Selecione</option>
              <option v-for="v in veiculos" :key="v.id" :value="v.id">{{ v.marca }} {{ v.modelo }}</option>
            </select>
          </div>

          <div class="row">
            <div class="field">
              <label for="data">Data</label>
              <input id="data" v-model="data" type="date" required />
            </div>
            <div class="field">
              <label for="horarioInicio">Horário de início</label>
              <input id="horarioInicio" v-model="horarioInicio" type="time" required />
            </div>
          </div>

          <div class="row">
            <div class="field">
              <label for="odometroInicial">Odômetro inicial (km)</label>
              <input id="odometroInicial" v-model="odometroInicial" type="number" step="0.01" min="0" required />
            </div>
            <div class="field">
              <label for="percentualBateriaInicial">Bateria inicial (%)</label>
              <input id="percentualBateriaInicial" v-model="percentualBateriaInicial" type="number" min="0" max="100" required />
            </div>
          </div>

          <button type="submit" :disabled="salvando">
            <span v-if="!salvando">Iniciar Jornada</span>
            <span v-else class="loading"><span class="spinner" /> Iniciando...</span>
          </button>
        </form>
      </template>

      <transition name="fade">
        <p v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</p>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IconeApp from '@/components/IconeApp.vue'
import { useRouter } from 'vue-router'
import { jornadaService } from '@/services/jornadaService'
import { veiculoService } from '@/services/veiculoService'
import { useAuthStore } from '@/stores/auth'
import { dataAtualBrasil, horarioAtualBrasil } from '@/utils/data'
import type { JornadaResponse, VeiculoResponse } from '@/types'

const router = useRouter()
const auth = useAuthStore()

const veiculos = ref<VeiculoResponse[]>([])
const jornadaAberta = ref<JornadaResponse | null>(null)
const carregando = ref(true)
const salvando = ref(false)
const mensagem = ref('')
const erro = ref(false)

const veiculoId = ref(auth.veiculoPadraoId || '')
const data = ref(dataAtualBrasil())
const horarioInicio = ref(horarioAtualBrasil())
const odometroInicial = ref('')
const percentualBateriaInicial = ref('')

const horarioFim = ref(horarioAtualBrasil())
const odometroFinal = ref('')
const percentualBateriaFinal = ref('')

onMounted(async () => {
  try {
    veiculos.value = await veiculoService.listar()
    const lista = await jornadaService.listar()
    jornadaAberta.value = lista.find(j => j.status === 'EM_ANDAMENTO') ?? null
  } catch (e: any) {
    mensagem.value = e.userMessage || 'Erro ao carregar dados'
    erro.value = true
  } finally {
    carregando.value = false
  }
})

async function iniciar() {
  salvando.value = true
  mensagem.value = ''
  erro.value = false

  try {
    await jornadaService.iniciar({
      veiculoId: veiculoId.value,
      data: data.value,
      horarioInicio: horarioInicio.value + ':00',
      odometroInicial: Number(odometroInicial.value),
      percentualBateriaInicial: Number(percentualBateriaInicial.value)
    })
    mensagem.value = 'Jornada iniciada!'
    setTimeout(() => router.push('/'), 800)
  } catch (e: any) {
    erro.value = true
    mensagem.value = e.userMessage || 'Erro ao iniciar jornada'
  } finally {
    salvando.value = false
  }
}

async function encerrar() {
  salvando.value = true
  mensagem.value = ''
  erro.value = false

  try {
    await jornadaService.encerrar({
      jornadaId: jornadaAberta.value!.id,
      horarioFim: horarioFim.value + ':00',
      odometroFinal: Number(odometroFinal.value),
      percentualBateriaFinal: Number(percentualBateriaFinal.value)
    })
    mensagem.value = 'Jornada encerrada!'
    setTimeout(() => router.push('/'), 800)
  } catch (e: any) {
    erro.value = true
    mensagem.value = e.userMessage || 'Erro ao encerrar jornada'
  } finally {
    salvando.value = false
  }
}
</script>

<style scoped>
.tela {
  --bg: #07090f; --surface: #0d111b;
  --border: #1e2636; --border-strong: #2a3446;
  --text: #eef2ff; --text-dim: #8a94ad; --text-mute: #5b6480;
  --accent: #d4ff3a; --accent-2: #7cf5c4; --danger: #ff6b7a;

  position: relative; min-height: 100vh;
  background:
    radial-gradient(120% 60% at 0% 0%, #0f1a24 0%, transparent 55%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
  color: var(--text);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
.ambient { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.glow-1 { width: 380px; height: 380px; background: #d4ff3a; opacity: 0.09; top: -140px; left: -120px; }
.glow-2 { width: 320px; height: 320px; background: #7cf5c4; opacity: 0.07; bottom: -140px; right: -100px; }

.topbar {
  position: sticky; top: 0; z-index: 10;
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 0.75rem;
  padding: 1rem 1.1rem;
  background: rgba(7, 9, 15, 0.75);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.voltar {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border);
  color: var(--text); cursor: pointer; transition: all 0.2s ease;
}
.voltar:hover { border-color: var(--accent); color: var(--accent); background: rgba(212, 255, 58, 0.08); }
.voltar svg { width: 18px; height: 18px; }
.head-txt { display: flex; flex-direction: column; gap: 0.15rem; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.68rem; color: var(--accent); font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
}
.dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent); }
h1 { margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; }
.spacer { width: 40px; }

.conteudo {
  position: relative; z-index: 1;
  padding: 1.25rem 1.1rem 2rem;
  max-width: 520px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 1rem;
}

.info {
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 3rem 0; color: var(--text-mute); font-size: 0.9rem;
}
.spinner-mute {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(212,255,58,0.2); border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}

.hero-card {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.15rem 1.25rem; border-radius: 4px;
  background:
    radial-gradient(100% 80% at 100% 0%, rgba(124, 245, 196, 0.1) 0%, transparent 60%),
    linear-gradient(160deg, #0e1422 0%, #0a0e18 100%);
  border: 1px solid var(--border);
}
.hero-icon {
  font-size: 1.8rem;
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 4px;
  background: rgba(124, 245, 196, 0.08);
  border: 1px solid rgba(124, 245, 196, 0.2);
}
.hero-label {
  display: block; font-size: 0.72rem; color: var(--accent-2);
  font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.hero-card p { margin: 0; color: var(--text-dim); font-size: 0.88rem; line-height: 1.4; }

.resumo {
  padding: 1.4rem;
  border-radius: 4px;
  background:
    radial-gradient(100% 80% at 100% 0%, rgba(212, 255, 58, 0.1) 0%, transparent 60%),
    linear-gradient(160deg, #0e1422 0%, #0a0e18 100%);
  border: 1px solid rgba(212, 255, 58, 0.2);
}
.resumo-head {
  display: flex; align-items: center; gap: 0.5rem;
  margin-bottom: 1rem;
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
.resumo-label {
  font-size: 0.75rem; color: var(--accent);
  font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
}
.resumo-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
}
.resumo-item {
  padding: 0.85rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 4px;
  display: flex; flex-direction: column; gap: 0.2rem;
}
.mini-label {
  font-size: 0.65rem; color: var(--text-mute);
  font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
}
.mini-value {
  font-size: 1.15rem; font-weight: 700; color: var(--text);
  letter-spacing: -0.02em;
}
.mini-value small {
  font-size: 0.75rem; color: var(--text-mute);
  font-weight: 500; margin-left: 0.1rem;
}

.formulario {
  display: flex; flex-direction: column; gap: 1rem;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.formulario h2 {
  margin: 0 0 0.25rem;
  font-size: 1rem; font-weight: 700; letter-spacing: -0.01em;
}
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
label {
  font-size: 0.72rem; color: var(--text-mute);
  font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
}

input, select {
  width: 100%; padding: 0.85rem 1rem;
  background: #0a0f19; border: 1px solid var(--border);
  border-radius: 4px; color: var(--text);
  font-size: 0.95rem; font-family: inherit;
  box-sizing: border-box; color-scheme: dark;
  transition: all 0.2s ease; appearance: none;
}
select {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1l5 5 5-5' stroke='%238a94ad' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}
input::placeholder { color: var(--text-mute); }
input:hover, select:hover { border-color: var(--border-strong); }
input:focus, select:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(212, 255, 58, 0.12);
}

button[type='submit'] {
  margin-top: 0.5rem; width: 100%;
  padding: 0.95rem 1rem; border: none; border-radius: 4px;
  background: linear-gradient(180deg, var(--accent) 0%, #b8e628 100%);
  color: #07090f; font-size: 0.98rem; font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  box-shadow: 0 10px 30px -12px rgba(212, 255, 58, 0.55), inset 0 1px 0 rgba(255,255,255,0.35);
  font-family: inherit;
}
button[type='submit']:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 36px -12px rgba(212, 255, 58, 0.7), inset 0 1px 0 rgba(255,255,255,0.4);
}
button[type='submit']:disabled { opacity: 0.6; cursor: not-allowed; }

button.btn-danger {
  background: linear-gradient(180deg, #ff6b7a 0%, #e04a5c 100%);
  color: #fff;
  box-shadow: 0 10px 30px -12px rgba(255, 107, 122, 0.55), inset 0 1px 0 rgba(255,255,255,0.2);
}
button.btn-danger:hover:not(:disabled) {
  box-shadow: 0 14px 36px -12px rgba(255, 107, 122, 0.7), inset 0 1px 0 rgba(255,255,255,0.25);
}

.loading { display: inline-flex; align-items: center; gap: 0.55rem; }
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(7,9,15,0.3); border-top-color: currentColor;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mensagem {
  margin: 0; padding: 0.75rem 0.9rem;
  border-radius: 11px; font-size: 0.88rem;
  font-weight: 500; text-align: center;
  color: var(--accent-2);
  background: rgba(124, 245, 196, 0.08);
  border: 1px solid rgba(124, 245, 196, 0.25);
}
.mensagem.erro {
  color: var(--danger);
  background: rgba(255, 107, 122, 0.08);
  border-color: rgba(255, 107, 122, 0.25);
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
