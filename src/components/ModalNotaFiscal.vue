<template>
  <div v-if="visivel" class="modal-overlay" @click.self="fechar">
    <div class="modal-conteudo">
      <header>
        <div class="head-txt">
          <span class="eyebrow"><span class="dot" /> Documento</span>
          <h2>Nota Fiscal</h2>
        </div>
        <button @click="fechar" class="btn-fechar" aria-label="Fechar"><IconeApp nome="fechar" :tamanho="16" /></button>
      </header>

      <main>
        <div v-if="notaFiscalTipo?.includes('image')" class="preview-imagem">
          <img :src="notaFiscalUrl || ''" :alt="notaFiscalNome || 'Nota fiscal'" />
        </div>
        <div v-else-if="notaFiscalTipo?.includes('pdf')" class="preview-pdf">
          <div class="preview-icon"><IconeApp nome="documento" :tamanho="28" /></div>
          <p>{{ notaFiscalNome || 'nota_fiscal.pdf' }}</p>
          <small>Arquivo PDF — Clique em baixar para visualizar</small>
        </div>
        <div v-else class="preview-vazio">
          <div class="preview-icon"><IconeApp nome="anexo" :tamanho="28" /></div>
          <p>Sem nota fiscal anexada</p>
        </div>
      </main>

      <footer>
        <button v-if="possuiNota" @click="baixar" class="btn-baixar"><IconeApp nome="baixar" :tamanho="16" />Baixar</button>
        <button v-if="possuiNota && podeApagar" @click="apagar" class="btn-apagar"><IconeApp nome="excluir" :tamanho="16" />Apagar</button>
        <button @click="fechar" class="btn-cancelar">Fechar</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconeApp from '@/components/IconeApp.vue'
const props = defineProps<{
  visivel: boolean
  notaFiscalNome?: string | null
  notaFiscalTipo?: string | null
  notaFiscalUrl?: string | null
  possuiNota: boolean
  podeApagar?: boolean
}>()

const emit = defineEmits<{
  fechar: []
  baixar: []
  apagar: []
}>()

function fechar() {
  emit('fechar')
}

function baixar() {
  emit('baixar')
}

function apagar() {
  if (confirm('Deseja realmente apagar a nota fiscal?')) {
    emit('apagar')
  }
}
</script>

<style scoped>
.modal-overlay {
  --bg: #07090f; --surface: #0d111b;
  --border: #1e2636; --border-strong: #2a3446;
  --text: #eef2ff; --text-dim: #8a94ad; --text-mute: #5b6480;
  --accent: #d4ff3a; --accent-2: #7cf5c4; --danger: #ff6b7a;
  --radius: 4px;

  position: fixed; inset: 0;
  background: rgba(0, 0, 0, .75);
  backdrop-filter: blur(6px);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 1000; padding: 0;
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  animation: fadeIn .2s ease;
}
:root[data-tema="claro"] .modal-overlay {
  --surface: #ffffff;
  --border: #e2e6ee; --border-strong: #c9cfdc;
  --text: #0e1422; --text-dim: #525a6d; --text-mute: #7a8299;
  background: rgba(20, 25, 40, .45);
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-conteudo {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius) var(--radius) 0 0;
  max-width: 600px; width: 100%;
  max-height: 92vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  color: var(--text);
  animation: slideUp .25s cubic-bezier(.2,.8,.2,1);
}
@keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

header {
  padding: 1rem 1.1rem;
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  gap: .75rem;
}
.head-txt { display: flex; flex-direction: column; gap: .15rem; min-width: 0; }
.eyebrow {
  display: inline-flex; align-items: center; gap: .4rem;
  font-size: .68rem; color: var(--accent); font-weight: 600;
  letter-spacing: .06em; text-transform: uppercase;
}
.dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 8px var(--accent);
}

h2 {
  margin: 0; color: var(--text);
  font-size: 1.1rem; font-weight: 700; letter-spacing: -.02em;
}

.btn-fechar {
  flex-shrink: 0;
  width: 36px; height: 36px;
  border: 1px solid var(--border); border-radius: var(--radius);
  background: transparent; color: var(--text-dim);
  font-size: 1rem; cursor: pointer;
  display: grid; place-items: center;
  transition: all .2s;
}
.btn-fechar:hover {
  border-color: var(--accent); color: var(--accent);
  background: rgba(212,255,58,.08);
}

main {
  flex: 1; overflow-y: auto;
  padding: 1.25rem 1.1rem;
}

.preview-imagem img {
  width: 100%; border-radius: var(--radius);
  border: 1px solid var(--border);
  display: block;
}

.preview-pdf, .preview-vazio {
  text-align: center;
  padding: 2rem 1rem;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-mute);
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
}
.preview-icon { font-size: 2.2rem; opacity: .7; }
.preview-pdf p, .preview-vazio p {
  margin: 0; color: var(--text); font-weight: 600; font-size: .95rem;
  word-break: break-word;
}
.preview-pdf small { color: var(--text-mute); font-size: .78rem; }

footer {
  padding: 1rem 1.1rem calc(1rem + env(safe-area-inset-bottom, 0));
  border-top: 1px solid var(--border);
  display: flex; gap: .5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

footer button {
  border: 0; border-radius: var(--radius);
  padding: .7rem 1rem; font-weight: 700; cursor: pointer;
  font-size: .88rem; font-family: inherit;
  transition: transform .15s, box-shadow .2s, opacity .2s;
}

.btn-baixar {
  background: linear-gradient(180deg, var(--accent) 0%, #b8e628 100%);
  color: #07090f;
  box-shadow: 0 8px 24px -12px rgba(212,255,58,.55), inset 0 1px 0 rgba(255,255,255,.35);
}
.btn-baixar:hover { transform: translateY(-1px); }

.btn-apagar {
  background: rgba(255,107,122,.1);
  color: var(--danger);
  border: 1px solid rgba(255,107,122,.3) !important;
}
.btn-apagar:hover { background: rgba(255,107,122,.18); }

.btn-cancelar {
  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border) !important;
}
.btn-cancelar:hover { border-color: var(--border-strong); color: var(--text); }

@media (min-width: 640px) {
  .modal-overlay { align-items: center; padding: 16px; }
  .modal-conteudo { border-radius: var(--radius); max-height: 90vh; }
}
</style>
