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
        <span class="eyebrow"><span class="dot" /> Motorista</span>
        <h1>Perfil</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <form class="formulario" @submit.prevent="salvar">
        <h2>Dados pessoais</h2>
        <div class="field"><label>Nome</label><input v-model="nome" required /></div>
        <div class="field"><label>E-mail</label><input :value="perfil?.email" disabled /></div>
        <button class="salvar">Salvar perfil</button>
      </form>

      <form class="formulario" @submit.prevent="alterarSenha">
        <h2>Alterar senha</h2>
        <div class="field"><label>Senha atual</label><input v-model="senhaAtual" type="password" required /></div>
        <div class="field"><label>Nova senha</label><input v-model="novaSenha" type="password" minlength="8" required /></div>
        <button class="salvar">Alterar senha</button>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { perfilService } from '@/services/perfilService'
import type { PerfilResponse } from '@/types'
const router = useRouter(), perfil = ref<PerfilResponse | null>(null), nome = ref(''), senhaAtual = ref(''), novaSenha = ref(''), mensagem = ref('')
onMounted(async () => { perfil.value = await perfilService.obter(); nome.value = perfil.value.nome })
async function salvar() { try { perfil.value = await perfilService.atualizar({ nome: nome.value }); mensagem.value = 'Perfil atualizado.' } catch (e: any) { mensagem.value = e.userMessage || 'Não foi possível atualizar.' } }
async function alterarSenha() { try { await perfilService.alterarSenha({ senhaAtual: senhaAtual.value, novaSenha: novaSenha.value }); senhaAtual.value = ''; novaSenha.value = ''; mensagem.value = 'Senha alterada.' } catch (e: any) { mensagem.value = e.userMessage || 'Não foi possível alterar a senha.' } }
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden;padding-bottom:2rem}
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
.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}
.formulario{display:flex;flex-direction:column;gap:.85rem;padding:1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.formulario h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-.01em}
.field{display:flex;flex-direction:column;gap:.4rem}
label{font-size:.72rem;color:var(--text-mute);font-weight:600;letter-spacing:.05em;text-transform:uppercase}
input{width:100%;padding:.85rem 1rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;font-family:inherit;box-sizing:border-box;transition:all .2s}
input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgba(212,255,58,.12)}
input:disabled{opacity:.7}
.salvar{margin-top:.35rem;padding:.95rem 1rem;border:none;border-radius:var(--radius);background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-size:.98rem;font-weight:700;cursor:pointer;box-shadow:0 10px 30px -12px rgba(212,255,58,.55),inset 0 1px 0 rgba(255,255,255,.35);font-family:inherit;transition:transform .15s,box-shadow .2s}
.salvar:hover{transform:translateY(-1px);box-shadow:0 14px 36px -12px rgba(212,255,58,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.mensagem{margin:0;padding:.75rem .9rem;border-radius:var(--radius);font-size:.88rem;text-align:center;color:var(--accent-2);background:rgba(124,245,196,.08);border:1px solid rgba(124,245,196,.25)}
</style>
