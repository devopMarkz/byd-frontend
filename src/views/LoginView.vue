<template>
  <div class="login-shell">
    <!-- Painel lateral / branding (desktop) -->
    <aside class="brand-panel">
      <div class="brand-glow glow-1" />
      <div class="brand-glow glow-2" />
      <div class="brand-grid" />

      <div class="brand-top">
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6M5 13h14M5 13v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4M7.5 16.5h.01M16.5 16.5h.01"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
          <span>BYD Dolphin</span>
        </div>
      </div>

      <div class="brand-copy">
        <span class="eyebrow">
          <span class="dot" />
          Painel do motorista
        </span>
        <h2>
          Cada corrida.<br />
          Cada centavo.<br />
          <em>No controle.</em>
        </h2>
        <p>
          Acompanhe combustível, manutenção e lucro real de cada jornada — feito
          para quem vive do volante.
        </p>

        <div class="stats">
          <div class="stat">
            <span class="stat-value">R$ 12,4k</span>
            <span class="stat-label">Faturado no mês</span>
          </div>
          <div class="stat">
            <span class="stat-value">78%</span>
            <span class="stat-label">Margem líquida</span>
          </div>
        </div>
      </div>

      <div class="brand-foot">© {{ new Date().getFullYear() }} BYD Dolphin</div>
    </aside>

    <!-- Formulário -->
    <main class="form-panel">
      <div class="ambient glow-mobile-1" />
      <div class="ambient glow-mobile-2" />

      <form class="login-card" @submit.prevent="entrar">
        <div class="mobile-mark">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6M5 13h14M5 13v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4"
              stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
          <span>BYD Dolphin</span>
        </div>

        <header class="form-head">
          <span class="eyebrow mobile-eyebrow"><span class="dot" /> Bem-vindo</span>
          <h1>Entre na sua conta</h1>
          <p>Continue acompanhando seus ganhos.</p>
        </header>

        <div class="field">
          <label for="email">Email</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16v12H4z M4 6l8 7 8-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input id="email" v-model="email" type="email" required placeholder="seu@email.com" />
          </div>
        </div>

        <div class="field">
          <label for="senha">Senha</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/>
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <input id="senha" v-model="senha" type="password" required placeholder="••••••" />
          </div>
        </div>

        <button type="submit" :disabled="auth.carregando">
          <span v-if="!auth.carregando">Entrar</span>
          <span v-else class="loading">
            <span class="spinner" />
            Entrando...
          </span>
        </button>

        <transition name="fade">
          <p v-if="auth.erro" class="erro">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
              <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            {{ auth.erro }}
          </p>
        </transition>

        <p class="foot-note">
          Precisa de acesso? <a href="#">Fale com o suporte</a>
        </p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const senha = ref('')

async function entrar() {
  const sucesso = await auth.login({ email: email.value, senha: senha.value })
  if (sucesso) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh; width: 100%;
  display: grid; grid-template-columns: 1fr;
  background: var(--bg); color: var(--text);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ---------- Painel lateral (desktop only) ---------- */
.brand-panel {
  display: none;
  position: relative; overflow: hidden;
  padding: 2.5rem;
  flex-direction: column; justify-content: space-between;
  background:
    radial-gradient(120% 80% at 0% 0%, #131a2b 0%, transparent 55%),
    radial-gradient(90% 60% at 100% 100%, #0f2820 0%, transparent 60%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
  border-right: 1px solid var(--border);
}
:root[data-tema="claro"] .brand-panel {
  background:
    radial-gradient(120% 80% at 0% 0%, #e2ecff 0%, transparent 55%),
    radial-gradient(90% 60% at 100% 100%, #dcf5ea 0%, transparent 60%),
    linear-gradient(160deg, #f5f7fc 0%, #eef1f8 100%);
}

.brand-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.glow-1 { width: 420px; height: 420px; background: #d4ff3a; top: -120px; left: -140px; opacity: .18; }
.glow-2 { width: 380px; height: 380px; background: #7cf5c4; bottom: -140px; right: -120px; opacity: .15; }

.brand-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
  pointer-events: none;
}

.brand-top, .brand-copy, .brand-foot { position: relative; z-index: 1; }

.brand-mark {
  display: inline-flex; align-items: center; gap: .65rem;
  font-weight: 700; font-size: 1.05rem; letter-spacing: -.01em;
}
.brand-mark svg {
  width: 34px; height: 34px; padding: 6px;
  border-radius: var(--radius);
  color: #07090f; background: var(--accent);
  box-shadow: 0 8px 24px -8px rgba(212,255,58,.55);
}

.brand-copy { max-width: 460px; }

.eyebrow {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .35rem .75rem; border-radius: 999px;
  background: rgba(212,255,58,.08); border: 1px solid rgba(212,255,58,.25);
  color: var(--accent); font-size: .72rem; font-weight: 600;
  letter-spacing: .02em; text-transform: uppercase;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 10px var(--accent);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

.brand-copy h2 {
  margin: 1.25rem 0 1rem;
  font-size: clamp(2.25rem, 3.4vw, 3.25rem);
  line-height: 1.05; font-weight: 700; letter-spacing: -.03em;
}
.brand-copy h2 em {
  font-style: normal;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.brand-copy p { color: var(--text-dim); font-size: 1rem; line-height: 1.55; max-width: 420px; }

.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: .75rem; margin-top: 2rem; max-width: 420px; }
.stat {
  padding: 1rem 1.1rem; border-radius: var(--radius);
  background: rgba(255,255,255,.02);
  border: 1px solid var(--border); backdrop-filter: blur(6px);
}
.stat-value { display: block; font-size: 1.4rem; font-weight: 700; letter-spacing: -.02em; }
.stat-label { display: block; margin-top: .15rem; color: var(--text-mute); font-size: .78rem; }

.brand-foot { color: var(--text-mute); font-size: .78rem; }

/* ---------- Painel do formulário (mobile-first) ---------- */
.form-panel {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem 1.25rem;
  min-height: 100vh;
  background:
    radial-gradient(120% 60% at 0% 0%, #0f1a24 0%, transparent 55%),
    linear-gradient(160deg, #0a0e18 0%, #050710 100%);
}
:root[data-tema="claro"] .form-panel {
  background:
    radial-gradient(120% 60% at 0% 0%, #eaf2ff 0%, transparent 55%),
    linear-gradient(160deg, #f5f7fc 0%, #eef1f8 100%);
}
.ambient { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.glow-mobile-1 { width: 300px; height: 300px; background: #d4ff3a; opacity: .1; top: -120px; left: -100px; }
.glow-mobile-2 { width: 260px; height: 260px; background: #7cf5c4; opacity: .08; bottom: -120px; right: -80px; }

.login-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 400px;
  display: flex; flex-direction: column; gap: 1.15rem;
  padding: 1.75rem 1.5rem;
  background: color-mix(in oklab, var(--surface) 90%, transparent);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  backdrop-filter: blur(10px);
}

.mobile-mark {
  display: inline-flex; align-items: center; gap: .6rem;
  justify-content: center; margin-bottom: .25rem; font-weight: 700;
}
.mobile-mark svg {
  width: 32px; height: 32px; padding: 6px;
  border-radius: var(--radius);
  color: #07090f; background: var(--accent);
  box-shadow: 0 8px 24px -8px rgba(212,255,58,.55);
}

.form-head { display: flex; flex-direction: column; gap: .35rem; }
.mobile-eyebrow { align-self: flex-start; }
.form-head h1 {
  margin: 0; font-size: 1.6rem; font-weight: 700; letter-spacing: -.025em;
  color: var(--text);
}
.form-head p { margin: 0; color: var(--text-dim); font-size: .92rem; }

.field { display: flex; flex-direction: column; gap: .4rem; }

label {
  font-size: .72rem; font-weight: 600; color: var(--text-mute);
  letter-spacing: .05em; text-transform: uppercase;
}

.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon {
  position: absolute; left: .9rem;
  width: 18px; height: 18px;
  color: var(--text-mute); pointer-events: none;
  transition: color .2s ease;
}
input {
  width: 100%;
  padding: .9rem 1rem .9rem 2.6rem;
  background: var(--input-bg);
  border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--text); font-size: .95rem; font-family: inherit;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  box-sizing: border-box; color-scheme: dark;
}
:root[data-tema="claro"] input { color-scheme: light; }
input::placeholder { color: var(--text-mute); }
input:hover { border-color: var(--border-strong); }
input:focus {
  outline: none; border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(212,255,58,.12);
}
.input-wrap:focus-within .input-icon { color: var(--accent); }

button[type='submit'] {
  margin-top: .5rem; width: 100%;
  padding: .95rem 1rem; border: none; border-radius: var(--radius);
  background: linear-gradient(180deg, var(--accent) 0%, #b8e628 100%);
  color: #07090f; font-size: .98rem; font-weight: 700;
  letter-spacing: -.005em; cursor: pointer;
  transition: transform .15s ease, box-shadow .2s ease, opacity .2s ease;
  box-shadow: 0 10px 30px -12px rgba(212,255,58,.55), inset 0 1px 0 rgba(255,255,255,.35);
  font-family: inherit;
}
button[type='submit']:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 36px -12px rgba(212,255,58,.7), inset 0 1px 0 rgba(255,255,255,.4);
}
button[type='submit']:active:not(:disabled) { transform: translateY(0); }
button[type='submit']:disabled { opacity: .6; cursor: not-allowed; }

.loading { display: inline-flex; align-items: center; gap: .55rem; }
.spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(7,9,15,.3); border-top-color: #07090f;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.erro {
  display: flex; align-items: center; gap: .5rem;
  margin: .25rem 0 0; padding: .7rem .9rem;
  color: var(--danger);
  background: rgba(255,107,122,.08);
  border: 1px solid rgba(255,107,122,.25);
  border-radius: var(--radius); font-size: .88rem;
}
.erro svg { width: 16px; height: 16px; flex-shrink: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.foot-note {
  margin: .5rem 0 0; text-align: center;
  color: var(--text-mute); font-size: .85rem;
}
.foot-note a { color: var(--accent); text-decoration: none; font-weight: 600; }
.foot-note a:hover { text-decoration: underline; }

/* ---------- Desktop ---------- */
@media (min-width: 900px) {
  .login-shell { grid-template-columns: 1.05fr 1fr; }
  .brand-panel { display: flex; }
  .mobile-mark, .mobile-eyebrow { display: none; }
  .form-panel { padding: 2.5rem 1.5rem; min-height: 100vh; background: var(--bg); }
  :root[data-tema="claro"] .form-panel { background: var(--bg); }
  .glow-mobile-1, .glow-mobile-2 { display: none; }
  .login-card { background: transparent; border: 0; padding: 0; backdrop-filter: none; }
  .form-head h1 { font-size: 1.85rem; }
}
</style>
