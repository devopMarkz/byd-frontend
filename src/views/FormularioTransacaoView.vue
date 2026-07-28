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
        <span class="eyebrow"><span class="dot" /> {{ tipo === 'ENTRADA' ? 'Entrada' : 'Saída' }}</span>
        <h1>{{ edicao ? 'Editar' : 'Nova' }} {{ tipo === 'ENTRADA' ? 'entrada' : 'saída' }}</h1>
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
      <form class="formulario" @submit.prevent="aoSalvar">
        <div class="row">
          <div class="field"><label>Data</label><input v-model="data" type="date" required /></div>
          <div class="field"><label>Dia da semana</label><input :value="diaSemana" disabled /></div>
        </div>
        <div class="field"><label>Valor</label><input id="valor" v-model.number="valor" type="number" step="0.01" min="0.01" required /></div>

        <template v-if="tipo === 'ENTRADA'">
          <div class="field"><label>Origem</label><select id="origem" v-model="origemId" required><option value="">Selecione</option><option v-for="origem in origens" :key="origem.id" :value="origem.id">{{ origem.nome }}</option></select></div>
          <div class="row">
            <div class="field"><label>Viagens</label><input id="viagens" v-model.number="quantidadeViagens" type="number" min="0" required /></div>
            <div class="field"><label>KM rodados</label><input id="km-rodados" v-model.number="quilometrosRodados" type="number" step="0.1" min="0" required /></div>
          </div>
          <button type="button" class="secundario" @click="puxarUltimaJornada">Puxar última jornada</button>
          <div class="row">
            <div class="field"><label>Jornada - início</label><input v-model="jornadaInicio" type="datetime-local" /></div>
            <div class="field"><label>Jornada - fim</label><input v-model="jornadaFim" type="datetime-local" /></div>
          </div>
          <div class="field"><label>Horas trabalhadas</label><input v-model="horasTrabalhadasTexto" type="text" placeholder="HH:mm" maxlength="5" @input="formatarHorasInput" @blur="atualizarHorasManuais" /></div>
          <div v-if="notaAtual" class="nota-atual" id="nota-fiscal-entrada">
            <p><strong>Nota fiscal:</strong> {{ notaAtualNome }}</p>
            <div class="acoes-nota">
              <button type="button" class="secundario" @click="baixarNotaAtual"><IconeApp nome="baixar" :tamanho="16" />Baixar</button>
              <button type="button" class="perigo" @click="apagarNotaAtual"><IconeApp nome="excluir" :tamanho="16" />Apagar</button>
            </div>
          </div>
          <div v-else class="field"><label>Comprovante</label><input accept="application/pdf,image/jpeg,image/png" type="file" @change="lerNota" /></div>
        </template>

        <template v-else>
          <div class="field"><label>Categoria</label><select id="categoria" v-model="categoriaSaidaId" required><option value="">Selecione</option><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nome }}</option></select></div>
          <div class="field"><label>Tipo de gasto</label><select id="tipo-gasto" v-model="tipoGasto"><option value="DIARIO_SEMANAL">Diário/Semanal</option><option value="MENSAL_PONTUAL">Mensal/Pontual</option></select></div>
          <div class="field"><label>Forma de pagamento</label><select id="forma-pagamento" v-model="formaPagamentoId"><option value="">Não informada</option><option v-for="f in formas" :key="f.id" :value="f.id">{{ f.nome }}</option></select></div>
          <div class="field"><label>Item de manutenção</label><input id="item-manutencao" v-model="itemManutencao" /></div>
          <div v-if="notaAtual" class="nota-atual" id="nota-fiscal-despesa">
            <p><strong>Nota fiscal:</strong> {{ notaAtualNome }}</p>
            <div class="acoes-nota">
              <button type="button" class="secundario" @click="baixarNotaAtual"><IconeApp nome="baixar" :tamanho="16" />Baixar</button>
              <button type="button" class="perigo" @click="apagarNotaAtual"><IconeApp nome="excluir" :tamanho="16" />Apagar</button>
            </div>
          </div>
          <div v-else class="field"><label>Nota fiscal</label><input id="nota-fiscal-despesa" accept="application/pdf,image/jpeg,image/png" type="file" @change="lerNota" /></div>
        </template>

        <div class="field"><label>Observação</label><textarea v-model="observacao" rows="3" id="observacao" /></div>
        <p v-if="erro" class="mensagem erro">{{ erro }}</p>
        <button class="salvar" :disabled="salvando">{{ salvando ? 'Salvando...' : 'Salvar' }}</button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import '@/assets/driver-custom.css'
import { useRoute, useRouter } from 'vue-router'
import IconeApp from '@/components/IconeApp.vue'
import { duracaoParaHoras, formatarDuracao } from '@/utils/duracao'
import { origemService } from '@/services/origemService'; import { categoriaSaidaService } from '@/services/categoriaSaidaService'; import { formaPagamentoService } from '@/services/formaPagamentoService'; import { receitaService } from '@/services/receitaService'; import { despesaService } from '@/services/despesaService'; import { jornadaService } from '@/services/jornadaService'; import { dataAtualBrasil } from '@/utils/data'
const router=useRouter(), route=useRoute(), edicao=Boolean(route.params.id), tipo=ref<'ENTRADA'|'SAIDA'>(route.query.tipo==='SAIDA'?'SAIDA':'ENTRADA'), data=ref(dataAtualBrasil()), diaSemana=ref(''), valor=ref<number>(), origemId=ref(''), quantidadeViagens=ref(0), quilometrosRodados=ref(0), horasTrabalhadas=ref(0), jornadaId=ref<string|null>(null), jornadaInicio=ref(''), jornadaFim=ref(''), categoriaSaidaId=ref(''), formaPagamentoId=ref(''), tipoGasto=ref('DIARIO_SEMANAL'), itemManutencao=ref(''), observacao=ref(''), notaFiscalBase64=ref<string|null>(null), notaFiscalNome=ref<string|null>(null), notaFiscalTipo=ref<string|null>(null), notaAtual=ref(false), notaAtualNome=ref(''), origens=ref<any[]>([]), categorias=ref<any[]>([]), formas=ref<any[]>([]), salvando=ref(false), erro=ref('')
const horasTrabalhadasTexto=ref(formatarDuracao(0))
function atualizarDia(){diaSemana.value=new Intl.DateTimeFormat('pt-BR',{weekday:'long'}).format(new Date(`${data.value}T12:00:00`))}
function calcularHoras(){if(!jornadaInicio.value||!jornadaFim.value)return;const diferenca=new Date(jornadaFim.value).getTime()-new Date(jornadaInicio.value).getTime();horasTrabalhadas.value=Math.max(0,Number((diferenca/3600000).toFixed(2)));horasTrabalhadasTexto.value=formatarDuracao(horasTrabalhadas.value)}
function formatarHorasInput(){let valor=horasTrabalhadasTexto.value.replace(/\D/g,'');if(valor.length>4)valor=valor.slice(0,4);if(valor.length>=3){horasTrabalhadasTexto.value=valor.slice(0,-2)+':'+valor.slice(-2)}else{horasTrabalhadasTexto.value=valor}}
function atualizarHorasManuais(){const horas=duracaoParaHoras(horasTrabalhadasTexto.value);if(horas===null){erro.value='Informe as horas no formato HH:mm, por exemplo 06:39 ou 32:02.';horasTrabalhadasTexto.value=formatarDuracao(horasTrabalhadas.value);return}erro.value='';horasTrabalhadas.value=horas;horasTrabalhadasTexto.value=formatarDuracao(horas)}
async function puxarUltimaJornada(){const lista=await jornadaService.listar();const jornada=lista.find(j=>j.status==='ENCERRADA'&&j.horarioFim);if(!jornada){erro.value='Nenhuma jornada encerrada encontrada.';return}jornadaId.value=jornada.id;jornadaInicio.value=`${jornada.data}T${jornada.horarioInicio.slice(0,5)}`;jornadaFim.value=`${jornada.data}T${jornada.horarioFim!.slice(0,5)}`;data.value=jornada.data;if(jornada.horasTrabalhadas!==undefined){horasTrabalhadas.value=jornada.horasTrabalhadas;horasTrabalhadasTexto.value=formatarDuracao(jornada.horasTrabalhadas)}else{calcularHoras()}}
function paraDatetimeLocal(valor?:string){return valor?valor.slice(0,16):''}
watch(data,atualizarDia,{immediate:true})
watch(horasTrabalhadas,valor=>{horasTrabalhadasTexto.value=formatarDuracao(valor)})
function aoSalvar(){if(tipo.value==='ENTRADA'){atualizarHorasManuais();if(erro.value)return;if((jornadaInicio.value&&!jornadaFim.value)||(!jornadaInicio.value&&jornadaFim.value)){erro.value='Informe início e fim da jornada, ou deixe os dois campos em branco.';return}}salvar()}
function lerNota(evento:Event){const arquivo=(evento.target as HTMLInputElement).files?.[0];if(!arquivo)return;if(arquivo.size>5*1024*1024){erro.value='O arquivo deve ter no máximo 5 MB.';return}const leitor=new FileReader();leitor.onload=()=>notaFiscalBase64.value=String(leitor.result);leitor.readAsDataURL(arquivo);notaFiscalNome.value=arquivo.name;notaFiscalTipo.value=arquivo.type}
async function baixarNotaAtual(){if(!edicao)return;try{const blob=tipo.value==='ENTRADA'?await receitaService.baixarNotaFiscal(String(route.params.id)):await despesaService.baixarNotaFiscal(String(route.params.id));const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=notaAtualNome.value;a.click();URL.revokeObjectURL(url)}catch(e:any){erro.value=e.userMessage||'Erro ao baixar nota fiscal.'}}
async function apagarNotaAtual(){if(!confirm('Deseja apagar a nota fiscal?'))return;try{tipo.value==='ENTRADA'?await receitaService.apagarNotaFiscal(String(route.params.id)):await despesaService.apagarNotaFiscal(String(route.params.id));notaAtual.value=false;notaAtualNome.value=''}catch(e:any){erro.value=e.userMessage||'Erro ao apagar nota fiscal.'}}
onMounted(async()=>{[origens.value,categorias.value,formas.value]=await Promise.all([origemService.listar(),categoriaSaidaService.listar(),formaPagamentoService.listar()]);const registro=route.query.dados?JSON.parse(String(route.query.dados)):null;if(registro){data.value=registro.data;valor.value=registro.valor;origemId.value=registro.origemId||'';categoriaSaidaId.value=registro.categoriaSaidaId||'';formaPagamentoId.value=registro.formaPagamentoId||'';observacao.value=registro.observacao||'';quantidadeViagens.value=registro.quantidadeViagens||0;quilometrosRodados.value=registro.quilometrosRodados||0;horasTrabalhadas.value=registro.horasTrabalhadas||0;jornadaId.value=registro.jornadaId||null;tipoGasto.value=registro.tipoGasto||'DIARIO_SEMANAL';itemManutencao.value=registro.itemManutencao||'';notaAtual.value=registro.possuiNotaFiscal||false;notaAtualNome.value=registro.notaFiscalNome||'nota_fiscal';if(registro.dataHoraInicio){jornadaInicio.value=paraDatetimeLocal(registro.dataHoraInicio)}else if(registro.data&&registro.horario){jornadaInicio.value=`${registro.data}T${registro.horario.slice(0,5)}`}if(registro.dataHoraFim){jornadaFim.value=paraDatetimeLocal(registro.dataHoraFim)}else if(jornadaInicio.value&&registro.horasTrabalhadas){const inicioMs=new Date(jornadaInicio.value).getTime();jornadaFim.value=new Date(inicioMs+registro.horasTrabalhadas*3600000).toISOString().slice(0,16)}}})
async function salvar(){if(!valor.value)return;salvando.value=true;erro.value='';try{if(tipo.value==='ENTRADA'){const horario=jornadaInicio.value?jornadaInicio.value.split('T')[1].slice(0,5)+':00':'12:00:00';const dados:any={valor:valor.value,data:data.value,horario:horario,dataHoraInicio:jornadaInicio.value,dataHoraFim:jornadaFim.value,origemId:origemId.value,jornadaId:jornadaId.value,diaSemana:diaSemana.value,quantidadeViagens:quantidadeViagens.value,quilometrosRodados:quilometrosRodados.value,horasTrabalhadas:horasTrabalhadas.value,notaFiscalBase64:notaFiscalBase64.value,notaFiscalNome:notaFiscalNome.value,notaFiscalTipo:notaFiscalTipo.value,observacao:observacao.value||null};edicao?await receitaService.atualizar(String(route.params.id),dados):await receitaService.registrar(dados)}else{const dados:any={valor:valor.value,data:data.value,categoriaSaidaId:categoriaSaidaId.value,formaPagamentoId:formaPagamentoId.value||null,diaSemana:diaSemana.value,tipoGasto:tipoGasto.value,itemManutencao:itemManutencao.value||null,notaFiscalBase64:notaFiscalBase64.value,notaFiscalNome:notaFiscalNome.value,notaFiscalTipo:notaFiscalTipo.value,observacao:observacao.value||null};edicao?await despesaService.atualizar(String(route.params.id),dados):await despesaService.registrar(dados)}router.replace({path:'/transacoes',query:{tipo:tipo.value==='ENTRADA'?'E':'S'}})}catch(e:any){erro.value=e.userMessage||'Erro ao salvar.'}finally{salvando.value=false}}

function iniciarTutorial() {
  const steps = tipo.value === 'ENTRADA' ? [
    {
      element: '.voltar',
      popover: {
        title: 'Voltar',
        description: 'Clique para voltar para a lista de transações.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(1) input',
      popover: {
        title: 'Data',
        description: 'Selecione a data em que recebeu o valor.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(2) input',
      popover: {
        title: 'Dia da semana',
        description: 'Calculado automaticamente a partir da data selecionada.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#valor',
      popover: {
        title: 'Valor',
        description: 'Digite o valor total recebido das plataformas de trabalho (ganho bruto).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#origem',
      popover: {
        title: 'Origem',
        description: 'Selecione a plataforma de trabalho (Uber, 99, etc) onde recebeu o valor.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#viagens',
      popover: {
        title: 'Viagens',
        description: 'Digite o número de corridas realizadas neste período.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#km-rodados',
      popover: {
        title: 'KM rodados',
        description: 'Digite a distância total percorrida em quilômetros.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .secundario',
      popover: {
        title: 'Puxar última jornada',
        description: 'Clique para preencher automaticamente com os dados da última jornada encerrada (data, horários, horas).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .row:nth-child(6) .field:nth-child(1) input',
      popover: {
        title: 'Jornada - início',
        description: 'Selecione o horário exato que começou a trabalhar. Opcional, mas recomendado para cálculos precisos.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .row:nth-child(6) .field:nth-child(2) input',
      popover: {
        title: 'Jornada - fim',
        description: 'Selecione o horário exato que parou de trabalhar. O sistema calculará automaticamente as horas trabalhadas.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(7) input',
      popover: {
        title: 'Horas trabalhadas',
        description: 'Formato HH:mm. O sistema calcula automaticamente a partir de início e fim, mas você pode editar manualmente.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(8) input',
      popover: {
        title: 'Comprovante',
        description: 'Anexe a nota fiscal ou comprovante da receita (opcional). Máximo 5 MB.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#observacao',
      popover: {
        title: 'Observação',
        description: 'Adicione notas sobre esta receita (opcional).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .salvar',
      popover: {
        title: 'Salvar',
        description: 'Clique para registrar esta receita no sistema.',
        side: 'top',
        align: 'center'
      }
    }
  ] : [
    {
      element: '.voltar',
      popover: {
        title: 'Voltar',
        description: 'Clique para voltar para a lista de transações.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(1) input',
      popover: {
        title: 'Data',
        description: 'Selecione a data em que ocorreu a despesa.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .field:nth-child(2) input',
      popover: {
        title: 'Dia da semana',
        description: 'Calculado automaticamente a partir da data selecionada.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#valor',
      popover: {
        title: 'Valor',
        description: 'Digite o valor da despesa.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#categoria',
      popover: {
        title: 'Categoria',
        description: 'Selecione o tipo de despesa (manutenção, lavagem, alimentação, etc).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tipo-gasto',
      popover: {
        title: 'Tipo de gasto',
        description: 'Selecione se é um gasto diário/semanal (recorrente) ou mensal/pontual (ocasional).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#forma-pagamento',
      popover: {
        title: 'Forma de pagamento',
        description: 'Selecione como pagou a despesa (dinheiro, cartão, PIX, etc). Opcional.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#item-manutencao',
      popover: {
        title: 'Item de manutenção',
        description: 'Descreva o que foi reparado ou trocado (apenas para manutenções). Opcional.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#nota-fiscal-despesa',
      popover: {
        title: 'Nota fiscal',
        description: 'Anexe a nota fiscal ou comprovante da despesa (opcional). Máximo 5 MB.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#observacao',
      popover: {
        title: 'Observação',
        description: 'Adicione notas sobre esta despesa (opcional).',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '.formulario .salvar',
      popover: {
        title: 'Salvar',
        description: 'Clique para registrar esta despesa no sistema.',
        side: 'top',
        align: 'center'
      }
    }
  ]

  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Próximo',
    prevBtnText: 'Anterior',
    doneBtnText: 'Concluir',
    closeBtnText: 'Fechar',
    steps
  })

  driverObj.drive()
}
</script>


<style scoped>
.tela{position:relative;min-height:100vh;background:radial-gradient(120% 60% at 0% 0%,#0f1a24 0%,transparent 55%),linear-gradient(160deg,#0a0e18 0%,#050710 100%);color:var(--text);overflow-x:hidden;padding-bottom:2rem}
:root[data-tema="claro"] .tela{background:radial-gradient(120% 60% at 0% 0%,#eaf2ff 0%,transparent 55%),linear-gradient(160deg,#f5f7fc 0%,#eef1f8 100%)}
.ambient{position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0}
.glow-1{width:360px;height:360px;background:#d4ff3a;opacity:.09;top:-140px;left:-120px}
.glow-2{width:300px;height:300px;background:#7cf5c4;opacity:.07;bottom:-140px;right:-100px}
.topbar{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.75rem;padding:1rem 1.1rem;background:color-mix(in oklab,var(--bg) 75%,transparent);border-bottom:1px solid var(--border);backdrop-filter:blur(14px)}
.topbar-botoes{display:flex;align-items:center;gap:.5rem}
.botao-tutorial{display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;border:1px solid var(--accent);border-radius:8px;background:rgba(212,255,58,.08);color:var(--text);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .3s ease}
.botao-tutorial:hover{background:rgba(212,255,58,.15);transform:scale(1.05)}
.botao-tutorial:active{transform:scale(.95)}
.botao-tutorial svg{width:14px;height:14px;fill:var(--accent)}
.voltar{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:var(--radius);background:rgba(255,255,255,.03);border:1px solid var(--border);color:var(--text);cursor:pointer}
.voltar:hover{border-color:var(--accent);color:var(--accent)}
.voltar svg{width:18px;height:18px}
.head-txt{display:flex;flex-direction:column;gap:.15rem;min-width:0}
.eyebrow{display:inline-flex;align-items:center;gap:.4rem;font-size:.68rem;color:var(--accent);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.dot{width:5px;height:5px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent);animation:pulse 1.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
h1{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.02em}
.spacer{width:40px}
.conteudo{position:relative;z-index:1;padding:1.25rem 1.1rem;max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:1rem}
.formulario{display:flex;flex-direction:column;gap:.85rem;padding:1.25rem;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
.row{display:grid;grid-template-columns:1fr;gap:.75rem}
@media(min-width:520px){.row{grid-template-columns:1fr 1fr}}
.field{display:flex;flex-direction:column;gap:.4rem;min-width:0}
label{font-size:.72rem;color:var(--text-mute);font-weight:600;letter-spacing:.05em;text-transform:uppercase}
input,select,textarea{width:100%;max-width:100%;min-width:0;padding:.85rem 1rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius);color:var(--text);font-size:.95rem;font-family:inherit;box-sizing:border-box;transition:all .2s;appearance:none}
input[type="date"],input[type="datetime-local"],input[type="time"]{padding:.75rem .8rem}
textarea{resize:vertical;min-height:80px}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px rgba(212,255,58,.12)}
input:disabled{opacity:.7}
input[type="file"]{padding:.55rem}
.salvar{margin-top:.35rem;padding:.95rem 1rem;border:none;border-radius:var(--radius);background:linear-gradient(180deg,var(--accent) 0%,#b8e628 100%);color:#07090f;font-size:.98rem;font-weight:700;cursor:pointer;box-shadow:0 10px 30px -12px rgba(212,255,58,.55),inset 0 1px 0 rgba(255,255,255,.35);font-family:inherit;transition:transform .15s,box-shadow .2s}
.salvar:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px -12px rgba(212,255,58,.7),inset 0 1px 0 rgba(255,255,255,.4)}
.salvar:disabled{opacity:.6;cursor:not-allowed}
.secundario{padding:.65rem 1rem;border:1px solid var(--border);border-radius:var(--radius);background:rgba(255,255,255,.02);color:var(--text);font-weight:600;cursor:pointer;font-family:inherit}
.secundario:hover{border-color:var(--accent);color:var(--accent)}
.perigo{padding:.55rem 1rem;border:1px solid rgba(255,107,122,.35);border-radius:var(--radius);background:rgba(255,107,122,.08);color:var(--danger);font-weight:600;cursor:pointer;font-family:inherit}
.nota-atual{padding:.9rem 1rem;background:var(--input-bg);border:1px solid var(--border);border-radius:var(--radius)}
.nota-atual p{margin:0 0 .6rem;font-size:.85rem;color:var(--text-dim)}
.acoes-nota{display:flex;gap:.5rem}.acoes-nota button{display:inline-flex;align-items:center;justify-content:center;gap:.35rem}
.mensagem{margin:0;padding:.75rem .9rem;border-radius:var(--radius);font-size:.88rem;text-align:center}
.mensagem.erro{color:var(--danger);background:rgba(255,107,122,.08);border:1px solid rgba(255,107,122,.25)}
</style>
