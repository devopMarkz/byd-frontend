# Documentação do Painel - BYD Dolphin

Esta documentação descreve todas as funcionalidades do Painel (Dashboard) do sistema. Destinada para implementação de tutoriais com Driver.js.

---

## Visão Geral

O Painel é a tela principal onde você visualiza o resumo financeiro e estatísticas do seu trabalho como motorista de aplicativo. Todas as informações são atualizadas dinamicamente conforme o período selecionado.

**Arquivo:** `src/views/PainelView.vue`

**Rota:** `/`

---

## Conceitos Importantes

### Ganho Bruto vs Ganho Líquido
- **Ganho Bruto (Receita):** É o valor total que você recebeu das plataformas, antes de descontar qualquer despesa. É o dinheiro que entra na sua conta.
- **Ganho Líquido (Lucro):** É o valor que realmente sobra no seu bolso após descontar todas as despesas (combustível/energia, manutenção, lavagem, alimentação, etc). É calculado como: Receita - Despesas.

### O que é uma "Origem"?
**Origem** refere-se às **plataformas de trabalho** onde você recebe corridas ou serviços, como:
- Uber
- 99
- InDrive
- Flash
- Outras plataformas de transporte

Cada origem representa uma fonte de receita diferente, permitindo que você acompanhe quanto ganhou em cada plataforma separadamente.

---

## Funcionalidades do Painel

### 1. Seleção de Período

Permite analisar seus dados em diferentes escalas de tempo.

**Abas disponíveis:**
- **Diário:** Analisa um único dia de trabalho
- **Semanal:** Analisa uma semana completa (7 dias)
- **Mensal:** Analisa um mês inteiro
- **Anual:** Analisa um ano completo
- **Personalizado:** Define um intervalo específico com datas de início e fim

**Campos dinâmicos:**
- Diário/Semanal: Campo de data única para selecionar o dia/semana de referência
- Mensal: Seletor de mês no formato YYYY-MM (ex: 2024-01 para janeiro de 2024)
- Anual: Campo numérico para informar o ano (ex: 2024)
- Personalizado: Dois campos "De" e "Até" para definir o intervalo personalizado

**Persistência:** A preferência de período é salva automaticamente no localStorage, então quando você voltar ao app, ele lembrará sua última seleção.

**Seletores CSS para Driver.js:**
- Abas de período: `.periodo .abas button`
- Campo de data (diário/semanal): `.periodo .field input[type="date"]`
- Campo de mês (mensal): `.periodo .field input[type="month"]`
- Campo de ano (anual): `.periodo .field input[type="number"]`

---

### 2. Resumo Financeiro

Três cartões que mostram a saúde financeira do período selecionado.

#### Receita (Ganho Bruto)
- **Cartão com borda verde**
- Mostra o valor total de todas as entradas no período
- Inclui dinheiro recebido de todas as plataformas (origens)
- **Importante:** Este é o valor bruto, antes de descontar despesas

**Seletor CSS:** `.resumo .cartao:nth-child(1)`

#### Despesas
- **Cartão com borda vermelha**
- Mostra o valor total de todas as saídas no período
- Inclui: energia/recargas, manutenção, lavagem, alimentação, aluguel, etc
- Todas as despesas registradas são somadas aqui

**Seletor CSS:** `.resumo .cartao:nth-child(2)`

#### Saldo (Ganho Líquido)
- **Cartão com borda amarela**
- Calculado automaticamente: Receita - Despesas
- Este é o valor que realmente sobrou no seu bolso
- Se estiver positivo, você teve lucro no período
- Se estiver negativo, suas despesas superaram suas receitas

**Seletor CSS:** `.resumo .cartao:nth-child(3)`

---

### 3. Estatísticas Detalhadas

Grid com 9 métricas essenciais para analisar seu desempenho.

#### Viagens
- **Descrição:** Número total de corridas realizadas no período
- Conta todas as viagens registradas nas entradas
- Útil para entender sua produtividade

**Seletor CSS:** `.estatisticas .metrica:nth-child(1)`

#### Horas Trabalhadas
- **Descrição:** Tempo total trabalhado no período, formatado como HH:mm
- Calculado somando as horas de todas as jornadas
- Exemplo: 32:45 significa 32 horas e 45 minutos trabalhadas

**Seletor CSS:** `.estatisticas .metrica:nth-child(2)`

#### Quilômetros Rodados
- **Descrição:** Distância total percorrida em quilômetros
- Soma dos quilômetros registrados nas entradas
- Importante para calcular custo por KM e desgaste do veículo

**Seletor CSS:** `.estatisticas .metrica:nth-child(3)`

#### R$/viagem (Receita por Viagem)
- **Descrição:** Quanto você ganha em média por cada corrida
- **Fórmula:** Receita total ÷ Número de viagens
- **Exemplo:** Se ganhou R$ 300 em 10 viagens, R$/viagem = R$ 30
- **Importante:** Este é ganho bruto por viagem

**Seletor CSS:** `.estatisticas .metrica:nth-child(4)`

#### R$/hora (Receita por Hora)
- **Descrição:** Quanto você ganha em média por cada hora trabalhada
- **Fórmula:** Receita total ÷ Horas trabalhadas
- **Exemplo:** Se ganhou R$ 300 em 8 horas, R$/hora = R$ 37,50
- **Importante:** Este é ganho bruto por hora

**Seletor CSS:** `.estatisticas .metrica:nth-child(5)`

#### R$/KM (Receita por Quilômetro)
- **Descrição:** Quanto você ganha em média por quilômetro rodado
- **Fórmula:** Receita total ÷ Quilômetros rodados
- **Exemplo:** Se ganhou R$ 300 em 150 KM, R$/KM = R$ 2,00
- **Importante:** Este é ganho bruto por KM

**Seletor CSS:** `.estatisticas .metrica:nth-child(6)`

#### Lucro/viagem (Lucro Líquido por Viagem)
- **Descrição:** Quanto realmente sobra no bolso por cada corrida
- **Fórmula:** (Receita - Despesas) ÷ Número de viagens
- **Exemplo:** Se lucrou R$ 150 em 10 viagens, lucro/viagem = R$ 15
- **Importante:** Este é o valor real que você ganha por corrida após despesas

**Seletor CSS:** `.estatisticas .metrica:nth-child(7)`

#### Lucro/hora (Lucro Líquido por Hora)
- **Descrição:** Quanto realmente sobra no bolso por cada hora trabalhada
- **Fórmula:** (Receita - Despesas) ÷ Horas trabalhadas
- **Exemplo:** Se lucrou R$ 150 em 8 horas, lucro/hora = R$ 18,75
- **Importante:** Este é o valor real do seu tempo após despesas

**Seletor CSS:** `.estatisticas .metrica:nth-child(8)`

#### Lucro/KM (Lucro Líquido por Quilômetro)
- **Descrição:** Quanto realmente sobra no bolso por quilômetro rodado
- **Fórmula:** (Receita - Despesas) ÷ Quilômetros rodados
- **Exemplo:** Se lucrou R$ 150 em 150 KM, lucro/KM = R$ 1,00
- **Importante:** Este é o valor real por KM após despesas

**Seletor CSS:** `.estatisticas .metrica:nth-child(9)`

**Seletor geral do grid:** `.estatisticas`

---

### 4. Receita por Origem (Plataformas)

Lista visual mostrando quanto você ganhou em cada plataforma de trabalho.

**Informações exibidas:**
- **Avatar/Imagem:** Cada origem pode ter uma logo (ex: logo do Uber) ou mostra a inicial do nome
- **Nome da Origem:** Nome da plataforma (ex: "Uber", "99", "InDrive")
- **Valor Total:** Quanto você ganhou nessa plataforma no período
- **Barra de Progresso:** Visualização proporcional - a origem com maior receita tem barra 100%, as outras são proporcionais a ela

**Utilidade:** Permite identificar qual plataforma está sendo mais rentável para você e onde deve focar mais esforço.

**Seletores CSS:**
- Lista de origens: `.origens .lista`
- Cada origem: `.origens .item`

---

### 5. Última Jornada

Resumo da sua jornada de trabalho mais recente.

**Informações exibidas:**
- **Data:** Dia em que a jornada foi iniciada
- **Início:** Horário que você começou a trabalhar (ex: 08:30)
- **Fim:** Horário que você encerrou (ex: 18:45) ou "Em andamento" se ainda estiver trabalhando
- **Horas:** Tempo total trabalhado nessa jornada
- **KM:** Quilômetros percorridos durante a jornada

**Utilidade:** Permite acompanhar rapidamente sua última atividade e saber se há uma jornada em aberto.

**Seletor CSS:** `.ultima-jornada`

---

### 6. Botão Flutuante (FAB) - Controle de Jornada

Botão circular no canto inferior direito para controle rápido de jornada.

**Características:**
- **Texto dinâmico:**
  - "Iniciar jornada" - quando não há jornada em andamento
  - "Finalizar jornada" - quando há uma jornada aberta
- **Rota:** `/jornada`
- **Posição:** Canto inferior direito, flutuando acima do menu inferior
- **Função:** Acesso rápido para iniciar ou encerrar seu turno de trabalho

**Seletor CSS:** `.fab`

---

### 7. Botão de Logout

Ícone de sair localizado no canto superior direito da tela.

**Funcionalidade:**
- Ao clicar, encerra sua sessão no sistema
- Chama a função `auth.logout()` do sistema de autenticação
- Após logout, você é redirecionado para a tela de login

**Seletor CSS:** `.icone-botao`

---

## Seletores CSS para Driver.js

### Menu Inferior
- **Painel:** `nav.menu-inferior a[href="/"]`

### Elementos do Painel
- **Abas de período:** `.periodo .abas button`
- **Campo de data (diário/semanal):** `.periodo .field input[type="date"]`
- **Campo de mês (mensal):** `.periodo .field input[type="month"]`
- **Campo de ano (anual):** `.periodo .field input[type="number"]`
- **Cartão Receita:** `.resumo .cartao:nth-child(1)`
- **Cartão Despesas:** `.resumo .cartao:nth-child(2)`
- **Cartão Saldo:** `.resumo .cartao:nth-child(3)`
- **Grid de estatísticas:** `.estatisticas`
- **Cada métrica:** `.estatisticas .metrica`
- **Lista de origens:** `.origens .lista`
- **Cada origem:** `.origens .item`
- **Última jornada:** `.ultima-jornada`
- **FAB jornada:** `.fab`
- **Botão logout:** `.icone-botao`

---

## Ordem Recomendada do Tour

Sugestão de fluxo para guiar o usuário pelo Painel:

1. **Menu Inferior** - Explicar navegação entre Painel, Transações e Configurações
2. **Abas de Período** - Explicar como analisar dados em diferentes escalas (diário, semanal, mensal, anual, personalizado)
3. **Cartão Receita** - Explicar ganho bruto (valor recebido das plataformas antes de despesas)
4. **Cartão Despesas** - Explicar custos totais (energia, manutenção, lavagem, etc)
5. **Cartão Saldo** - Explicar ganho líquido (o que realmente sobrou: Receita - Despesas)
6. **Estatísticas** - Explicar as 9 métricas de desempenho:
   - Viagens, Horas, KM (métricas básicas)
   - R$/viagem, R$/hora, R$/KM (ganho bruto por unidade)
   - Lucro/viagem, Lucro/hora, Lucro/KM (ganho líquido por unidade)
7. **Receita por Origem** - Explicar como identificar qual plataforma é mais rentável
8. **Última Jornada** - Explicar como acompanhar a última atividade
9. **FAB de Jornada** - Explicar controle rápido de turno (iniciar/encerrar)
10. **Botão Logout** - Explicar como encerrar sessão

---

## Dicas Educativas

### Explique o "porquê" de cada métrica
- Não apenas "este número mostra X", mas "este número é importante porque..."
- Exemplo: "Lucro/hora é importante porque mostra quanto seu tempo realmente vale após descontar todos os custos"

### Use exemplos práticos
- "Por exemplo: Se você ganhou R$ 300 em 10 viagens, seu R$/viagem é R$ 30"
- "Por exemplo: Se suas despesas foram R$ 100 e você ganhou R$ 300, seu lucro é R$ 200"

### Destaque a diferença entre bruto e líquido
- Sempre que mencionar R$/viagem, R$/hora ou R$/KM, enfatize que é ganho bruto
- Sempre que mencionar Lucro/viagem, Lucro/hora ou Lucro/KM, enfatize que é ganho líquido
- Explique que lucro líquido é o valor real que sobra no bolso

### Explique o conceito de Origem
- Deixe claro que "Origem" = Plataforma de trabalho (Uber, 99, etc)
- Explique que cada origem é uma fonte de receita separada
- Mostre como isso ajuda a identificar qual plataforma paga melhor

---

## Elementos Dinâmicos a Considerar

### Texto do FAB de jornada
- Muda entre "Iniciar jornada" e "Finalizar jornada"
- Depende se há jornada em andamento
- **Solução:** Verificar estado antes de destacar no tour

### Lista de origens
- Pode estar vazia se não houver origens cadastradas
- Mensagem de estado vazio aparece
- **Solução:** Verificar se há origens antes de destacar a lista

### Última jornada
- Pode não existir se o usuário nunca iniciou uma jornada
- **Solução:** Verificar se há jornada antes de destacar esta seção

---

## Estados do Usuário a Considerar

### Usuário sem dados (primeiro acesso)
- Listas vazias (sem origens, sem jornadas)
- Estatísticas com zeros
- **Solução:** Explicar que precisa cadastrar origens e iniciar jornadas primeiro

### Usuário com jornada aberta
- FAB mostra "Finalizar jornada"
- Última jornada aparece como "Em andamento"
- **Solução:** Adaptar explicação conforme estado

### Usuário sem jornada aberta
- FAB mostra "Iniciar jornada"
- Última jornada pode não existir
- **Solução:** Explicar fluxo completo de jornada
