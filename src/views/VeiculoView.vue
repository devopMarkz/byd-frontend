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
        <span class="eyebrow"><span class="dot" /> Frota</span>
        <h1>Veículos</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <section class="lista-section">
        <h2>Cadastrados</h2>
        <div v-if="carregando" class="info"><span class="spinner-mute" /> Carregando...</div>
        <div v-else-if="veiculos.length === 0" class="vazio">
          <span class="vazio-icon">🚗</span>
          <p>Nenhum veículo cadastrado ainda.</p>
        </div>
        <ul v-else class="lista">
          <li v-for="v in veiculos" :key="v.id" class="veic-item">
            <div class="veic-icon">🚗</div>
            <div class="veic-body">
              <div class="veic-title">{{ v.marca }} {{ v.modelo }}</div>
              <div class="veic-meta">
                <span>{{ v.ano }}</span>
                <span class="sep">·</span>
                <span>{{ v.autonomiaKm }} km</span>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <form class="formulario" @submit.prevent="salvar">
        <h2>Novo Veículo</h2>

        <div class="row">
          <div class="field">
            <label for="marca">Marca</label>
            <input id="marca" v-model="marca" type="text" required />
          </div>
          <div class="field">
            <label for="modelo">Modelo</label>
            <input id="modelo" v-model="modelo" type="text" required />
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label for="ano">Ano</label>
            <input id="ano" v-model="ano" type="number" min="1900" required />
          </div>
          <div class="field">
            <label for="tipo">Tipo</label>
            <input id="tipo" v-model="tipo" type="text" placeholder="Ex: Hatch elétrico" required />
          </div>
        </div>

        <div class="field">
          <label for="capacidadeBateriaKwh">Capacidade bateria (kWh)</label>
          <input id="capacidadeBateriaKwh" v-model="capacidadeBateriaKwh" type="number" step="0.01" min="0" required />
        </div>

        <div class="row">
          <div class="field">
            <label for="autonomiaKm">Autonomia (km)</label>
            <input id="autonomiaKm" v-model="autonomiaKm" type="number" step="0.01" min="0" required />
          </div>
          <div class="field">
            <label for="consumoMedioKwhKm">Consumo (kWh/km)</label>
            <input id="consumoMedioKwhKm" v-model="consumoMedioKwhKm" type="number" step="0.0001" min="0" required />
          </div>
        </div>

        <button type="submit" :disabled="salvando">
          <span v-if="!salvando">Salvar Veículo</span>
          <span v-else class="loading"><span class="spinner" /> Salvando...</span>
        </button>

        <transition name="fade">
          <p v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</p>
        </transition>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { veiculoService } from '@/services/veiculoService'
import type { VeiculoResponse } from '@/types'

const router = useRouter()

const veiculos = ref<VeiculoResponse[]>([])
const carregando = ref(true)
const salvando = ref(false)
const mensagem = ref('')
const erro = ref(false)

const marca = ref('')
const modelo = ref('')
const ano = ref('')
const tipo = ref('')
const capacidadeBateriaKwh = ref('')
const autonomiaKm = ref('')
const consumoMedioKwhKm = ref('')

onMounted(async () => {
  try {
    veiculos.value = await veiculoService.listar()
  } catch (e: any) {
    mensagem.value = e.userMessage || 'Erro ao carregar veículos'
    erro.value = true
  } finally {
    carregando.value = false
  }
})

async function salvar() {
  salvando.value = true
  mensagem.value = ''
  erro.value = false

  try {
    await veiculoService.registrar({
      marca: marca.value,
      modelo: modelo.value,
      ano: Number(ano.value),
      tipo: tipo.value,
      capacidadeBateriaKwh: Number(capacidadeBateriaKwh.value),
      autonomiaKm: Number(autonomiaKm.value),
      consumoMedioKwhKm: Number(consumoMedioKwhKm.value)
    })
    mensagem.value = 'Veículo salvo com sucesso!'
    limparCampos()
    veiculos.value = await veiculoService.listar()
  } catch (e: any) {
    erro.value = true
    mensagem.value = e.userMessage || 'Erro ao salvar veículo'
  } finally {
    salvando.value = false
  }
}

function limparCampos() {
  marca.value = ''
  modelo.value = ''
  ano.value = ''
  tipo.value = ''
  capacidadeBateriaKwh.value = ''
  autonomiaKm.value = ''
  consumoMedioKwhKm.value = ''
}
</script>

<style scoped>
.tela {
  --bg: #07090f; --surface: #0d111b; --surface-2: #11172a;
  --border: #1e2636; --border-strong: #2a3446;
  --text: #eef2ff; --text-dim: #8a94ad; --text-mute: #5b6480;
  --accent: #d4ff3a; --accent-2: #7cf5c4; --danger: #ff6b7a;
  --input-bg: #0a0f19; --radius: 4px;

  position: relative; min-height: 100vh;
  background:
    radial-gradient(120% 60% at 100% 0%, #101728 0%, transparent 55%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
  color: var(--text);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
  padding-bottom: 2rem;
}
:root[data-tema="claro"] .tela {
  --bg: #f4f6fb; --surface: #ffffff; --surface-2: #f9fafd;
  --border: #e2e6ee; --border-strong: #c9cfdc;
  --text: #0e1422; --text-dim: #525a6d; --text-mute: #7a8299;
  --input-bg: #ffffff;
  background:
    radial-gradient(120% 60% at 100% 0%, #eaf2ff 0%, transparent 55%),
    linear-gradient(160deg, #f5f7fc 0%, #eef1f8 100%);
}

.ambient { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.glow-1 { width: 360px; height: 360px; background: #7cf5c4; opacity: .08; top: -140px; right: -120px; }
.glow-2 { width: 320px; height: 320px; background: #d4ff3a; opacity: .06; bottom: -140px; left: -100px; }

.topbar {
  position: sticky; top: 0; z-index: 10;
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: .75rem;
  padding: 1rem 1.1rem;
  background: color-mix(in oklab, var(--bg) 75%, transparent);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
}
.voltar {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: var(--radius);
  background: rgba(255,255,255,.03); border: 1px solid var(--border);
  color: var(--text); cursor: pointer; transition: all .2s ease;
}
.voltar:hover { border-color: var(--accent); color: var(--accent); background: rgba(212,255,58,.08); }
.voltar svg { width: 18px; height: 18px; }
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
h1 { margin: 0; font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; color: var(--text); }
.spacer { width: 40px; }

.conteudo {
  position: relative; z-index: 1;
  padding: 1.25rem 1.1rem;
  max-width: 520px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 1.25rem;
}

h2 {
  margin: 0 0 .85rem;
  font-size: .72rem; color: var(--text-mute);
  font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
}

.info {
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  padding: 2rem 0; color: var(--text-mute); font-size: .9rem;
}
.spinner-mute {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(212,255,58,.2); border-top-color: var(--accent);
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.lista { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .6rem; }
.veic-item {
  display: flex; align-items: center; gap: .85rem;
  padding: 1rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color .2s ease;
}
.veic-item:hover { border-color: var(--border-strong); }
.veic-icon {
  flex-shrink: 0;
  width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius);
  font-size: 1.25rem;
  background: rgba(124,245,196,.08);
  border: 1px solid rgba(124,245,196,.2);
}
.veic-body { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.veic-title { font-weight: 700; letter-spacing: -.01em; color: var(--text); font-size: 1rem; }
.veic-meta { color: var(--text-dim); font-size: .82rem; display: flex; gap: .4rem; }
.sep { color: var(--text-mute); }

.vazio {
  display: flex; flex-direction: column; align-items: center; gap: .6rem;
  padding: 2rem 1rem;
  border: 1px dashed var(--border); border-radius: var(--radius);
  color: var(--text-mute);
}
.vazio-icon { font-size: 1.8rem; opacity: .6; }
.vazio p { margin: 0; font-size: .88rem; }

.formulario {
  display: flex; flex-direction: column; gap: 1rem;
  padding: 1.5rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius);
}
.field { display: flex; flex-direction: column; gap: .4rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
label {
  font-size: .72rem; color: var(--text-mute);
  font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
}

input {
  width: 100%; padding: .85rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--text); font-size: .95rem;
  font-family: inherit; box-sizing: border-box;
  color-scheme: dark; transition: all .2s ease;
}
:root[data-tema="claro"] input { color-scheme: light; }
input::placeholder { color: var(--text-mute); }
input:hover { border-color: var(--border-strong); }
input:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(212,255,58,.12);
}

button[type='submit'] {
  margin-top: .5rem; width: 100%;
  padding: .95rem 1rem; border: none; border-radius: var(--radius);
  background: linear-gradient(180deg, var(--accent) 0%, #b8e628 100%);
  color: #07090f; font-size: .98rem; font-weight: 700;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease;
  box-shadow: 0 10px 30px -12px rgba(212,255,58,.55), inset 0 1px 0 rgba(255,255,255,.35);
  font-family: inherit;
}
button[type='submit']:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 36px -12px rgba(212,255,58,.7), inset 0 1px 0 rgba(255,255,255,.4);
}
button[type='submit']:disabled { opacity: .6; cursor: not-allowed; }

.loading { display: inline-flex; align-items: center; gap: .55rem; }
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(7,9,15,.3); border-top-color: #07090f;
  animation: spin .7s linear infinite;
}

.mensagem {
  margin: 0; padding: .75rem .9rem;
  border-radius: var(--radius); font-size: .88rem;
  font-weight: 500; text-align: center;
  color: var(--accent-2);
  background: rgba(124,245,196,.08);
  border: 1px solid rgba(124,245,196,.25);
}
.mensagem.erro {
  color: var(--danger);
  background: rgba(255,107,122,.08);
  border-color: rgba(255,107,122,.25);
}
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
