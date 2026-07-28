<template>
  <div class="tela">
    <div class="ambient glow-1" />
    <div class="ambient glow-2" />

    <header class="topbar">
      <div class="head-txt">
        <span class="eyebrow"><span class="dot" /> BYD Dolphin</span>
        <h1>Configurações</h1>
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
      <router-link to="/configuracoes/perfil" class="perfil" id="perfil">
        <div class="avatar">{{ inicial }}</div>
        <div class="perfil-txt">
          <strong>{{ auth.usuario?.email }}</strong>
          <small>Perfil do motorista</small>
        </div>
        <span class="chev">›</span>
      </router-link>

      <section class="opcoes">
        <button id="categorias-entrada" @click="abrir('origens')">
          <span class="ic">◉</span>
          <div><strong>Categorias de entrada</strong><small>Origens de receita</small></div>
          <b>›</b>
        </button>
        <button id="categorias-saida" @click="abrir('categorias')">
          <span class="ic">▣</span>
          <div><strong>Categorias de saída</strong><small>Custos fixos e variáveis</small></div>
          <b>›</b>
        </button>
        <button id="formas-pagamento" @click="abrir('formas')">
          <span class="ic">◈</span>
          <div><strong>Formas de pagamento</strong><small>Gerencie as opções de pagamento</small></div>
          <b>›</b>
        </button>
        <router-link id="jornadas" to="/configuracoes/jornadas">
          <span class="ic">◷</span>
          <div><strong>Jornadas</strong><small>Consulte o histórico operacional</small></div>
          <b>›</b>
        </router-link>
        <router-link id="personalizacoes" to="/personalizacoes">
          <span class="ic">ϟ</span>
          <div><strong>Personalizações</strong><small>Tarifa padrão de energia</small></div>
          <b>›</b>
        </router-link>
        <button id="metas" @click="mensagem='Disponível em uma futura versão.'">
          <span class="ic">⌁</span>
          <div><strong>Metas</strong><small>Em breve</small></div>
          <b>›</b>
        </button>
      </section>

      <section class="tema">
        <div class="tema-txt">
          <strong>Tema escuro</strong>
          <small>Preferência salva neste dispositivo</small>
        </div>
        <label class="switch" id="toggle-tema">
          <input v-model="escuro" type="checkbox" @change="salvarTema" />
          <span class="slider"></span>
        </label>
      </section>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </main>

    <nav class="menu-inferior">
      <router-link to="/"><IconeApp nome="painel" />Painel</router-link>
      <router-link to="/transacoes"><IconeApp nome="transacoes" />Transações</router-link>
      <router-link to="/configuracoes" class="ativo"><IconeApp nome="configuracoes" />Configurações</router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { driver } from 'driver.js'
import type { Side, Alignment } from 'driver.js'
import 'driver.js/dist/driver.css'
import '@/assets/driver-custom.css'
import IconeApp from '@/components/IconeApp.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(), router = useRouter()
const escuro = ref(localStorage.getItem('tema') !== 'claro')
const mensagem = ref('')
const inicial = computed(() => auth.usuario?.email?.charAt(0).toUpperCase() ?? 'U')
function aplicarTema(){document.documentElement.dataset.tema = escuro.value ? 'escuro' : 'claro'}
function salvarTema(){localStorage.setItem('tema', escuro.value ? 'escuro' : 'claro');aplicarTema()}
function abrir(secao: string){router.push({path:'/configuracoes/cadastros',query:{secao}})}

function iniciarTutorial() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    steps: [
      {
        element: '#perfil',
        popover: {
          title: 'Perfil do motorista',
          description: 'Aqui você pode gerenciar seus dados pessoais e segurança da conta. Clique para editar nome e senha.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#categorias-entrada',
        popover: {
          title: 'Categorias de entrada',
          description: 'Cadastre as plataformas de trabalho onde você recebe corridas (Uber, 99, InDrive, etc). Isso ajuda a saber quanto ganhou em cada plataforma.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#categorias-saida',
        popover: {
          title: 'Categorias de saída',
          description: 'Cadastre os tipos de despesas do seu trabalho (manutenção, lavagem, alimentação, aluguel, etc). Organize seus custos em categorias para melhor controle financeiro.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#formas-pagamento',
        popover: {
          title: 'Formas de pagamento',
          description: 'Cadastre as formas como você paga suas despesas (dinheiro, cartão, PIX, etc). Registra como você paga seus custos para controle financeiro.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#jornadas',
        popover: {
          title: 'Jornadas',
          description: 'Visualize e gerencie todas as suas jornadas de trabalho (turnos). Permite ver histórico de turnos, editar horários e excluir jornadas.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#personalizacoes',
        popover: {
          title: 'Personalizações',
          description: 'Configure a tarifa residencial de energia elétrica (R$/kWh) para cálculo automático de recargas. Isso serve como base para cálculos automáticos de custo de recarga.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#metas',
        popover: {
          title: 'Metas',
          description: 'Funcionalidade futura para definir metas financeiras. Disponível em uma futura versão.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      },
      {
        element: '#toggle-tema',
        popover: {
          title: 'Tema escuro',
          description: 'Alterne entre tema escuro e claro conforme sua preferência. A escolha é salva neste dispositivo.',
          side: 'bottom' as Side,
          align: 'center' as Alignment
        }
      }
    ]
  })

  driverObj.drive()
}
onMounted(aplicarTema)
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden;padding-bottom:6rem}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:360px;height:360px;background:#d4ff3a;opacity:.09;top:-140px;left:-120px}
.glow-2{width:300px;height:300px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}

.topbar{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:1fr auto;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.topbar-botoes{display:flex;align-items:center;gap:.5rem}
.botao-tutorial{display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border:1px solid var(--accent);border-radius:8px;background:rgba(212,255,58,.08);color:var(--text);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s ease}
.botao-tutorial:hover{background:rgba(212,255,58,.15);transform:scale(1.05)}
.botao-tutorial:active{transform:scale(.95)}
.botao-tutorial svg{width:14px;height:14px;fill:var(--accent)}
.head-txt{display:flex;flex-direction:column;gap:.15rem}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.4rem;font-weight:700;letter-spacing:-.02em;color:var(--text)}

.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}

.perfil{display:flex;align-items:center;gap:.9rem;padding:1rem 1.1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);text-decoration:none;color:inherit;transition:all .2s}
.perfil:hover{border-color:rgba(212,255,58,.35)}
.avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:800;color:#07090f;background:linear-gradient(135deg,var(--accent),#b8e628);flex-shrink:0}
.perfil-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:.1rem}
.perfil-txt strong{font-size:.92rem;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.perfil-txt small{font-size:.75rem;color:var(--text-mute)}
.chev,.opcoes b{color:var(--text-mute);font-size:1.2rem;font-weight:400}

.opcoes{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.opcoes>*{display:flex;align-items:center;gap:.9rem;padding:1rem 1.1rem;background:transparent;border:0;border-bottom:1px solid var(--border);cursor:pointer;color:inherit;text-decoration:none;font-family:inherit;text-align:left;width:100%}
.opcoes>*:last-child{border-bottom:0}
.opcoes>*:hover{background:rgba(212,255,58,.04)}
.opcoes .ic{width:38px;height:38px;border-radius:var(--radius);display:grid;place-items:center;background:rgba(212,255,58,.08);color:var(--accent);border:1px solid rgba(212,255,58,.2);font-size:1rem;flex-shrink:0}
.opcoes div{flex:1;min-width:0;display:flex;flex-direction:column;gap:.1rem}
.opcoes strong{font-size:.92rem;color:var(--text)}
.opcoes small{font-size:.75rem;color:var(--text-mute)}

.tema{display:flex;align-items:center;gap:.9rem;padding:1rem 1.1rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.tema-txt{flex:1;display:flex;flex-direction:column;gap:.1rem}
.tema strong{font-size:.92rem;color:var(--text)}
.tema small{font-size:.75rem;color:var(--text-mute)}
.switch{position:relative;display:inline-block;width:46px;height:26px;flex-shrink:0}
.switch input{opacity:0;width:0;height:0}
.slider{position:absolute;cursor:pointer;inset:0;background:var(--border-strong);border-radius:999px;transition:.25s}
.slider::before{content:"";position:absolute;height:20px;width:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.25s}
.switch input:checked+.slider{background:var(--accent);box-shadow:0 0 12px rgba(212,255,58,.5)}
.switch input:checked+.slider::before{transform:translateX(20px);background:#07090f}

.mensagem{margin:0;padding:.75rem .9rem;border-radius:var(--radius);font-size:.88rem;text-align:center;color:var(--accent-2);background:rgba(124,245,196,.08);border:1px solid rgba(124,245,196,.25)}

.menu-inferior{position:fixed;bottom:0;left:0;right:0;display:flex;justify-content:space-around;padding:.5rem .5rem calc(.5rem + env(safe-area-inset-bottom,0));background:color-mix(in oklab,var(--bg) 75%,transparent);border-top:1px solid var(--border);backdrop-filter:blur(14px);z-index:10}
.menu-inferior a{flex:1;display:flex;flex-direction:column;align-items:center;gap:.2rem;padding:.5rem;text-decoration:none;color:var(--text-mute);font-size:.72rem;font-weight:600;border-radius:var(--radius);transition:all .2s}
.menu-inferior a :deep(.icone-app){width:20px;height:20px}
.menu-inferior .ativo{color:var(--accent)}
@media(min-width:700px){.menu-inferior{left:50%;transform:translateX(-50%);max-width:520px;bottom:16px;border-radius:var(--radius);border:1px solid var(--border)}}
</style>
