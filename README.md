# Ride Profit - Frontend

Interface web do Ride Profit, desenvolvida com Vue 3, TypeScript, Vite, Pinia e Vue Router.

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- Backend rodando em `http://localhost:8080`

## Configuração

O arquivo `.env.development` já está configurado:

```
VITE_API_BASE_URL=/api
```

O proxy do Vite redireciona `/api` para `http://localhost:8080`.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

Acesse `http://localhost:5173`.

## Build

```bash
npm run build
```

## Estrutura

- `src/services` - comunicação com a API via Axios
- `src/stores` - estado global com Pinia
- `src/views` - telas principais
- `src/router` - configuração de rotas
- `src/types` - tipos TypeScript

## Telas

- `/login` - autenticação
- `/` - dashboard financeiro
- `/receita` - lançamento rápido de receita
- `/despesa` - lançamento rápido de despesa
