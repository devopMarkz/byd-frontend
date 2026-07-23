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
        <span class="eyebrow"><span class="dot" /> Ajustes</span>
        <h1>Personalizações</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <form class="formulario" @submit.prevent="salvar">
        <h2>Tarifa residencial de energia</h2>
        <p class="descricao">
          Este valor será usado como padrão para estimar seus custos de recarga.
        </p>

        <div class="field">
          <label for="tarifa">Valor do kWh (R$)</label>
          <input
            id="tarifa"
            v-model.number="tarifa"
            type="number"
            min="0"
            step="0.0001"
            :disabled="carregando"
            :placeholder="carregando ? 'Carregando...' : 'Ex: 1.25'"
            required
          />
        </div>

        <button type="submit" :disabled="salvando || carregando">
          <span v-if="!salvando">Salvar tarifa</span>
          <span v-else class="loading"><span class="spinner" /> Salvando...</span>
        </button>
      </form>

      <transition name="fade">
        <p v-if="mensagem" class="mensagem" :class="{ erro: erro }">{{ mensagem }}</p>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { configuracaoService } from '@/services/configuracaoService'

const router = useRouter(),
  tarifa = ref<number | undefined>(),
  carregando = ref(true),
  salvando = ref(false),
  mensagem = ref(''),
  erro = ref(false)

// Aceita tanto um número puro quanto o objeto { tarifaEnergiaKwh: number }
// retornado pelo endpoint GET /api/configuracoes/tarifa-energia.
function extrairTarifa(resp: any): number | undefined {
  if (resp == null) return undefined
  if (typeof resp === 'number') return resp
  const valor = resp.tarifaEnergiaKwh ?? resp.tarifa ?? resp.valor
  return valor != null ? Number(valor) : undefined
}

onMounted(async () => {
  try {
    const resp = await configuracaoService.obterTarifaEnergia()
    tarifa.value = extrairTarifa(resp)
  } catch {
    // silencioso: mantém o campo vazio para o usuário preencher
  } finally {
    carregando.value = false
  }
})

async function salvar() {
  if (tarifa.value === undefined || tarifa.value === null) return
  salvando.value = true
  try {
    await configuracaoService.atualizarTarifaEnergia({ tarifaEnergiaKwh: tarifa.value })
    mensagem.value = 'Tarifa salva.'
    erro.value = false
  } catch (e: any) {
    erro.value = true
    mensagem.value = e.userMessage || 'Não foi possível salvar.'
  } finally {
    salvando.value = false
  }
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
    radial-gradient(120% 60% at 0% 0%, #0f1a24 0%, transparent 55%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
  color: var(--text);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  padding-bottom: 2rem;
}
:root[data-tema="claro"] .tela {
  --bg: #f4f6fb; --surface: #ffffff; --surface-2: #f9fafd;
  --border: #e2e6ee; --border-strong: #c9cfdc;
  --text: #0e1422; --text-dim: #525a6d; --text-mute: #7a8299;
  --input-bg: #ffffff;
  background:
    radial-gradient(120% 60% at 0% 0%, #eaf2ff 0%, transparent 55%),
    linear-gradient(160deg, #f5f7fc 0%, #eef1f8 100%);
}

.ambient { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.glow-1 { width: 360px; height: 360px; background: #d4ff3a; opacity: .09; top: -140px; left: -120px; }
.glow-2 { width: 300px; height: 300px; background: #7cf5c4; opacity: .07; bottom: -140px; right: -100px; }

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
  max-width: 560px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 1rem;
}

.formulario {
  display: flex; flex-direction: column; gap: 1rem;
  padding: 1.5rem;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius);
}

h2 {
  margin: 0;
  font-size: 1rem; font-weight: 700; color: var(--text);
  letter-spacing: -.01em;
}
.descricao {
  margin: 0; color: var(--text-dim); font-size: .85rem; line-height: 1.5;
}

.field { display: flex; flex-direction: column; gap: .4rem; }
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
input:hover { border-color: var(--border-strong); }
input:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(212,255,58,.12);
}
input:disabled { opacity: .6; cursor: wait; }

button[type='submit'] {
  margin-top: .25rem; width: 100%;
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
@keyframes spin { to { transform: rotate(360deg); } }

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
