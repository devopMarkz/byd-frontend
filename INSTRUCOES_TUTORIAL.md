# Instruções para Implementação de Botões de Tutorial

Este documento contém instruções detalhadas para adicionar botões de Tutorial em cada tela do menu inferior (Painel, Transações, Configurações). Os botões permitirão que o usuário inicie um tour guiado com Driver.js específico para cada tela.

---

## Visão Geral

### Objetivo
Adicionar um botão de Tutorial em cada tela principal do sistema que, ao ser clicado, inicia um tour guiado com Driver.js explicando as funcionalidades daquela tela específica.

### Localização dos Botões
- **Posição:** Parte superior da tela, lado direito
- **Tela Painel (`/`):** Canto superior direito
- **Tela Transações (`/transacoes`):** Canto superior direito
- **Tela Configurações (`/configuracoes`):** Canto superior direito

### Documentação de Referência
- Painel: `DOCUMENTACAO_PAINEL.md`
- Transações: `DOCUMENTACAO_TRANSACOES.md`
- Configurações: `DOCUMENTACAO_CONFIGURACOES.md`

---

## Especificação do Botão

### Estilo Visual

**CSS do botão:**
```css
.botao-tutorial {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  border: 4px solid #d4ff3a; /* Cor de destaque (amarelo neon) */
  border-radius: 8px;
  background: transparent;
  color: #eef2ff; /* Texto principal */
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.botao-tutorial:hover {
  background: rgba(212, 255, 58, 0.1);
  transform: scale(1.05);
}

.botao-tutorial:active {
  transform: scale(0.95);
}

/* Ícone Play */
.botao-tutorial svg {
  width: 16px;
  height: 16px;
  fill: #d4ff3a;
}
```

**Ícone Play (SVG):**
```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 5v14l11-7z"/>
</svg>
```

### Comportamento
- Ao clicar, inicia o tour guiado com Driver.js
- O tour deve seguir a ordem recomendada na documentação específica
- O usuário pode fechar o tour a qualquer momento
- O tour deve ser reutilizável (pode ser iniciado novamente)

---

## Implementação por Tela

### 1. Tela Painel (`/`)

**Arquivo:** `src/views/PainelView.vue`

**Onde adicionar:**
- No topo do componente, dentro do `<template>`
- Posicionado como elemento fixo no canto superior direito

 Código Vue:
```vue
<template>
  <div class="painel">
    <!-- Botão de Tutorial -->
    <button class="botao-tutorial" @click="iniciarTutorialPainel">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
      </svg>
      Tutorial
    </button>

    <!-- Resto do conteúdo do Painel -->
    ...
  </div>
</template>

<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const iniciarTutorialPainel = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: 'nav.menu-inferior a[href="/"]',
        popover: {
          title: 'Menu Inferior',
          description: 'Este é o menu de navegação. Use para alternar entre Painel, Transações e Configurações.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.periodo .abas button',
        popover: {
          title: 'Seleção de Período',
          description: 'Escolha entre Diário, Semanal, Mensal, Anual ou Personalizado para analisar seus dados em diferentes escalas de tempo.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(1)',
        popover: {
          title: 'Receita (Ganho Bruto)',
          description: 'Este é o valor total que você recebeu das plataformas antes de descontar qualquer despesa.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(2)',
        popover: {
          title: 'Despesas',
          description: 'Este é o valor total de todos os seus custos (energia, manutenção, lavagem, etc).',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.resumo .cartao:nth-child(3)',
        popover: {
          title: 'Saldo (Ganho Líquido)',
          description: 'Este é o valor que realmente sobrou no seu bolso: Receita - Despesas.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.estatisticas',
        popover: {
          title: 'Estatísticas Detalhadas',
          description: 'Aqui você vê 9 métricas essenciais para analisar seu desempenho: viagens, horas, KM, R$/viagem, R$/hora, R$/KM, Lucro/viagem, Lucro/hora e Lucro/KM.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.origens .lista',
        popover: {
          title: 'Receita por Origem',
          description: 'Veja quanto ganhou em cada plataforma (Uber, 99, etc) e identifique qual é mais rentável.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.ultima-jornada',
        popover: {
          title: 'Última Jornada',
          description: 'Acompanhe rapidamente sua última atividade e veja se há uma jornada em andamento.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Controle de Jornada',
          description: 'Use este botão para iniciar ou encerrar seu turno de trabalho rapidamente.',
          side: 'left',
          align: 'center'
        }
      }
    ]
  })

  driverObj.drive()
}
</script>

<style scoped>
.botao-tutorial {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  border: 4px solid #d4ff3a;
  border-radius: 8px;
  background: transparent;
  color: #eef2ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.botao-tutorial:hover {
  background: rgba(212, 255, 58, 0.1);
  transform: scale(1.05);
}

.botao-tutorial:active {
  transform: scale(0.95);
}

.botao-tutorial svg {
  width: 16px;
  height: 16px;
  fill: #d4ff3a;
}
</style>
```

**Referência:** Consulte `DOCUMENTACAO_PAINEL.md` para mais detalhes sobre cada elemento e ordem recomendada.

---

### 2. Tela Transações (`/transacoes`)

**Arquivo:** `src/views/TransacoesNovaView.vue`

**Onde adicionar:**
- No topo do componente, dentro do `<template>`
- Posicionado como elemento fixo no canto superior direito

**Código Vue:**
```vue
<template>
  <div class="transacoes">
    <!-- Botão de Tutorial -->
    <button class="botao-tutorial" @click="iniciarTutorialTransacoes">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
      </svg>
      Tutorial
    </button>

    <!-- Resto do conteúdo de Transações -->
    ...
  </div>
</template>

<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const iniciarTutorialTransacoes = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: 'nav.menu-inferior a[href="/transacoes"]',
        popover: {
          title: 'Menu Inferior',
          description: 'Este é o menu de navegação. Use para alternar entre Painel, Transações e Configurações.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.abas button',
        popover: {
          title: 'Abas de Tipo',
          description: 'Organize suas transações em Entradas (receitas), Saídas (despesas) e Recargas (energia).',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(1) input',
        popover: {
          title: 'Filtro Data Início',
          description: 'Defina a data inicial para filtrar suas transações.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(2) input',
        popover: {
          title: 'Filtro Data Fim',
          description: 'Defina a data final para filtrar suas transações.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.filtros .field:nth-child(3) select',
        popover: {
          title: 'Filtro de Origem/Categoria',
          description: 'Filtre por plataforma de trabalho (nas Entradas) ou por tipo de despesa (nas Saídas).',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '.lista',
        popover: {
          title: 'Lista de Transações',
          description: 'Visualize todas as suas movimentações financeiras organizadas por data.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.fab',
        popover: {
          title: 'Nova Transação',
          description: 'Clique aqui para registrar uma nova receita, despesa ou recarga.',
          side: 'left',
          align: 'center'
        }
      }
    ]
  })

  driverObj.drive()
}
</script>

<style scoped>
/* Adicione o mesmo CSS do botão de tutorial aqui */
.botao-tutorial {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  border: 4px solid #d4ff3a;
  border-radius: 8px;
  background: transparent;
  color: #eef2ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.botao-tutorial:hover {
  background: rgba(212, 255, 58, 0.1);
  transform: scale(1.05);
}

.botao-tutorial:active {
  transform: scale(0.95);
}

.botao-tutorial svg {
  width: 16px;
  height: 16px;
  fill: #d4ff3a;
}
</style>
```

**Referência:** Consulte `DOCUMENTACAO_TRANSACOES.md` para mais detalhes sobre cada elemento e ordem recomendada.

---

### 3. Tela Configurações (`/configuracoes`)

**Arquivo:** `src/views/ConfiguracoesNovaView.vue`

**Onde adicionar:**
- No topo do componente, dentro do `<template>`
- Posicionado como elemento fixo no canto superior direito

**Código Vue:**
```vue
<template>
  <div class="configuracoes">
    <!-- Botão de Tutorial -->
    <button class="botao-tutorial" @click="iniciarTutorialConfiguracoes">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z"/>
      </svg>
      Tutorial
    </button>

    <!-- Resto do conteúdo de Configurações -->
    ...
  </div>
</template>

<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const iniciarTutorialConfiguracoes = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: 'nav.menu-inferior a[href="/configuracoes"]',
        popover: {
          title: 'Menu Inferior',
          description: 'Este é o menu de navegação. Use para alternar entre Painel, Transações e Configurações.',
          side: 'top',
          align: 'center'
        }
      },
      {
        element: '.perfil',
        popover: {
          title: 'Perfil do Motorista',
          description: 'Acesse aqui para gerenciar seus dados pessoais e segurança da conta.',
          side: 'left',
          align: 'center'
        }
      },
      {
        element: '.opcoes button:nth-child(1)',
        popover: {
          title: 'Categorias de Entrada',
          description: 'Cadastre aqui as plataformas de trabalho onde recebe corridas (Uber, 99, etc).',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '.opcoes button:nth-child(2)',
        popover: {
          title: 'Categorias de Saída',
          description: 'Cadastre aqui os tipos de despesas do seu trabalho (manutenção, lavagem, etc).',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '.opcoes button:nth-child(3)',
        popover: {
          title: 'Formas de Pagamento',
          description: 'Cadastre aqui as formas como você paga suas despesas (dinheiro, cartão, etc).',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '.opcoes button:nth-child(4)',
        popover: {
          title: 'Jornadas',
          description: 'Visualize e gerencie o histórico completo de seus turnos de trabalho.',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '.opcoes button:nth-child(5)',
        popover: {
          title: 'Personalizações',
          description: 'Configure aqui a tarifa de energia elétrica para cálculos automáticos de recarga.',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '.tema .switch',
        popover: {
          title: 'Tema Claro/Escuro',
          description: 'Alterne entre tema escuro (padrão) e tema claro conforme sua preferência.',
          side: 'left',
          align: 'center'
        }
      }
    ]
  })

  driverObj.drive()
}
</script>

<style scoped>
/* Adicione o mesmo CSS do botão de tutorial aqui */
.botao-tutorial {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 20px;
  border: 4px solid #d4ff3a;
  border-radius: 8px;
  background: transparent;
  color: #eef2ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.botao-tutorial:hover {
  background: rgba(212, 255, 58, 0.1);
  transform: scale(1.05);
}

.botao-tutorial:active {
  transform: scale(0.95);
}

.botao-tutorial svg {
  width: 16px;
  height: 16px;
  fill: #d4ff3a;
}
</style>
```

**Referência:** Consulte `DOCUMENTACAO_CONFIGURACOES.md` para mais detalhes sobre cada elemento e ordem recomendada.

---

## Instalação de Dependências

Antes de implementar, instale o Driver.js:

```bash
npm install driver.js
```

Ou com yarn:

```bash
yarn add driver.js
```

---

## Configuração do Driver.js

### Opções Recomendadas

```typescript
const driverObj = driver({
  showProgress: true,           // Mostra barra de progresso
  showButtons: ['next', 'previous', 'close'], // Botões de navegação
  steps: [...],                 // Array de steps do tour
  overlayColor: 'rgba(0, 0, 0, 0.75)', // Cor do overlay
  popoverClass: 'driverjs-theme', // Classe CSS para customização
  animate: true,                // Animações
  smoothScroll: true,           // Scroll suave
  allowClose: true,             // Permite fechar clicando fora
  disableActiveInteraction: true, // Desabilita interação com elemento destacado
  stagePadding: 10,             // Padding ao redor do elemento
  stageRadius: 5,               // Raio do destaque
  onHighlightStarted: (element) => {
    // Callback quando destaque começa
  },
  onHighlighted: (element, step, options) => {
    // Callback quando elemento está destacado
  },
  onDeselected: (element, step, options) => {
    // Callback quando destaque é removido
  }
})
```

### Customização do CSS do Driver.js

Adicione ao seu CSS global ou no componente:

```css
.driverjs-theme {
  --driverjs-primary-color: #d4ff3a;
  --driverjs-text-color: #eef2ff;
  --driverjs-bg-color: #0d111b;
  --driverjs-border-color: #1e2636;
  --driverjs-button-bg: #d4ff3a;
  --driverjs-button-text: #0e1422;
  --driverjs-highlight-bg: rgba(212, 255, 58, 0.1);
}

.driver-popover {
  background: #0d111b;
  border: 2px solid #d4ff3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.driver-popover-title {
  color: #d4ff3a;
  font-weight: 700;
  font-size: 18px;
}

.driver-popover-description {
  color: #eef2ff;
  font-size: 14px;
  line-height: 1.5;
}

.driver-popover-footer button {
  background: #d4ff3a;
  color: #0e1422;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.driver-popover-footer button:hover {
  background: #b8e02a;
  transform: scale(1.05);
}

.driver-popover-progress-text {
  color: #8a94ad;
  font-size: 12px;
}
```

---

## Considerações Importantes

### Responsividade
- O botão deve funcionar em mobile, tablet e desktop
- Em mobile, considere ajustar o tamanho do botão se necessário
- O tour deve adaptar a posição do popover conforme o tamanho da tela

### Estados Dinâmicos
- Alguns elementos podem não existir em certos estados (ex: lista vazia)
- Adicione verificação antes de destacar elementos que podem não existir
- Exemplo: Verificar se há itens na lista antes de destacar

### Acessibilidade
- Adicione `aria-label` ao botão: `aria-label="Iniciar tutorial desta tela"`
- O botão deve ser acessível por teclado (tab + enter)
- Adicione focus states visíveis

### Performance
- Importe o Driver.js apenas quando necessário (lazy loading)
- Limpe a instância do Driver.js quando o componente for desmontado
- Evite criar múltiplas instâncias simultâneas

### Tema Claro/Escuro
- O botão deve funcionar em ambos os temas
- Considere ajustar a cor do texto/borda conforme o tema ativo
- O CSS do Driver.js deve respeitar o tema do sistema

---

## Testes

### Checklist de Testes

1. **Botão aparece corretamente em todas as 3 telas**
2. **Botão tem o estilo especificado (borda 4px, ícone Play, texto "Tutorial")**
3. **Botão está posicionado no canto superior direito**
4. **Ao clicar, o tour inicia corretamente**
5. **Tour segue a ordem recomendada na documentação**
6. **Elementos são destacados corretamente**
7. **Popovers têm textos educativos e claros**
8. **Usuário pode navegar entre steps (próximo/anterior)**
9. **Usuário pode fechar o tour a qualquer momento**
10. **Tour funciona em mobile, tablet e desktop**
11. **Tour funciona em tema escuro e claro**
12. **Tour funciona quando elementos não existem (listas vazias)**

---

## Próximos Passos

1. Implementar o botão na tela Painel
2. Implementar o botão na tela Transações
3. Implementar o botão na tela Configurações
4. Testar cada tour individualmente
5. Ajustar textos e posições conforme necessário
6. Testar em diferentes tamanhos de tela
7. Testar em ambos os temas
8. Coletar feedback dos usuários
9. Iterar e melhorar conforme feedback

---

## Suporte

Se encontrar problemas durante a implementação:
- Consulte a documentação oficial do Driver.js: https://driverjs.com/
- Verifique os seletores CSS nos documentos de documentação específicos
- Teste os seletores no DevTools antes de usar no Driver.js
- Ajuste as opções do Driver.js conforme necessário
