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
        <span class="eyebrow"><span class="dot" /> Histórico</span>
        <h1>Jornadas</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <article
        v-for="j in jornadas"
        :key="j.id"
        :class="{ ativa: j.status === 'EM_ANDAMENTO' }"
      >
        <div class="linha">
          <strong>{{ data(j.data) }}</strong>
          <div class="acoes">
            <span
              class="badge"
              :class="{ aberta: j.status === 'EM_ANDAMENTO' }"
            >
              {{ j.status === 'EM_ANDAMENTO' ? 'Aberta' : 'Encerrada' }}
            </span>

            <button
              class="ic-btn"
              title="Editar"
              aria-label="Editar jornada"
              @click="abrirEdicao(j)"
            >
              <IconeApp nome="editar" :tamanho="16" />
            </button>

            <button
              class="ic-btn danger"
              title="Excluir"
              aria-label="Excluir jornada"
              @click="pedirExclusao(j)"
            >
              <IconeApp nome="excluir" :tamanho="16" />
            </button>
          </div>
        </div>
        <span class="horario">{{ j.horarioInicio?.slice(0,5) }} <b>→</b> {{ j.horarioFim?.slice(0,5) || 'Em andamento' }}</span>
      </article>
      <p v-if="!jornadas.length" class="vazio">Nenhuma jornada cadastrada.</p>
    </main>

    <!-- Modal de edição -->
    <transition name="fade">
      <div v-if="editando" class="overlay" @click.self="fecharEdicao">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-edicao">
          <header class="modal-head">
            <h2 id="titulo-edicao">Editar jornada</h2>
            <button class="fechar" aria-label="Fechar" @click="fecharEdicao">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <form class="modal-body" @submit.prevent="salvar">
            <label class="campo">
              <span>Data</span>
              <input v-model="form.data" type="date" required />
            </label>
            <div class="dupla">
              <label class="campo">
                <span>Início</span>
                <input v-model="form.horarioInicio" type="time" required />
              </label>
              <label class="campo">
                <span>Fim</span>
                <input v-model="form.horarioFim" type="time" required />
              </label>
            </div>

            <p v-if="erro" class="erro">{{ erro }}</p>

            <div class="modal-foot">
              <button type="button" class="btn-sec" @click="fecharEdicao">Cancelar</button>
              <button type="submit" class="btn-pri" :disabled="salvando">{{ salvando ? 'Salvando...' : 'Salvar alterações' }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de confirmação de exclusão -->
    <transition name="modal">
      <div
        v-if="aExcluir"
        class="modal-backdrop"
        @click.self="cancelarExclusao"
      >
        <div
          class="modal-card confirm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-titulo"
        >
          <div class="confirm-icon"><IconeApp nome="excluir" :tamanho="24" /></div>

          <h2 id="confirm-titulo">
            Excluir esta jornada?
          </h2>

          <p class="confirm-texto">
            Esta ação não pode ser desfeita.
          </p>

          <div class="confirm-resumo">
            <span>{{ data(aExcluir.data) }}</span>

            <b>
              {{ aExcluir.horarioInicio?.slice(0, 5) }}
              →
              {{ aExcluir.horarioFim?.slice(0, 5) || 'Em andamento' }}
            </b>
          </div>

          <div class="modal-acoes">
            <button
              class="btn-sec"
              :disabled="excluindo"
              @click="cancelarExclusao"
            >
              Cancelar
            </button>

            <button
              class="btn-danger"
              :disabled="excluindo"
              @click="confirmarExclusao"
            >
              {{ excluindo ? 'Excluindo…' : 'Excluir' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, onUnmounted } from 'vue'
import IconeApp from '@/components/IconeApp.vue'
import { useRouter } from 'vue-router'
import { jornadaService } from '@/services/jornadaService'
import { formatarDataBrasileira } from '@/utils/data'

const router = useRouter()
const jornadas = ref<any[]>([])
const editando = ref<any | null>(null)
const salvando = ref(false)
const erro = ref('')
const form = reactive({ data: '', horarioInicio: '', horarioFim: '' })
const aExcluir = ref<any | null>(null)
const excluindo = ref(false)

onMounted(() => {
  carregar()
  window.addEventListener('keydown', aoTeclar)
})

onUnmounted(() => {
  window.removeEventListener('keydown', aoTeclar)
})

async function carregar() {
  jornadas.value = await jornadaService.listar()
}

function data(v: string) {
  return formatarDataBrasileira(v)
}

function abrirEdicao(j: any) {
  erro.value = ''
  editando.value = j
  form.data = j.data ?? ''
  form.horarioInicio = (j.horarioInicio ?? '').slice(0, 5)
  form.horarioFim = (j.horarioFim ?? '').slice(0, 5)
}

function fecharEdicao() {
  editando.value = null
  salvando.value = false
  erro.value = ''
}

function pedirExclusao(j: any) {
  aExcluir.value = j
}

function cancelarExclusao() {
  if (excluindo.value) return

  aExcluir.value = null
  erro.value = ''
}

function aoTeclar(e: KeyboardEvent) {
  if (e.key !== 'Escape') return

  if (aExcluir.value) {
    cancelarExclusao()
    return
  }

  if (editando.value) {
    fecharEdicao()
  }
}

async function confirmarExclusao() {
  if (!aExcluir.value) return

  excluindo.value = true
  erro.value = ''

  try {
    await jornadaService.excluir(aExcluir.value.id)

    aExcluir.value = null

    await carregar()
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao excluir jornada.'
  } finally {
    excluindo.value = false
  }
}

async function salvar() {
  if (!form.data || !form.horarioInicio || !form.horarioFim) {
    erro.value = 'Preencha data, início e fim.'
    return
  }
  salvando.value = true
  erro.value = ''
  try {
    await jornadaService.atualizar(editando.value.id, {
      data: form.data,
      horarioInicio: form.horarioInicio,
      horarioFim: form.horarioFim,
    })
    fecharEdicao()
    await carregar()
  } catch (e: any) {
    erro.value = e.userMessage || 'Erro ao salvar.'
    salvando.value = false
  }
}
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
.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:.6rem}
article{padding:1rem 1.1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);display:flex;flex-direction:column;gap:.35rem}
article.ativa{border-color:rgba(212,255,58,.35);background:linear-gradient(160deg,rgba(212,255,58,.05),transparent)}
.linha{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.acoes{display:flex;align-items:center;gap:.5rem}
strong{font-size:.95rem;color:var(--text)}
.horario{color:var(--text-dim);font-size:.82rem}
.horario b{color:var(--accent);font-weight:600;margin:0 .25rem}
.badge{font-size:.68rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:.25rem .55rem;border-radius:var(--radius);background:rgba(255,255,255,.04);color:var(--text-mute);border:1px solid var(--border)}
.badge.aberta{background:rgba(212,255,58,.12);color:var(--accent);border-color:rgba(212,255,58,.3)}
.ic-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text-dim);cursor:pointer;font-size:.9rem;transition:all .15s ease}
.ic-btn:hover{border-color:var(--accent);color:var(--accent)}
.vazio{text-align:center;color:var(--text-mute);padding:2rem}

/* Modal */
.overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:1.1rem;background:rgba(4,7,14,.62);backdrop-filter:blur(6px)}
.modal{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--border);border-radius:calc(var(--radius) + 4px);box-shadow:0 30px 70px -30px rgba(0,0,0,.7);overflow:hidden}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:1.05rem 1.15rem;border-bottom:1px solid var(--border)}
.modal-head h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-.01em}
.fechar{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text-dim);cursor:pointer}
.fechar:hover{border-color:var(--accent);color:var(--accent)}
.fechar svg{width:16px;height:16px}
.modal-body{padding:1.15rem;display:flex;flex-direction:column;gap:.9rem}
.dupla{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
.campo{display:flex;flex-direction:column;gap:.35rem}
.campo span{font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-mute)}
.campo input{padding:.6rem .7rem;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);font-size:.9rem;font-family:inherit}
.campo input:focus{outline:none;border-color:var(--accent)}
.erro{margin:0;color:#ff6b6b;font-size:.82rem}
.modal-foot{display:flex;justify-content:flex-end;gap:.6rem;margin-top:.25rem}
.btn-sec{padding:.6rem .95rem;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);font-weight:600;font-size:.85rem;cursor:pointer}
.btn-sec:hover{border-color:var(--accent);color:var(--accent)}
.btn-pri{padding:.6rem 1.05rem;border-radius:var(--radius);border:none;background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-weight:700;font-size:.85rem;cursor:pointer;box-shadow:0 8px 24px -12px rgba(212,255,58,.55),inset 0 1px 0 rgba(255,255,255,.35)}
.btn-pri:disabled{opacity:.6;cursor:not-allowed}

.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}

.ic-btn:hover{
  border-color:var(--accent);
  color:var(--accent)
}

.ic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius);
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border);
  color: var(--text-dim);
  cursor: pointer;
  font-size: .9rem;
  transition: all .15s ease;
}

.ic-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.ic-btn.danger {
  background: rgba(255, 107, 122, .08);
  border-color: rgba(255, 107, 122, .25);
  color: var(--danger);
}

.ic-btn.danger:hover {
  background: rgba(255, 107, 122, .16);
  border-color: var(--danger);
}

/* Modal de confirmação */

.modal.confirm {
  max-width: 400px;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  background: rgba(255, 107, 122, .1);
  border: 1px solid rgba(255, 107, 122, .3);
}

.modal.confirm h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
}

.confirm-texto {
  margin: 0;
  font-size: .85rem;
  color: var(--text-mute);
}

.confirm-resumo {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .7rem .9rem;
  border-radius: var(--radius);
  background: var(--input-bg, rgba(255,255,255,.03));
  border: 1px solid var(--border);
  font-size: .85rem;
  color: var(--text-dim);
}

.confirm-resumo b {
  color: var(--accent);
}

.modal.confirm .modal-foot {
  width: 100%;
}

.modal.confirm .modal-foot > * {
  flex: 1;
}

.btn-sec,
.btn-danger {
  padding: .7rem .9rem;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: .85rem;
  cursor: pointer;
  font-family: inherit;
  transition: all .2s;
}

.btn-sec {
  background: rgba(212,255,58,.08);
  border: 1px solid rgba(212,255,58,.22);
  color: var(--accent);
}

.btn-sec:hover:not(:disabled) {
  background: rgba(212,255,58,.16);
}

.btn-danger {
  background: linear-gradient(
    180deg,
    var(--danger) 0%,
    #e05464 100%
  );
  border: 1px solid rgba(255,107,122,.4);
  color: #1a0508;
}

.btn-danger:hover:not(:disabled) {
  filter: brightness(1.08);
}

.btn-sec:disabled,
.btn-danger:disabled {
  opacity: .55;
  cursor: not-allowed;
}

/* ---------- Modais ---------- */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  padding: 1rem;

  background: rgba(3, 6, 12, .6);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

@media (min-width: 560px) {
  .modal-backdrop {
    align-items: center;
  }
}

.modal-card {
  width: 100%;
  max-width: 460px;

  box-sizing: border-box;

  background: var(--surface);

  border: 1px solid var(--border-strong, var(--border));

  border-radius: calc(var(--radius) + 6px);

  padding: 1.25rem;

  box-shadow: 0 24px 60px -20px rgba(0,0,0,.65);

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Modal de confirmação */

.modal-card.confirm {
  max-width: 400px;
  align-items: center;
  text-align: center;
}

.confirm-icon {
  width: 56px;
  height: 56px;

  border-radius: 50%;

  display: grid;
  place-items: center;

  font-size: 1.5rem;

  background: rgba(255,107,122,.1);
  border: 1px solid rgba(255,107,122,.3);
}

.modal-card.confirm h2 {
  margin: 0;

  font-size: 1.1rem;
  font-weight: 700;

  color: var(--text);
}

.confirm-texto {
  margin: 0;

  font-size: .85rem;
  color: var(--text-mute);
}

.confirm-resumo {
  width: 100%;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: .7rem .9rem;

  border-radius: var(--radius);

  background: var(--input-bg, rgba(255,255,255,.03));

  border: 1px solid var(--border);

  font-size: .85rem;
  color: var(--text-dim);
}

.confirm-resumo b {
  color: var(--accent);
}

/* Botões */

.modal-acoes {
  width: 100%;

  display: flex;

  gap: .5rem;

  flex-wrap: wrap;
}

.modal-acoes > * {
  flex: 1;
  min-width: 110px;
}

.btn-sec,
.btn-danger {
  padding: .7rem .9rem;

  border-radius: var(--radius);

  font-weight: 700;
  font-size: .85rem;

  cursor: pointer;

  font-family: inherit;

  transition: all .2s;
}

.btn-sec {
  background: rgba(212,255,58,.08);

  border: 1px solid rgba(212,255,58,.22);

  color: var(--accent);
}

.btn-sec:hover:not(:disabled) {
  background: rgba(212,255,58,.16);
}

.btn-danger {
  background: linear-gradient(
    180deg,
    var(--danger) 0%,
    #e05464 100%
  );

  border: 1px solid rgba(255,107,122,.4);

  color: #1a0508;
}

.btn-danger:hover:not(:disabled) {
  filter: brightness(1.08);
}

.btn-sec:disabled,
.btn-danger:disabled {
  opacity: .55;
  cursor: not-allowed;
}
</style>
