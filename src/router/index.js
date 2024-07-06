/* eslint-disable */
import { useAuthStore } from '@/services/auth'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/dashboard" },
    {
      path: "/",
      component: () => import("../layouts/default.vue"),
      children: [
        {
          path: "dashboard",
          component: () => import("../pages/dashboard.vue"),
        },
        {
          path: "admin/config/estatus",
          component: () => import("../views/configuraciones/estatus.vue"),
        },
        {
          path: "admin/config/monedas",
          component: () => import("../views/configuraciones/monedas.vue"),
        },
        {
          path: "clientes/boletos",
          component: () => import("../views/rifa/views/raffle.vue"),
        },
        {
          path: "clientes/rifas",
          component: () => import("../views/rifa/views/index.vue"),
        },
        {
          path: "clientes/repetir-jugada",
          component: () => import("../views/tickets/views/RepeatPlay.vue"),
        },
        {
          path: "clientes/pagar-boleto",
          component: () => import("../views/tickets/views/Pay.vue"),
        },
        {
          path: "clientes/anular-ticket",
          component: () => import("../views/tickets/views/Cancel.vue"),
        },
        {
          path: "account-settings",
          component: () => import("../pages/account-settings.vue"),
        },
        {
          path: "typography",
          component: () => import("../pages/typography.vue"),
        },
        {
          path: "icons",
          component: () => import("../pages/icons.vue"),
        },
        {
          path: "cards",
          component: () => import("../pages/cards.vue"),
        },
        {
          path: "tables",
          component: () => import("../pages/tables.vue"),
        },
        {
          path: "form-layouts",
          component: () => import("../pages/form-layouts.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("../layouts/blank.vue"),
      children: [
        {
          path: "login",
          component: () => import("../pages/login.vue"),
        },
        {
          path: "login-client",
          component: () => import("../pages/login-agent.vue"),
        },
        {
          path: "register",
          component: () => import("../pages/register.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          component: () => import("../pages/[...all].vue"),
        },
      ],
    },
  ],
});

router.beforeEach( async (to) => {
  const publicPages = ['/login-client', '/login','/register']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore();
  if(authRequired && !auth.user){
    auth.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
