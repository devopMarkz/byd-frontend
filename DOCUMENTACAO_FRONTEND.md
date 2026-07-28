# Documentação do Frontend - BYD Dolphin

Esta é a documentação geral do sistema frontend. Para implementação de tutoriais com Driver.js, consulte os documentos específicos de cada seção do menu inferior.

---

## Documentos Específicos

A documentação está dividida em 3 arquivos separados, cada um focado em uma seção do menu inferior:

### 1. [DOCUMENTACAO_PAINEL.md](./DOCUMENTACAO_PAINEL.md)
Documentação completa do Painel (Dashboard).

**Conteúdo:**
- Visão geral do Painel
- Conceitos: Ganho Bruto vs Líquido, Origem como plataforma
- Seleção de período (diário, semanal, mensal, anual, personalizado)
- Resumo financeiro (Receita, Despesas, Saldo)
- Estatísticas detalhadas (9 métricas com fórmulas e exemplos)
- Receita por origem (plataformas)
- Última jornada
- Botão flutuante (FAB) de jornada
- Seletores CSS para Driver.js
- Ordem recomendada do tour

**Utilize este documento quando:** For implementar o tutorial do Painel.

---

### 2. [DOCUMENTACAO_TRANSACOES.md](./DOCUMENTACAO_TRANSACOES.md)
Documentação completa de Transações.

**Conteúdo:**
- Visão geral de Transações
- Conceitos: Tipos de transações (Entradas, Saídas, Recargas)
- Abas de tipo
- Filtros (data, origem, categoria)
- Lista de transações
- Modal de preview/detalhes
- Modal de confirmação de exclusão
- Botão flutuante (FAB) nova transação
- Formulário de nova entrada (receita)
- Formulário de nova saída (despesa)
- Formulário de nova recarga
- Funcionalidades especiais (cálculos automáticos)
- Seletores CSS para Driver.js
- Ordem recomendada do tour

**Utilize este documento quando:** For implementar o tutorial de Transações.

---

### 3. [DOCUMENTACAO_CONFIGURACOES.md](./DOCUMENTACAO_CONFIGURACOES.md)
Documentação completa de Configurações.

**Conteúdo:**
- Visão geral de Configurações
- Card de perfil
- Categorias de entrada (origens)
- Categorias de saída
- Formas de pagamento
- Jornadas (histórico)
- Personalizações (tarifa de energia)
- Metas (funcionalidade futura)
- Toggle de tema
- Tela de perfil (edição de dados pessoais)
- Tela de cadastros (origens, categorias, formas)
- Tela de jornadas (histórico e edição)
- Tela de personalizações (tarifa energia)
- Tela de veículos (frota)
- Seletores CSS para Driver.js
- Ordem recomendada do tour

**Utilize este documento quando:** For implementar o tutorial de Configurações.

---

## Conceitos Fundamentais do Sistema

### O que é uma "Origem"?
**Origem** refere-se às **plataformas de trabalho** onde você recebe corridas ou serviços, como:
- Uber
- 99
- InDrive
- Flash
- Outras plataformas de transporte

Cada origem representa uma fonte de receita diferente, permitindo que você acompanhe quanto ganhou em cada plataforma separadamente.

### Ganho Bruto vs Ganho Líquido
- **Ganho Bruto (Receita):** É o valor total que você recebeu das plataformas, antes de descontar qualquer despesa. É o dinheiro que entra na sua conta.
- **Ganho Líquido (Lucro):** É o valor que realmente sobra no seu bolso após descontar todas as despesas (combustível/energia, manutenção, lavagem, alimentação, etc). É calculado como: Receita - Despesas.

### O que é uma Jornada?
Uma **Jornada** representa o seu turno de trabalho, desde o momento em que você sai de casa para trabalhar até o momento em que encerra as atividades. Durante a jornada, você pode:
- Registrar o horário de início e fim
- Fazer pausas (almoço, descanso)
- Registrar odômetro e bateria (para veículos elétricos)
- Vincular suas receitas e despesas a esse período

### O que são Recargas?
**Recargas** são os registros de abastecimento de energia do seu veículo elétrico. O sistema calcula automaticamente:
- Quantos kWh foram consumidos
- Custo total da recarga
- Tarifa por kWh (preço da energia)

---

## Estrutura do Menu Inferior

O sistema possui 3 itens principais no menu de navegação inferior:
- **Painel** (`/`) - Dashboard financeiro e estatísticas de desempenho
- **Transações** (`/transacoes`) - Gestão de entradas (receitas), saídas (despesas) e recargas de energia
- **Configurações** (`/configuracoes`) - Configurações do sistema, cadastros e perfil do motorista

---

## Sistema de Roteamento

### Rotas Principais
- `/login` - Tela de login
- `/` - Painel (dashboard)
- `/transacoes` - Lista de transações
- `/configuracoes` - Configurações

### Rotas Secundárias
- `/jornada` - Jornada rápida
- `/personalizacoes` - Personalizações (tarifa energia)
- `/veiculos` - Gestão de veículos
- `/configuracoes/perfil` - Perfil do usuário
- `/configuracoes/jornadas` - Histórico de jornadas
- `/configuracoes/cadastros` - Cadastros (origens, categorias, formas)

### Rotas de Formulários
- `/transacoes/nova` - Nova transação (entrada/saída)
- `/transacoes/nova?tipo=ENTRADA` - Nova entrada
- `/transacoes/nova?tipo=SAIDA` - Nova saída
- `/transacoes/recarga` - Nova recarga
- `/transacoes/editar/:id` - Editar transação
- `/transacoes/recarga/editar/:id` - Editar recarga

---

## Como Usar Esta Documentação

### Para Implementação de Tutoriais com Driver.js

1. **Decida qual seção implementar primeiro:**
   - Comece pelo Painel (DOCUMENTACAO_PAINEL.md)
   - Depois Transações (DOCUMENTACAO_TRANSACOES.md)
   - Por fim Configurações (DOCUMENTACAO_CONFIGURACOES.md)

2. **Abra o documento específico da seção:**
   - Cada documento contém seletores CSS específicos
   - Cada documento tem ordem recomendada do tour
   - Cada documento explica conceitos importantes

3. **Siga a ordem recomendada do tour:**
   - Os documentos sugerem um fluxo lógico
   - Adapt conforme as necessidades do seu usuário
   - Considere estados diferentes (usuário com/sem dados)

4. **Use os seletores CSS fornecidos:**
   - Cada documento lista seletores CSS específicos
   - Teste os seletores antes de implementar
   - Adapte se necessário conforme mudanças no código

---

## Observações Gerais

### Responsividade
- **Mobile (< 768px):** Layout otimizado para telas pequenas
- **Tablet/Desktop (≥ 768px):** Layout aproveitando espaço horizontal
- Menu inferior flutuante em desktop (700px+)

### Temas
- **Tema Escuro (padrão):** Otimizado para uso noturno
- **Tema Claro:** Alternativo para uso diurno
- Preferência salva no localStorage

### Atalhos de Teclado
- **Escape:** Fecha modais em todas as telas

---

## Conclusão

Esta documentação geral serve como índice para os documentos específicos de cada seção. Para implementação detalhada de tutoriais com Driver.js, consulte os arquivos:
- DOCUMENTACAO_PAINEL.md
- DOCUMENTACAO_TRANSACOES.md
- DOCUMENTACAO_CONFIGURACOES.md
