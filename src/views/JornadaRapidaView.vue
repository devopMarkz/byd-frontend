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
        <span class="eyebrow"><span class="dot" /> Turno</span>
        <h1>Jornada</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <p class="descricao">{{ jornadaAberta ? 'Sua jornada está em andamento.' : 'Registre o início ao sair de casa.' }}</p>
      <button class="acao" :class="{ encerrar: jornadaAberta }" :disabled="salvando" @click="executar">
        <span>{{ salvando ? 'AGUARDE' : jornadaAberta ? 'ENCERRAR' : 'INICIAR' }}</span>
      </button>
      <small class="dica">{{ jornadaAberta ? 'A data e hora atuais serão registradas ao encerrar.' : 'A data e hora atuais serão registradas.' }}</small>
      <p v-if="mensagem" class="mensagem" :class="{ erro }">{{ mensagem }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { jornadaService } from '@/services/jornadaService'
const router = useRouter(), jornadaAberta = ref(false), salvando = ref(false), mensagem = ref(''), erro = ref(false)
async function carregar() { const jornadas = await jornadaService.listar(); jornadaAberta.value = jornadas.some(j => j.status === 'EM_ANDAMENTO') }
async function executar() { salvando.value = true; mensagem.value = ''; erro.value = false; try { if (jornadaAberta.value) await jornadaService.encerrarAtual(); else await jornadaService.iniciarAgora(); await carregar(); mensagem.value = jornadaAberta.value ? 'Jornada iniciada.' : 'Jornada encerrada.' } catch (e: any) { erro.value = true; mensagem.value = e.userMessage || 'Não foi possível registrar a jornada.' } finally { salvando.value = false } }
onMounted(carregar)
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:360px;height:360px;background:#d4ff3a;opacity:.09;top:-140px;left:-120px}
.glow-2{width:300px;height:300px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}
.topbar{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.voltar{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);cursor:pointer}
.voltar:hover{border-color:var(--accent);color:var(--accent)}
.voltar svg{width:18px;height:18px}
.head-txt{display:flex;flex-direction:column;gap:.15rem}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.15rem;font-weight:700;letter-spacing:-.02em}
.spacer{width:40px}
.conteudo{position:relative;z-index:1;min-height:calc(100vh - 80px);padding:1.5rem;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1.5rem;text-align:center;max-width:520px;margin:0 auto}
.descricao{max-width:300px;color:var(--text-dim);font-size:.95rem;margin:0}
.acao{width:220px;height:220px;border-radius:50%;border:0;background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-size:1.4rem;font-weight:900;letter-spacing:.04em;cursor:pointer;box-shadow:0 20px 60px -12px rgba(212,255,58,.6),inset 0 2px 0 rgba(255,255,255,.35),0 0 0 12px rgba(212,255,58,.08);transition:transform .15s,box-shadow .2s;font-family:inherit}
.acao:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 26px 72px -12px rgba(212,255,58,.75),inset 0 2px 0 rgba(255,255,255,.4),0 0 0 14px rgba(212,255,58,.1)}
.acao:disabled{opacity:.7;cursor:not-allowed}
.acao.encerrar{background:linear-gradient(180deg,var(--danger) 0%,#e04a5c 100%);color:#fff;box-shadow:0 20px 60px -12px rgba(255,107,122,.6),inset 0 2px 0 rgba(255,255,255,.2),0 0 0 12px rgba(255,107,122,.08)}
.acao.encerrar:hover:not(:disabled){box-shadow:0 26px 72px -12px rgba(255,107,122,.75),inset 0 2px 0 rgba(255,255,255,.25),0 0 0 14px rgba(255,107,122,.1)}
.dica{color:var(--text-mute);font-size:.78rem;max-width:280px}
.mensagem{margin:0;padding:.75rem 1rem;border-radius:var(--radius);font-size:.88rem;color:var(--accent-2);background:rgba(124,245,196,.08);border:1px solid rgba(124,245,196,.25)}
.mensagem.erro{color:var(--danger);background:rgba(255,107,122,.08);border-color:rgba(255,107,122,.25)}
</style>
