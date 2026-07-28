# Documentação de Configurações - BYD Dolphin

Esta documentação descreve todas as funcionalidades da tela de Configurações do sistema. Destinada para implementação de tutoriais com Driver.js.

---

## Visão Geral

A tela de Configurações é onde você personaliza o sistema, gerencia seus cadastros e ajusta as preferências do aplicativo. É o centro de controle para organizar suas origens de trabalho, categorias de despesas e dados pessoais.

**Arquivo:** `src/views/ConfiguracoesNovaView.vue`

**Rota:** `/configuracoes`

---

## Funcionalidades de Configurações

### 1. Card de Perfil

Primeiro card da tela, mostra suas informações de usuário.

**Informações exibidas:**
- **Avatar:** Círculo com a primeira letra do seu email (inicial)
- **Email:** Seu endereço de e-mail cadastrado no sistema
- **Texto:** "Perfil do motorista"
- **Função:** Ao clicar, navega para `/configuracoes/perfil` onde você pode editar nome e senha
- **Utilidade:** Acesso rápido para gerenciar seus dados pessoais

**Seletor CSS:** `.perfil`

---

### 2. Categorias de Entrada (Origens)

Gerencia as plataformas de trabalho onde você recebe corridas.

**Informações:**
- **Ícone:** ◉
- **Título:** Categorias de entrada
- **Descrição:** Origens de receita
- **Explicação:** Aqui você cadastra as plataformas de trabalho onde recebe corridas (Uber, 99, InDrive, etc)
- **Ação:** Ao clicar, abre `/configuracoes/cadastros?secao=origens`
- **Utilidade:** Permite cadastrar e gerenciar todas as suas plataformas de trabalho

**Seletor CSS:** `.opcoes button:nth-child(1)`

---

### 3. Categorias de Saída

Gerencia os tipos de despesas do seu trabalho.

**Informações:**
- **Ícone:** ▣
- **Título:** Categorias de saída
- **Descrição:** Custos fixos e variáveis
- **Explicação:** Aqui você cadastra os tipos de despesas (manutenção, lavagem, alimentação, aluguel, etc)
- **Ação:** Ao clicar, abre `/configuracoes/cadastros?secao=categorias`
- **Utilidade:** Organiza suas despesas em categorias para melhor controle financeiro

**Seletor CSS:** `.opcoes button:nth-child(2)`

---

### 4. Formas de Pagamento

Gerencia as formas como você paga suas despesas.

**Informações:**
- **Ícone:** ◈
- **Título:** Formas de pagamento
- **Descrição:** Gerencie as opções de pagamento
- **Explicação:** Cadastre as formas como você paga suas despesas (dinheiro, cartão, PIX, etc)
- **Ação:** Ao clicar, abre `/configuracoes/cadastros?secao=formas`
- **Utilidade:** Registra como você paga seus custos para controle financeiro

**Seletor CSS:** `.opcoes button:nth-child(3)`

---

### 5. Jornadas

Visualiza e gerencia o histórico de jornadas de trabalho.

**Informações:**
- **Ícone:** ◷
- **Título:** Jornadas
- **Descrição:** Consulte o histórico operacional
- **Explicação:** Visualiza e gerencia todas as suas jornadas de trabalho (turnos)
- **Ação:**Ao clicar, navega para `/configuracoes/jornadas`
- **Utilidade:** Permite ver histórico de turnos, editar horários e excluir jornadas

**Seletor CSS:** `.opcoes button:nth-child(4)`

---

### 6. Personalizações

Configura a tarifa residencial de energia elétrica.

**Informações:**
- **Ícone:** ϟ
- **Título:** Personalizações
- **Descrição:** Tarifa padrão de energia
- **Explicação:** Define a tarifa residencial de energia elétrica (R$/kWh) para cálculo automático de recargas
- **Ação:** Ao clicar, navega para `/personalizacoes`
- **Utilidade:** Configura o preço base da energia para cálculos automáticos de custo de recarga

**Seletor CSS:** `.opcoes button:nth-child(5)`

---

### 7. Metas

Funcionalidade futura para definir metas financeiras.

**Informações:**
- **Ícone:** ⌁
- **Título:** Metas
- **Descrição:** Em breve
- **Explicação:** Funcionalidade futura para definir metas financeiras
- **Ação:** Ao clicar, exibe mensagem "Disponível em uma futura versão."
- **Utilidade:** Prepara o sistema para futuras funcionalidades de metas

**Seletor CSS:** `.opcoes button:nth-child(6)`

---

### 8. Toggle de Tema (Claro/Escuro)

Seletor para alternar entre tema escuro e claro.

**Características:**
- **Label:** Tema escuro
- **Descrição:** Preferência salva neste dispositivo
- **Comportamento:**
  - Ativado: Usa tema escuro (padrão)
  - Desativado: Usa tema claro
- **Persistência:** A preferência é salva no localStorage do dispositivo
- **Utilidade:** Permite personalizar a aparência do app conforme sua preferência

**Seletor CSS:** `.tema .switch`

---

## Tela de Perfil

**Rota:** `/configuracoes/perfil`

**Arquivo:** `src/views/PerfilView.vue`

### Visão Geral
Tela para gerenciar seus dados pessoais e segurança da conta.

### Seção: Dados Pessoais

Permite atualizar suas informações básicas.

**Campos:**
- **Nome:** Campo de texto editável
  - Pode ser alterado a qualquer momento
  - Exibe seu nome atual cadastrado
- **E-mail:** Campo desabilitado (não editável)
  - Mostra seu email cadastrado no sistema
  - Não pode ser alterado por segurança

**Botão:** "Salvar perfil"
- Salva as alterações de nome
- Exibe mensagem de confirmação em caso de sucesso

### Seção: Alterar Senha

Permite trocar sua senha de acesso.

**Campos:**
- **Senha atual:** Campo password (obrigatório)
  - Confirma sua identidade antes de trocar a senha
- **Nova senha:** Campo password (obrigatório, mínimo 8 caracteres)
  - Deve ser diferente da senha atual
  - Recomenda-se usar senha forte (letras, números, símbolos)

**Botão:** "Alterar senha"
- Valida a senha atual
- Atualiza para a nova senha
- Exibe mensagem de confirmação em caso de sucesso

### Segurança
- A senha atual é obrigatória para evitar trocas não autorizadas
- A nova senha deve ter no mínimo 8 caracteres
- Após alterar, você continua logado (não precisa fazer login novamente)

---

## Tela de Cadastros

**Rota:** `/configuracoes/cadastros`

**Arquivo:** `src/views/CadastrosView.vue`

### Visão Geral
Tela unificada para gerenciar três tipos de cadastros essenciais: origens (plataformas), categorias de despesa e formas de pagamento. Organizada em abas para fácil navegação.

### Abas de Navegação

Três abas organizam os diferentes tipos de cadastro.

#### Aba "Entradas" (Origens)
- Gerencia as plataformas de trabalho onde você recebe corridas
- Exemplos: Uber, 99, InDrive, Flash, etc
- Cada origem pode ter uma logo/imagem

**Query param:** `?secao=origens`

#### Aba "Saídas" (Categorias)
- Gerencia os tipos de despesas do seu trabalho
- Exemplos: Manutenção, Lavagem, Alimentação, Aluguel, etc
- Cada categoria pode ser custo fixo ou variável

**Query param:** `?secao=categorias`

#### Aba "Pagamentos" (Formas)
- Gerencia as formas como você paga suas despesas
- Exemplos: Dinheiro, Cartão de crédito, PIX, Débito, etc

**Query param:** `?secao=formas`

### Formulário de Cadastro

Permite criar novos itens ou editar existentes.

**Campo: Nome**
- Campo de texto obrigatório
- Máximo 200 caracteres
- Nome do item (ex: "Uber", "Manutenção", "PIX")

**Campo: Descrição**
- Campo textarea opcional
- Máximo 500 caracteres
- Detalhes adicionais sobre o item
- **Não aparece** na aba "Pagamentos" (formas não têm descrição)

**Campo: Tipo (apenas na aba "Saídas")**
- Seletor com duas opções:
  - "Custo fixo" - despesas que se repetem mensalmente (aluguel, seguro)
  - "Custo variável" - despesas que variam (combustível, lavagem)
- **Não aparece** nas outras abas

**Botões:**
- **"Adicionar"** (modo criação) - salva um novo cadastro
- **"Salvar alteração"** (modo edição) - atualiza um cadastro existente
- **"Cancelar"** (aparece ao editar) - cancela a edição e limpa o formulário

### Lista de Itens Cadastrados

Mostra todos os itens do tipo selecionado.

#### Para Origens (Entradas)
- Avatar/imagem da plataforma (logo ou inicial)
- Nome da origem
- Descrição (se houver)
- Botões: Editar (ícone lápis), Excluir (×)

#### Para Categorias (Saídas)
- Avatar com inicial do nome
- Nome da categoria
- Tipo (Custo fixo/Custo variável)
- Descrição (se houver)
- Botões: Editar (ícone lápis), Excluir (×)

#### Para Formas (Pagamentos)
- Avatar com inicial do nome
- Nome da forma de pagamento
- Botões: Editar (ícone lápis), Excluir (×)

**Estado vazio:** Se não houver itens, exibe "Nenhum cadastro encontrado."

### Modal de Confirmação de Exclusão

Antes de excluir um cadastro, o sistema pede confirmação.

**Elementos do modal:**
- **Ícone de alerta:** Ícone de lixeira em fundo vermelho
- **Pergunta:** "Excluir esta entrada/categoria/forma de pagamento?"
- **Aviso:** "Esta ação não pode ser desfeita."
- **Resumo:** Mostra nome e descrição do item
- **Botões:** Cancelar, Excluir

**Atalho de teclado:**
- **Escape:** Fecha o modal de exclusão

### Funcionalidades Especiais
- **Edição:** Ao clicar em editar, o formulário é preenchido com os dados do item
- **Cancelamento:** O botão cancelar limpa o formulário e sai do modo edição
- **Persistência:** Alterações são salvas imediatamente no sistema

---

## Tela de Jornadas - Histórico

**Rota:** `/configuracoes/jornadas`

**Arquivo:** `src/views/JornadasConfiguracaoView.vue`

### Visão Geral
Tela para visualizar e gerenciar o histórico completo de todas as suas jornadas de trabalho. Permite corrigir horários incorretos e excluir jornadas erradas.

### Lista de Jornadas

Mostra todas as jornadas registradas, ordenadas por data.

**Informações exibidas:**
- **Data:** Formatada em português (ex: "25 de janeiro de 2024")
- **Horário:** Início → Fim (ex: "08:30 → 18:45")
  - Se a jornada ainda estiver aberta, mostra "Em andamento"
- **Badge de status:**
  - "Aberta" (verde) - jornada em andamento
  - "Encerrada" (cinza) - jornada finalizada
- **Ações:**
  - Editar (ícone lápis) - abre modal para corrigir horários
  - Excluir (ícone lixeira) - abre modal de confirmação

**Estado vazio:** Se não houver jornadas, exibe "Nenhuma jornada cadastrada."

### Modal de Edição de Jornada

Permite corrigir horários de uma jornada existente.

**Campos:**
- **Data:** Campo date para corrigir o dia
- **Início:** Campo time para corrigir horário de início
- **Fim:** Campo time para corrigir horário de fim

**Botões:**
- **Cancelar** - fecha o modal sem salvar
- **Salvar alterações** - atualiza a jornada com os novos horários

**Funcionamento:**
- Ao abrir, o modal já vem preenchido com os dados atuais
- Você pode alterar qualquer campo
- Ao salvar, a jornada é atualizada no sistema

### Modal de Confirmação de Exclusão

Antes de excluir uma jornada.

**Elementos do modal:**
- **Ícone de alerta:** Ícone de lixeira em fundo vermelho
- **Pergunta:** "Excluir esta jornada?"
- **Aviso:** "Esta ação não pode ser desfeita."
- **Resumo:** Mostra data e horário da jornada
- **Botões:** Cancelar, Excluir

**Atalho de teclado:**
- **Escape:** Fecha qualquer modal (edição ou exclusão)

### Por que Editar/Excluir Jornadas?
- **Correção de erros:** Se você esqueceu de iniciar a jornada no horário certo
- **Ajustes:** Se precisa corrigir horários por engano
- **Limpeza:** Excluir jornadas de teste ou duplicadas
- **Precisão:** Garantir que os dados financeiros estejam corretos

---

## Tela de Personalizações

**Rota:** `/personalizacoes`

**Arquivo:** `src/views/PersonalizacoesView.vue`

### Visão Geral
Tela para configurar a tarifa residencial de energia elétrica. Este valor é usado como base para cálculos automáticos de custo de recarga do veículo elétrico.

### Funcionalidades

#### Campo: Valor do kWh (R$)
- **Tipo:** Campo numérico com precisão de 4 casas decimais
- **Placeholder:** "Ex: 1.25"
- **Descrição:** "Este valor será usado como padrão para estimar seus custos de recarga."
- **Explicação:** Informe o valor que você paga por kWh de energia em sua residência
- **Exemplo prático:** Se sua conta de luz mostra R$ 0,85 por kWh, digite 0.85
- **Utilidade:** Serve como base para cálculo automático quando você registra recargas

#### Botão: Salvar Tarifa
- **Texto:** "Salvar tarifa" (ou "Salvando..." durante o processamento)
- **Ação:** Salva o valor configurado no sistema
- **Feedback:** Exibe mensagem "Tarifa salva." em caso de sucesso
- **Utilidade:** Persiste a configuração para uso futuro

#### Comportamento de Carregamento
- Ao abrir a tela, o sistema busca automaticamente a tarifa já salva
- Se houver uma tarifa configurada, o campo é preenchido automaticamente
- Se não houver tarifa salva, o campo fica vazio para você preencher

### Por que Isso é Importante?
- Quando você registra uma recarga, o sistema pode calcular automaticamente o custo baseado no kWh consumido
- Ter a tarifa configurada evita que você precise calcular manualmente cada vez
- Facilita o controle preciso dos custos de energia do veículo

---

## Tela de Veículos

**Rota:** `/veiculos`

**Arquivo:** `src/views/VeiculoView.vue`

### Visão Geral
Tela para gerenciar a frota de veículos. Você pode cadastrar múltiplos veículos (caso tenha mais de um) com suas especificações técnicas.

### Lista de Veículos Cadastrados

Mostra todos os veículos já cadastrados no sistema.

**Informações exibidas:**
- **Ícone:** Ícone de carro para cada veículo
- **Marca e modelo** (ex: "BYD Dolphin")
- **Ano do veículo** (ex: 2024)
- **Autonomia em km** (ex: 405 km)

**Estado vazio:** Se não houver veículos cadastrados, exibe mensagem "Nenhum veículo cadastrado ainda."

**Utilidade:** Visualização rápida da sua frota

### Formulário de Novo Veículo

Permite adicionar um novo veículo ao sistema.

**Campos obrigatórios:**
- **Marca:** Campo de texto (ex: "BYD")
- **Modelo:** Campo de texto (ex: "Dolph")
- **Ano:** Campo numérico, mínimo 1900 (ex: 2024)
- **Tipo:** Campo de texto (ex: "Hatch elétrico", "Sedan")
- **Capacidade da bateria (kWh):** Campo numérico (ex: 44.9)
- **Autonomia (km):** Campo numérico (ex: 405)
- **Consumo médio (kWh/km):** Campo numérico (ex: 0.15)

**Botão:** "Salvar Veículo" (ou "Salvando..." durante processamento)

**Funcionamento:**
- Ao salvar, o veículo é adicionado à lista
- O formulário é limpo automaticamente
- A lista é atualizada para mostrar o novo veículo

### Por que Cadastrar Veículos?
- Permite vincular suas jornadas a veículos específicos
- Ajuda no controle de desgaste e manutenção por veículo
- Essencial para cálculos precisos de consumo de energia

---

## Seletores CSS para Driver.js

### Menu Inferior
- **Configurações:** `nav.menu-inferior a[href="/configuracoes"]`

### Elementos da Tela de Configurações
- **Card perfil:** `.perfil`
- **Opção Categorias de Entrada:** `.opcoes button:nth-child(1)`
- **Opção Categorias de Saída:** `.opcoes button:nth-child(2)`
- **Opção Formas de Pagamento:** `.opcoes button:nth-child(3)`
- **Opção Jornadas:** `.opcoes button:nth-child(4)`
- **Opção Personalizações:** `.opcoes button:nth-child(5)`
- **Opção Metas:** `.opcoes button:nth-child(6)`
- **Toggle tema:** `.tema .switch`

### Elementos da Tela de Cadastros
- **Abas:** `.abas button`
- **Formulário:** `.formulario`
- **Campo Nome:** `.formulario .field:nth-child(1) input`
- **Campo Descrição:** `.formulario textarea`
- **Campo Tipo (saídas):** `.formulario select`
- **Botão Salvar:** `.formulario button[type="submit"]`
- **Lista de itens:** `.lista`
- **Cada item:** `.lista article`

### Elementos da Tela de Jornadas
- **Lista de jornadas:** `.conteudo article`
- **Botão Editar:** `.ic-btn`
- **Botão Excluir:** `.ic-btn.danger`

---

## Ordem Recomendada do Tour

Sugestão de fluxo para guiar o usuário pela tela de Configurações:

1. **Menu Inferior** - Explicar navegação para Configurações
2. **Card Perfil** - Explicar acesso a dados pessoais
3. **Categorias de Entrada** - Explicar cadastro de plataformas (origens)
4. **Categorias de Saída** - Explicar cadastro de tipos de despesas
5. **Formas de Pagamento** - Explicar cadastro de formas de pagamento
6. **Jornadas** - Explicar histórico de turnos
7. **Personalizações** - Explicar configuração de tarifa de energia
8. **Metas** - Explicar funcionalidade futura
9. **Toggle Tema** - Explicar alternância entre tema escuro e claro

**Tour opcional - Cadastros (se usuário clicar em alguma opção):**
1. **Abas de Navegação** - Explicar as 3 abas (Entradas, Saídas, Pagamentos)
2. **Formulário de Cadastro** - Explicar campos de nome, descrição e tipo
3. **Botão Adicionar** - Explicar como criar novo cadastro
4. **Lista de Itens** - Explicar visualização dos cadastrados
5. **Ações de Edição/Exclusão** - Explicar como gerenciar itens

**Tour opcional - Personalizações (se usuário clicar):**
1. **Campo Valor do kWh** - Explicar como configurar tarifa de energia
2. **Botão Salvar** - Explicar como persistir a configuração
3. **Explicação de utilidade** - Por que isso é importante para recargas

---

## Dicas Educativas

### Explique o "porquê" de cada configuração
- Não apenas "clique aqui para cadastrar", mas "clique aqui para cadastrar porque..."
- Exemplo: "Cadastre suas origens para saber quanto ganhou em cada plataforma"

### Use exemplos práticos
- "Por exemplo: Cadastre 'Uber' como origem para registrar corridas do Uber"
- "Por exemplo: Cadastre 'Manutenção' como categoria de custo fixo"

### Explique a importância de cada seção
- **Perfil:** "Gerencie seus dados pessoais e segurança da conta"
- **Cadastros:** "Organize suas origens, despesas e formas de pagamento"
- **Jornadas:** "Visualize e corrija o histórico de seus turnos"
- **Personalizações:** "Configure a tarifa de energia para cálculos automáticos"

### Destaque conceitos importantes
- **Origem** = Plataforma de trabalho (Uber, 99, etc)
- **Categoria** = Tipo de despesa (manutenção, lavagem, etc)
- **Custo fixo** = Despesas que se repetem mensalmente
- **Custo variável** = Despesas que variam

---

## Elementos Dinâmicos a Considerar

### Abas de Cadastros
- Mudam conforme o query param `?secao=`
- Cada aba mostra itens diferentes
- **Solução:** Adaptar o tour conforme a aba ativa

### Lista de Itens
- Pode estar vazia se não houver cadastros
- Mensagem de estado vazio aparece
- **Solução:** Verificar se há itens antes de destacar lista

### Toggle de Tema
- Estado pode variar (ativado/desativado)
- **Solução:** Verificar estado atual antes de destacar

---

## Estados do Usuário a Considerar

### Usuário sem dados (primeiro acesso)
- Listas vazias (sem origens, categorias, formas, veículos)
- Sem jornadas registradas
- Sem tarifa de energia configurada
- **Solução:** Explicar que precisa cadastrar primeiro

### Usuário com dados
- Listas preenchidas com cadastros
- Jornadas disponíveis
- Tarifa configurada
- **Solução:** Tour completo com todos os elementos

### Usuário com jornada aberta
- Jornada aparece como "Aberta" no histórico
- **Solução:** Explicar que pode editar ou encerrar a jornada
