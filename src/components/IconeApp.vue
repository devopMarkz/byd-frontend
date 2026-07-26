<template>
  <svg class="icone-app" :width="tamanho" :height="tamanho" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path v-if="nome === 'painel'" d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" fill="currentColor" stroke="none" />
    <path v-else-if="nome === 'transacoes'" d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'configuracoes'" d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.06 2.06-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20.25h-2.92v-.09a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.06-2.06.06-.06A1.7 1.7 0 0 0 7.22 15 1.7 1.7 0 0 0 5.66 14H5.57v-2.92h.09A1.7 1.7 0 0 0 7.22 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06L8.88 6l.06.06A1.7 1.7 0 0 0 10.82 6.4a1.7 1.7 0 0 0 1.03-1.56v-.09h2.92v.09A1.7 1.7 0 0 0 15.8 6.4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.06 2.06-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.09V14h-.09A1.7 1.7 0 0 0 19.4 15Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    <path v-else-if="nome === 'editar'" d="m4 16.5-.5 4 4-.5L19 8.5 15.5 5 4 16.5ZM13.5 7l3.5 3.5M4 20.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'excluir'" d="M4 7h16m-10 4v6m4-6v6M9 7l.7-2h4.6l.7 2m-9 0 1 13h10l1-13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'baixar'" d="M12 4v10m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'fechar'" d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path v-else-if="nome === 'documento'" d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 13h4m-4 4h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'anexo'" d="m9 12 5.3-5.3a3 3 0 1 1 4.2 4.3l-7.1 7.1a4.5 4.5 0 1 1-6.4-6.4l7-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'carro'" d="M5 16v3m14-3v3M4 13l1.6-5h12.8l1.6 5v4H4v-4Zm3.5.5h.01m8.99 0h.01M4 13h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else-if="nome === 'sair'" d="M10 5H5v14h5m4-10 4 3-4 3m4-3H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    <path v-else d="M4 6h16v12H4zM4 7l8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ nome: string; tamanho?: number }>(), { tamanho: 20 })
</script>

<style scoped>
.icone-app{display:block;flex:none}
</style>
