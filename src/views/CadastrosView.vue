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
        <span class="eyebrow"><span class="dot" /> Configurações</span>
        <h1>{{ titulo }}</h1>
      </div>
      <span class="spacer" />
    </header>

    <main class="conteudo">
      <div class="abas" role="tablist">
        <button v-for="opcao in opcoes" :key="opcao.valor" :class="{ ativa: secao === opcao.valor }" @click="mudarSecao(opcao.valor)">{{ opcao.rotulo }}</button>
      </div>

      <form class="formulario" @submit.prevent="salvar">
        <h2>{{ editandoId ? 'Editar cadastro' : 'Novo cadastro' }}</h2>
        <div class="field"><label>Nome</label><input v-model.trim="nome" required maxlength="200" /></div>
        <div class="field" v-if="secao !== 'formas'"><label>Descrição</label><textarea v-model.trim="descricao" rows="2" maxlength="500" /></div>
        <div class="field" v-if="secao === 'categorias'">
          <label>Tipo</label>
          <select v-model="tipoCategoria">
            <option value="CUSTO_FIXO">Custo fixo</option>
            <option value="CUSTO_VARIAVEL">Custo variável</option>
          </select>
        </div>
        <!-- <div class="field" v-if="secao === 'origens'">
          <label>Imagem <small>JPG ou PNG, até 1 MB</small></label>
          <input accept="image/jpeg,image/png" type="file" @change="selecionarImagem" />
        </div> -->
        <button class="salvar" :disabled="salvando">{{ editandoId ? 'Salvar alteração' : 'Adicionar' }}</button>
        <button v-if="editandoId" class="cancelar" type="button" @click="limparFormulario">Cancelar</button>
      </form>

      <p v-if="mensagem" :class="{ erro }" class="mensagem">{{ mensagem }}</p>

      <section class="lista">
        <article v-for="item in itens" :key="item.id">
          <img v-if="secao === 'origens' && item.imagemBase64" :src="item.imagemBase64" alt="" />
          <span v-else-if="secao === 'origens'" class="avatar">{{ item.nome.charAt(0) }}</span>
          <div><strong>{{ item.nome }}</strong><small>{{ detalhe(item) }}</small></div>
          <button class="acao" aria-label="Editar" @click="editar(item)"><IconeApp nome="editar" :tamanho="16" /></button>
          <button
            class="acao excluir"
            aria-label="Excluir"
            @click="pedirExclusao(item)"
          >
            ×
          </button>
        </article>
        <p v-if="!itens.length" class="vazio">Nenhum cadastro encontrado.</p>
      </section>

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
              Excluir {{ rotuloExclusao }}?
            </h2>

            <p class="confirm-texto">
              Esta ação não pode ser desfeita.
            </p>

            <div class="confirm-resumo">
              <span>{{ aExcluir.nome }}</span>

              <b>
                {{ detalhe(aExcluir) }}
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import IconeApp from '@/components/IconeApp.vue'
import { useRoute, useRouter } from 'vue-router'
import { origemService } from '@/services/origemService'
import { categoriaSaidaService } from '@/services/categoriaSaidaService'
import { formaPagamentoService } from '@/services/formaPagamentoService'

type Secao = 'origens' | 'categorias' | 'formas'
const router = useRouter(), route = useRoute()
const opcoes = [{ valor: 'origens', rotulo: 'Entradas' }, { valor: 'categorias', rotulo: 'Saídas' }, { valor: 'formas', rotulo: 'Pagamentos' }] as const
const secao = ref<Secao>((route.query.secao as Secao) || 'origens')
const itens = ref<any[]>([]), nome = ref(''), descricao = ref(''), tipoCategoria = ref<'CUSTO_FIXO' | 'CUSTO_VARIAVEL'>('CUSTO_VARIAVEL'), imagemBase64 = ref<string | null>(null), editandoId = ref(''), salvando = ref(false), mensagem = ref(''), erro = ref(false),aExcluir = ref<any | null>(null),excluindo = ref(false)
const titulo = computed(() => opcoes.find(o => o.valor === secao.value)?.rotulo || '')
const rotuloExclusao = computed(() => {
  if (secao.value === 'origens') return 'esta entrada'
  if (secao.value === 'categorias') return 'esta categoria'
  return 'esta forma de pagamento'
})
async function carregar() { mensagem.value = ''; itens.value = secao.value === 'origens' ? await origemService.listar() : secao.value === 'categorias' ? await categoriaSaidaService.listar() : await formaPagamentoService.listar() }
function mudarSecao(valor: Secao) { secao.value = valor; router.replace({ query: { secao: valor } }); limparFormulario(); carregar() }
function limparFormulario() { nome.value = ''; descricao.value = ''; tipoCategoria.value = 'CUSTO_VARIAVEL'; imagemBase64.value = null; editandoId.value = '' }
async function salvar() { salvando.value = true; erro.value = false; mensagem.value = ''; try { if (secao.value === 'origens') { const dados = { nome: nome.value, descricao: descricao.value || null, imagemBase64: imagemBase64.value }; editandoId.value ? await origemService.editar(editandoId.value, dados) : await origemService.criar(dados) } else if (secao.value === 'categorias') { const dados = { nome: nome.value, descricao: descricao.value || null, tipo: tipoCategoria.value }; editandoId.value ? await categoriaSaidaService.editar(editandoId.value, dados) : await categoriaSaidaService.criar(dados) } else { const dados = { nome: nome.value }; editandoId.value ? await formaPagamentoService.editar(editandoId.value, dados) : await formaPagamentoService.criar(dados) }; mensagem.value = 'Cadastro salvo.'; limparFormulario(); await carregar() } catch (e: any) { erro.value = true; mensagem.value = e.userMessage || 'Não foi possível salvar.' } finally { salvando.value = false } }
function editar(item: any) { editandoId.value = item.id; nome.value = item.nome; descricao.value = item.descricao || ''; tipoCategoria.value = item.tipo || 'CUSTO_VARIAVEL'; imagemBase64.value = item.imagemBase64 || null; window.scrollTo({ top: 0, behavior: 'smooth' }) }
function pedirExclusao(item: any) {
  aExcluir.value = item
}

function cancelarExclusao() {
  if (excluindo.value) return

  aExcluir.value = null
}

async function confirmarExclusao() {
  if (!aExcluir.value) return

  excluindo.value = true
  erro.value = false
  mensagem.value = ''

  try {
    const id = aExcluir.value.id

    if (secao.value === 'origens') {
      await origemService.excluir(id)
    } else if (secao.value === 'categorias') {
      await categoriaSaidaService.excluir(id)
    } else {
      await formaPagamentoService.excluir(id)
    }

    aExcluir.value = null

    await carregar()
  } catch (e: any) {
    erro.value = true
    mensagem.value = e.userMessage || 'Não foi possível excluir.'
  } finally {
    excluindo.value = false
  }
}
function aoTeclar(e: KeyboardEvent) {
  if (e.key !== 'Escape') return

  if (aExcluir.value) {
    cancelarExclusao()
  }
}
function detalhe(item: any) { return secao.value === 'categorias' ? (item.tipo === 'CUSTO_FIXO' ? 'Custo fixo' : 'Custo variável') : item.descricao || 'Sem descrição' }
watch(() => route.query.secao, valor => { if (valor && valor !== secao.value) mudarSecao(valor as Secao) });
onMounted(() => {
  carregar()
  window.addEventListener('keydown', aoTeclar)
})

onUnmounted(() => {
  window.removeEventListener('keydown', aoTeclar)
})
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden;padding-bottom:2rem}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:360px;height:360px;background:#d4ff3a;opacity:.09;top:-140px;left:-120px}
.glow-2{width:300px;height:300px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}

.topbar{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.voltar{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);cursor:pointer;transition:all .2s}
.voltar:hover{border-color:var(--accent);color:var(--accent);background:rgba(212,255,58,.08)}
.voltar svg{width:18px;height:18px}
.head-txt{display:flex;flex-direction:column;gap:.15rem;min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.15rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}
.spacer{width:40px}

.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}

.abas{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;padding:.35rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.abas button{border:0;padding:.7rem .4rem;border-radius:var(--radius);background:transparent;color:var(--text-dim);font-weight:700;font-size:.82rem;cursor:pointer;transition:all .2s;font-family:inherit}
.abas button:hover{color:var(--text)}
.abas .ativa{background:rgba(212,255,58,.1);color:var(--accent);box-shadow:inset 0 0 0 1px rgba(212,255,58,.25)}

.formulario{display:flex;flex-direction:column;gap:.85rem;padding:1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.formulario h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-.01em}
.field{display:flex;flex-direction:column;gap:.4rem}
label{font-size:.72rem;color:var(--text-mute);font-weight:600;letter-spacing:.05em;text-transform:uppercase}
label small{text-transform:none;letter-spacing:0;font-weight:400;color:var(--text-mute);margin-left:.4rem}
input,select,textarea{width:100%;padding:.85rem 1rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;font-family:inherit;box-sizing:border-box;transition:all .2s;appearance:none}
textarea{resize:vertical;min-height:70px}
input:hover,select:hover,textarea:hover{border-color:var(--border-strong)}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgba(212,255,58,.12)}
input[type="file"]{padding:.55rem}

.salvar{margin-top:.35rem;padding:.95rem 1rem;border:none;border-radius:var(--radius);background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-size:.98rem;font-weight:700;cursor:pointer;transition:transform .15s,box-shadow .2s,opacity .2s;box-shadow:0 10px 30px -12px rgba(212,255,58,.55),inset 0 1px 0 rgba(255,255,255,.35);font-family:inherit}
.salvar:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px -12px rgba(212,255,58,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.salvar:disabled{opacity:.6;cursor:not-allowed}
.cancelar{padding:.75rem 1rem;border:1px solid var(--border);border-radius:var(--radius);background:transparent;color:var(--text-dim);font-weight:600;cursor:pointer;font-family:inherit}
.cancelar:hover{color:var(--text);border-color:var(--border-strong)}

.mensagem{margin:0;padding:.75rem .9rem;border-radius:var(--radius);font-size:.88rem;text-align:center;color:var(--accent-2);background:rgba(124,245,196,.08);border:1px solid rgba(124,245,196,.25)}
.mensagem.erro{color:var(--danger);background:rgba(255,107,122,.08);border-color:rgba(255,107,122,.25)}

.lista{display:flex;flex-direction:column;gap:.6rem}
.lista article{display:flex;align-items:center;gap:.75rem;padding:.85rem 1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.lista img,.lista .avatar{width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0}
.lista .avatar{background:rgba(212,255,58,.1);color:var(--accent);display:grid;place-items:center;font-weight:800;border:1px solid rgba(212,255,58,.25)}
.lista div{flex:1;min-width:0;display:flex;flex-direction:column;gap:.15rem}
.lista strong{font-size:.9rem;color:var(--text)}
.lista small{font-size:.72rem;color:var(--text-mute)}
.lista .acao{border:1px solid var(--border);background:rgba(255,255,255,.02);color:var(--text-dim);width:34px;height:34px;border-radius:var(--radius);cursor:pointer;font-size:.95rem;flex-shrink:0;transition:all .2s}
.lista .acao:hover{border-color:var(--accent);color:var(--accent)}
.lista .excluir:hover{border-color:var(--danger);color:var(--danger)}
.vazio{text-align:center;color:var(--text-mute);padding:1.5rem;font-size:.88rem}

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
  background: var(--surface);
  border: 1px solid var(--border-strong, var(--border));
  border-radius: calc(var(--radius) + 6px);
  padding: 1.25rem;
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, .65);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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
  background: rgba(255, 107, 122, .1);
  border: 1px solid rgba(255, 107, 122, .3);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  padding: .7rem .9rem;
  border-radius: var(--radius);
  background: var(--input-bg, rgba(255, 255, 255, .03));
  border: 1px solid var(--border);
  font-size: .85rem;
  color: var(--text-dim);
  box-sizing: border-box;
}

.confirm-resumo span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.confirm-resumo b {
  flex-shrink: 0;
  color: var(--accent);
}

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
  background: rgba(212, 255, 58, .08);
  border: 1px solid rgba(212, 255, 58, .22);
  color: var(--accent);
}

.btn-sec:hover:not(:disabled) {
  background: rgba(212, 255, 58, .16);
}

.btn-danger {
  background: linear-gradient(
    180deg,
    var(--danger) 0%,
    #e05464 100%
  );
  border: 1px solid rgba(255, 107, 122, .4);
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

/* Transições */

.modal-enter-active,
.modal-leave-active {
  transition: opacity .2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform .22s cubic-bezier(.16, 1, .3, 1);
}

.modal-enter-from .modal-card {
  transform: translateY(16px) scale(.98);
}

.modal-leave-to .modal-card {
  transform: translateY(16px) scale(.98);
}
</style>
