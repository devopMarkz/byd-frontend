import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { LoginRequest, TokenResponse } from '@/types'
import { extrairMensagemErro } from '@/utils/erro'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const usuario = ref<TokenResponse | null>(carregarUsuario())
  const veiculoPadraoId = ref<string | null>(localStorage.getItem('veiculoPadraoId'))
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  const estaAutenticado = computed(() => !!token.value)

  function carregarUsuario(): TokenResponse | null {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  }

  function salvarSessao(dados: TokenResponse) {
    token.value = dados.accessToken
    usuario.value = dados
    localStorage.setItem('token', dados.accessToken)
    localStorage.setItem('usuario', JSON.stringify(dados))
  }

  async function login(credentials: LoginRequest) {
    carregando.value = true
    erro.value = null
    try {
      const dados = await authService.login(credentials)
      salvarSessao(dados)
      return true
    } catch (e: any) {
      erro.value = extrairMensagemErro(e, 'Erro ao autenticar')
      return false
    } finally {
      carregando.value = false
    }
  }

  function definirVeiculoPadrao(id: string | null) {
    veiculoPadraoId.value = id
    if (id) {
      localStorage.setItem('veiculoPadraoId', id)
    } else {
      localStorage.removeItem('veiculoPadraoId')
    }
  }

  function logout() {
    token.value = null
    usuario.value = null
    veiculoPadraoId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('veiculoPadraoId')

    const rotaLogin = `${import.meta.env.BASE_URL}login`.replace(/\/{2,}/g, '/')
    if (!window.location.pathname.endsWith('/login')) {
      window.location.href = rotaLogin
    }
  }

  return {
    token,
    usuario,
    veiculoPadraoId,
    carregando,
    erro,
    estaAutenticado,
    login,
    definirVeiculoPadrao,
    logout
  }
})
