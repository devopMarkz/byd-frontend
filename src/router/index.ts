import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/PainelView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/jornada',
      name: 'jornada',
      component: () => import('@/views/JornadaRapidaView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/personalizacoes',
      name: 'personalizacoes',
      component: () => import('@/views/PersonalizacoesView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/veiculos',
      name: 'veiculos',
      component: () => import('@/views/VeiculoView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('@/views/ConfiguracoesNovaView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/transacoes',
      name: 'transacoes',
      component: () => import('@/views/TransacoesNovaView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/transacoes/nova',
      name: 'nova-transacao',
      component: () => import('@/views/FormularioTransacaoView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/transacoes/recarga',
      name: 'nova-recarga',
      component: () => import('@/views/FormularioRecargaView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/transacoes/recarga/editar/:id',
      name: 'editar-recarga',
      component: () => import('@/views/FormularioRecargaView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/transacoes/editar/:id',
      name: 'editar-transacao',
      component: () => import('@/views/FormularioTransacaoView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/configuracoes/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/configuracoes/jornadas',
      name: 'jornadas-configuracao',
      component: () => import('@/views/JornadasConfiguracaoView.vue'),
      meta: { requerAutenticacao: true }
    },
    {
      path: '/configuracoes/cadastros',
      name: 'cadastros-configuracao',
      component: () => import('@/views/CadastrosView.vue'),
      meta: { requerAutenticacao: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requerAutenticacao && !auth.estaAutenticado) {
    next('/login')
  } else if (to.path === '/login' && auth.estaAutenticado) {
    next('/')
  } else {
    next()
  }
})

export default router
