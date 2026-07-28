# Documentação de Transações - BYD Dolphin

Esta documentação descreve todas as funcionalidades da tela de Transações do sistema. Destinada para implementação de tutoriais com Driver.js.

---

## Visão Geral

A tela de Transações é onde você registra todas as movimentações financeiras do seu trabalho: receitas (ganho bruto), despesas (custos) e recargas de energia do veículo elétrico. É o coração do sistema financeiro.

**Arquivo:** `src/views/TransacoesNovaView.vue`

**Rota:** `/transacoes`

---

## Conceitos Importantes

### Tipos de Transações
- **Entradas (Receitas):** Dinheiro recebido das plataformas de trabalho (ganho bruto)
- **Saídas (Despesas):** Custos do trabalho que reduzem seu lucro
- **Recargas:** Abastecimento de energia do veículo elétrico

### O que é uma "Origem"?
**Origem** refere-se às **plataformas de trabalho** onde você recebe corridas ou serviços, como:
- Uber
- 99
- InDrive
- Flash
- Outras plataformas de transporte

Cada origem representa uma fonte de receita diferente.

---

## Funcionalidades de Transações

### 1. Abas de Tipo

Três abas organizam os diferentes tipos de transações.

#### Entradas (E) - Receitas
- Registra todo o dinheiro que você recebe das plataformas de trabalho
- Cada entrada representa o ganho bruto de um período (dia, turno, etc)
- Você pode vincular cada entrada a uma origem (plataforma) específica
- Exemplo: R$ 350 recebido do Uber em um dia de trabalho

**Seletor CSS:** `.abas button:nth-child(1)`

#### Saídas (S) - Despesas
- Registra todos os custos do seu trabalho
- Cada despesa representa um gasto que reduz seu lucro
- Pode ser categorizada (manutenção, lavagem, alimentação, etc)
- Exemplo: R$ 50 em lavagem do carro

**Seletor CSS:** `.abas button:nth-child(2)`

#### Recargas (R) - Energia
- Registra o abastecimento de energia do seu veículo elétrico
- Calcula automaticamente kWh consumidos e custo
- Exemplo: R$ 80 em 40 kWh de energia

**Seletor CSS:** `.abas button:nth-child(3)`

**Seletor geral das abas:** `.abas button`

---

### 2. Filtros

Permite filtrar as transações por período e categoria.

#### Data Início/Fim
- Define o intervalo de datas para visualizar as transações
- Útil para analisar um período específico (ex: última semana)
- Ao alterar as datas, a lista é atualizada automaticamente

**Seletores CSS:**
- Filtro data início: `.filtros .field:nth-child(1) input`
- Filtro data fim: `.filtros .field:nth-child(2) input`

#### Filtro de Origem (apenas na aba Entradas)
- Seletor para filtrar por plataforma de trabalho
- Opções: "Todas" ou cada origem cadastrada (Uber, 99, etc)
- Útil para ver quanto ganhou especificamente em cada plataforma

**Seletor CSS:** `.filtros .field:nth-child(3) select` (apenas na aba Entradas)

#### Filtro de Categoria (apenas na aba Saídas)
- Seletor para filtrar por categoria de despesa
- Opções: "Todas" ou cada categoria cadastrada (manutenção, lavagem, etc)
- Útil para analisar gastos por tipo de custo

**Seletor CSS:** `.filtros .field:nth-child(3) select` (apenas na aba Saídas)

---

### 3. Lista de Transações

Mostra todas as transações do período selecionado, organizadas por data (mais recentes primeiro).

#### Itens de Entrada
Cada item de Entrada exibe:
- **Data:** Dia da transação
- **Origem:** Plataforma de trabalho (ex: "Uber")
- **Metadados:**
  - Número de viagens realizadas
  - Quilômetros rodados
  - Horas trabalhadas (formato HH:mm)
- **Observação:** Notas adicionais (se houver)
- **Valor:** Valor recebido (cor verde)
- **Ações rápidas:**
  - Editar (ícone lápis) - altera os dados da entrada
  - Baixar NF (ícone download) - baixa nota fiscal anexada (se houver)
  - Excluir (ícone lixeira) - remove a entrada permanentemente

#### Itens de Saída
Cada item de Saída exibe:
- **Data:** Dia da despesa
- **Categoria:** Tipo de gasto (ex: "Manutenção")
- **Metadados:**
  - Tipo de gasto (DIARIO_SEMANAL, MANUTENCAO, OUTROS)
- **Observação:** Notas adicionais (se houver)
- **Valor:** Valor gasto (cor vermelha)
- **Ações rápidas:**
  - Editar (ícone lápis) - altera os dados da despesa
  - Duplicar (ícone ⎘) - cria uma cópia da despesa com data atual
  - Baixar NF (ícone download) - baixa nota fiscal anexada (se houver)
  - Excluir (ícone lixeira) - remove a despesa permanentemente

#### Itens de Recarga
Cada item de Recarga exibe:
- **Data:** Dia da recarga
- **Local:** Onde foi feita (Casa, Rua, Shopping, etc)
- **Metadados:**
  - kWh consumidos
  - Tarifa por kWh (preço da energia)
- **Observação:** Notas adicionais (se houver)
- **Valor:** Custo total (cor vermelha)
- **Ações rápidas:**
  - Editar (ícone lápis) - altera os dados da recarga
  - Baixar NF (ícone download) - baixa nota fiscal anexada (se houver)
  - Excluir (ícone lixeira) - remove a recarga permanentemente

**Seletor CSS da lista:** `.lista`

**Seletor CSS de cada item:** `.lista .item`

---

### 4. Modal de Preview/Detalhes

Ao clicar em qualquer transação, abre-se um modal com informações completas.

**Informações exibidas:**
- **Tipo:** Tag colorida indicando "Entrada", "Saída" ou "Recarga"
- **Data:** Data da transação
- **Valor:** Valor destacado em tamanho grande (verde para entradas, vermelho para saídas/recargas)
- **Detalhes específicos por tipo:**
  - Entradas: origem, viagens, KM, horas trabalhadas
  - Saídas: categoria, tipo de gasto
  - Recargas: local, kWh consumidos, tarifa/kWh
- **Observação:** Texto de notas (se houver)
- **Nota fiscal:** Nome do arquivo anexado (se houver)

**Ações disponíveis no modal:**
- **Baixar NF:** Baixa a nota fiscal anexada (se existir)
- **Editar:** Abre o formulário para editar a transação
- **Excluir:** Abre modal de confirmação para excluir

---

### 5. Modal de Confirmação de Exclusão

Antes de excluir uma transação, o sistema pede confirmação para evitar exclusões acidentais.

**Elementos do modal:**
- **Ícone de alerta:** Ícone de lixeira em fundo vermelho
- **Pergunta:** "Excluir esta receita/despesa/recarga?"
- **Aviso:** "Esta ação não pode ser desfeita."
- **Resumo do item:** Mostra data e valor para confirmação
- **Botões:**
  - Cancelar - fecha o modal sem excluir
  - Excluir - confirma e remove a transação permanentemente

---

### 6. Botão Flutuante (FAB) - Nova Transação

Botão circular com ícone "+" no canto inferior direito para adicionar novas transações.

**Características:**
- **Ícone:** Símbolo de adição (+)
- **Rota dinâmica conforme a aba ativa:**
  - Aba Entradas: `/transacoes/nova?tipo=ENTRADA` - abre formulário de nova receita
  - Aba Saídas: `/transacoes/nova?tipo=SAIDA` - abre formulário de nova despesa
  - Aba Recargas: `/transacoes/recarga` - abre formulário de nova recarga
- **Posição:** Canto inferior direito, flutuando acima do menu inferior
- **Função:** Acesso rápido para registrar nova movimentação financeira

**Seletor CSS:** `.fab`

---

### 7. Atalhos de Teclado

- **Escape:** Fecha qualquer modal aberto (preview de detalhes ou confirmação de exclusão)

---

## Formulário de Nova Entrada (Receita)

**Rota:** `/transacoes/nova?tipo=ENTRADA`

**Arquivo:** `src/views/FormularioTransacaoView.vue`

### Campos Principais

#### Valor
- Campo numérico obrigatório
- Valor total recebido no período
- Exemplo: 350.00

#### Data
- Campo date obrigatório
- Dia em que recebeu o valor
- Padrão: data atual

#### Origem
- Seletor obrigatório
- Plataforma de trabalho (Uber, 99, etc)
- Deve estar cadastrada em Configurações

#### Veículo
- Seletor opcional
- Veículo utilizado no período
- Deve estar cadastrado em Veículos

### Campos de Jornada (Opcionais mas Recomendados)

#### Jornada
- Campo opcional com botão "Puxar última jornada"
- Vincula a receita a uma jornada específica
- Botão busca automaticamente a última jornada encerrada
- Preenche os campos de horário automaticamente

#### Início da Jornada
- Campo datetime-local
- Horário exato que começou a trabalhar
- Formato: YYYY-MM-DDTHH:mm

#### Fim da Jornada
- Campo datetime-local
- Horário exato que parou de trabalhar
- Formato: YYYY-MM-DDTHH:mm

### Campos de Métricas de Trabalho

#### Horas Trabalhadas
- Campo texto com formatação HH:mm
- Auto-calculado a partir de início e fim
- Aceita formato manual (ex: 06:39 ou 32:02)
- Exemplo: 08:30 (8 horas e 30 minutos)

#### Viagens
- Campo numérico
- Número de corridas realizadas
- Exemplo: 15

#### Quilômetros
- Campo numérico
- Quilômetros rodados no período
- Exemplo: 120.5

### Campos Adicionais

#### Observação
- Campo textarea opcional
- Notas sobre o período
- Exemplo: "Dia bom, muita corrida"

#### Nota Fiscal
- Upload de arquivo (máx 5MB)
- Anexa comprovante da receita
- Formatos aceitos: imagem, PDF

### Botões
- **Salvar** - registra a entrada no sistema
- **Baixar NF** - baixa nota fiscal anexada (apenas em edição)
- **Apagar NF** - remove nota fiscal anexada (apenas em edição)

### Funcionalidades Especiais

#### Botão "Puxar última jornada"
- Busca automaticamente a última jornada encerrada no sistema
- Preenche os campos de data, início e fim automaticamente
- Preenche também horas trabalhadas calculadas
- **Utilidade:** Economiza tempo ao registrar receitas

#### Cálculo automático de horas
- Quando você preenche início e fim da jornada
- O sistema calcula automaticamente as horas trabalhadas
- Exemplo: Início 08:00, Fim 18:00 → 10:00
- **Utilidade:** Evita precisar calcular manualmente

#### Formatação inteligente de horas
- Aceita entrada em formato HH:mm
- Suporta horas além de 24h (ex: 32:02 para 32 horas e 2 minutos)
- Valida o formato antes de salvar
- **Utilidade:** Flexibilidade para jornadas longas

#### Validação antes de salvar
- Verifica campos obrigatórios
- Se houver campos em branco, mostra mensagem de erro
- Para entradas: verifica início e fim se jornada estiver preenchida
- **Utilidade:** Evita registros incompletos

---

## Formulário de Nova Saída (Despesa)

**Rota:** `/transacoes/nova?tipo=SAIDA`

**Arquivo:** `src/views/FormularioTransacaoView.vue`

### Campos Principais

#### Valor
- Campo numérico obrigatório
- Valor da despesa
- Exemplo: 50.00

#### Data
- Campo date obrigatório
- Dia em que ocorreu a despesa
- Padrão: data atual

#### Categoria
- Seletor obrigatório
- Tipo de gasto (manutenção, lavagem, etc)
- Deve estar cadastrada em Configurações

#### Forma de Pagamento
- Seletor opcional
- Como pagou a despesa (dinheiro, cartão, etc)
- Deve estar cadastrada em Configurações

### Campos Específicos por Tipo

#### Tipo de Gasto
- Seletor
- DIARIO_SEMANAL - gastos recorrentes (alimentação, lavagem)
- MANUTENCAO - reparos e manutenção do veículo
- OUTROS - qualquer outro tipo de gasto

#### Item de Manutenção
- Campo texto (apenas se tipo=MANUTENCAO)
- Descrição do que foi reparado/trocado
- Exemplo: "Troca de pastilha de freio"

### Campos Adicionais

#### Observação
- Campo textarea opcional
- Detalhes sobre a despesa
- Exemplo: "Lavagem completa"

#### Nota Fiscal
- Upload de arquivo (máx 5MB)
- Anexa comprovante da despesa
- Formatos aceitos: imagem, PDF

### Botões
- **Salvar** - registra a despesa no sistema
- **Baixar NF** - baixa nota fiscal anexada (apenas em edição)
- **Apagar NF** - remove nota fiscal anexada (apenas em edição)

---

## Formulário de Nova Recarga

**Rota:** `/transacoes/recarga`

**Arquivo:** `src/views/FormularioRecargaView.vue`

### Seção: Cálculo Automático

Área destacada com cálculos automáticos inteligentes.

#### Campos para Cálculo

##### Potência (kW)
- Campo numérico
- Potência do carregador em quilowatts
- Exemplo: 7.4 (carregador comum)
- Exemplo: 22 (carregador rápido)

##### Horas Carregando
- Campo numérico
- Tempo total de carregamento em horas
- Exemplo: 4 (4 horas)
- Exemplo: 0.5 (30 minutos)

##### Tarifa (R$/kWh)
- Campo numérico
- Preço da energia por kWh
- Preenchido automaticamente com valor de Personalizações
- Pode ser editado manualmente
- Exemplo: 0.85

#### Como Funciona o Cálculo Automático
- kWh = Potência × Horas (ex: 7.4 kW × 4h = 29.6 kWh)
- Valor = kWh × Tarifa (ex: 29.6 kWh × R$ 0,85 = R$ 25,16)
- Ao preencher os 3 campos, o sistema calcula kWh e valor automaticamente

#### Dica Informativa
- "A tarifa é preenchida automaticamente com o valor salvo em Personalizações, mas você pode editá-la."
- "Preencha os 3 campos acima para calcular automaticamente, ou edite manualmente os campos abaixo."

### Campos Manuais

Você também pode preencher manualmente se preferir.

#### Data
- Campo date obrigatório
- Dia da recarga
- Padrão: data atual

#### Dia da Semana
- Campo desabilitado
- Calculado automaticamente a partir da data
- Exemplo: "segunda-feira"

#### Valor (R$)
- Campo numérico obrigatório
- Custo total da recarga
- Pode ser preenchido manualmente ou calculado automaticamente
- Exemplo: 80.00

#### kWh Consumidos
- Campo numérico obrigatório
- Energia total carregada
- Pode ser preenchido manualmente ou calculado automaticamente
- Exemplo: 40.5

#### Local
- Seletor
- Onde foi feita a recarga
- Opções: Casa, Rua, Shopping, Trabalho, Outro

#### Observação
- Campo textarea opcional
- Notas sobre a recarga
- Exemplo: "Recarga noturna em casa"

### Botão
- **Salvar recarga** (ou "Atualizar recarga" em edição)
- **Salvando...** durante processamento

### Funcionalidades Especiais

#### Cálculos Bidirecionais
- Se você alterar o valor manualmente, o sistema recalcula a tarifa
- Se você alterar o kWh manualmente, o sistema recalcula horas ou potência
- **Utilidade:** Flexibilidade total, você pode preencher qualquer campo

#### Tarifa Automática de Personalizações
- Ao abrir o formulário pela primeira vez
- O sistema busca a tarifa configurada em Personalizações
- Se encontrada, preenche o campo automaticamente
- **Utilidade:** Economiza tempo, não precisa digitar a tarifa sempre

#### Modo Edição
- Ao editar uma recarga existente
- Os campos são preenchidos com os dados salvos
- A tarifa não é sobrescrita pela de Personalizações
- **Utilidade:** Preserva os dados originais da recarga

---

## Seletores CSS para Driver.js

### Menu Inferior
- **Transações:** `nav.menu-inferior a[href="/transacoes"]`

### Elementos da Tela de Transações
- **Abas de tipo:** `.abas button`
- **Aba Entradas:** `.abas button:nth-child(1)`
- **Aba Saídas:** `.abas button:nth-child(2)`
- **Aba Recargas:** `.abas button:nth-child(3)`
- **Filtro data início:** `.filtros .field:nth-child(1) input`
- **Filtro data fim:** `.filtros .field:nth-child(2) input`
- **Filtro origem (entradas):** `.filtros .field:nth-child(3) select`
- **Filtro categoria (saídas):** `.filtros .field:nth-child(3) select`
- **Lista de transações:** `.lista`
- **Cada item de transação:** `.lista .item`
- **FAB nova transação:** `.fab`

### Elementos do Formulário de Transação
- **Campo Valor:** `.formulario .field:nth-child(1) input`
- **Campo Data:** `.formulario .field:nth-child(2) input`
- **Campo Origem/Categoria:** `.formulario .field:nth-child(3) select`
- **Botão Puxar última jornada:** `.botao-puxar-jornada`
- **Campo Início jornada:** `.formulario .field input[type="datetime-local"]:nth-of-type(1)`
- **Campo Fim jornada:** `.formulario .field input[type="datetime-local"]:nth-of-type(2)`
- **Campo Horas trabalhadas:** `.formulario .field:nth-child(6) input`
- **Campo Viagens:** `.formulario .field:nth-child(7) input`
- **Campo Quilômetros:** `.formulario .field:nth-child(8) input`
- **Campo Observação:** `.formulario textarea`
- **Upload nota fiscal:** `.formulario input[type="file"]`
- **Botão Salvar:** `.formulario button[type="submit"]`

---

## Ordem Recomendada do Tour

Sugestão de fluxo para guiar o usuário pela tela de Transações:

1. **Menu Inferior** - Explicar navegação para Transações
2. **Abas de Tipo** - Explicar as 3 abas (Entradas, Saídas, Recargas)
3. **Filtros de Data** - Explicar como filtrar por período
4. **Filtro de Origem/Categoria** - Explicar filtros específicos por tipo
5. **Lista de Transações** - Explicar como visualizar as movimentações
6. **Item de Transação** - Explicar informações exibidas em cada item
7. **Ações Rápidas** - Explicar editar, duplicar, baixar NF, excluir
8. **Modal de Detalhes** - Explicar preview completo da transação
9. **FAB Nova Transação** - Explicar como adicionar nova movimentação
10. **Formulário de Entrada** (navegar para formulário):
    - Explicar campos principais (valor, data, origem)
    - Explicar campos de jornada (opcional mas recomendado)
    - Explicar campos de métricas (viagens, km, horas)
    - Explicar botão "Puxar última jornada"
    - Explicar cálculo automático de horas
    - Explicar campos adicionais (observação, nota fiscal)
    - Explicar botão salvar

---

## Dicas Educativas

### Explique o "porquê" de cada campo
- Não apenas "preencha este campo", mas "preencha este campo para..."
- Exemplo: "Preencha o campo de origem para saber em qual plataforma você ganhou esse valor"

### Use exemplos práticos
- "Por exemplo: R$ 350 recebido do Uber"
- "Por exemplo: 15 viagens realizadas no dia"
- "Por exemplo: 120.5 km rodados"

### Explique a importância de cada tipo
- **Entradas:** "Registre suas receitas para saber quanto ganhou"
- **Saídas:** "Registre suas despesas para saber quanto gastou"
- **Recargas:** "Registre suas recargas para controlar o custo de energia"

### Destaque funcionalidades que economizam tempo
- "O botão 'Puxar última jornada' preenche automaticamente os horários"
- "O cálculo automático de horas evita precisar calcular manualmente"
- "A tarifa de Personalizações é preenchida automaticamente"

---

## Elementos Dinâmicos a Considerar

### Abas e Filtros
- Mudam conforme a aba ativa (Entradas/Saídas/Recargas)
- Filtro de origem só aparece em Entradas
- Filtro de categoria só aparece em Saídas
- **Solução:** Adaptar o tour conforme a aba ativa

### Lista de Itens
- Pode estar vazia se não houver dados
- Mensagem de estado vazio aparece
- **Solução:** Verificar se há itens antes de destacar lista

### Botão Duplicar
- Só aparece em itens de Saída
- Não aparece em Entradas ou Recargas
- **Solução:** Verificar o tipo antes de destacar

---

## Estados do Usuário a Considerar

### Usuário sem dados (primeiro acesso)
- Listas vazias (sem transações)
- Sem origens cadastradas
- Sem categorias cadastradas
- **Solução:** Explicar que precisa cadastrar origens e categorias primeiro em Configurações

### Usuário com dados
- Lista preenchida com transações
- Origens e categorias disponíveis nos seletores
- **Solução:** Tour completo com todos os elementos

### Usuário sem jornada
- Botão "Puxar última jornada" não funcionará
- **Solução:** Explicar que precisa iniciar uma jornada primeiro
