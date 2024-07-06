<!-- eslint-disable -->
<script setup>
  import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
  import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
  import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
  import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
  import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
  import { useTheme } from 'vuetify'

  // Components
  import Footer from '@/layouts/components/Footer.vue'
  import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
  import UserProfile from '@/layouts/components/UserProfile.vue'
  import Cart from './Cart.vue'
  import Modal from '@/shared/components/Modal.vue'
  import { cancelLast } from '@/shared/helpers/ticket.helper'
  import { useMagicKeys } from '@vueuse/core'

  const emit = defineEmits(["refresh"])

  const { F4, r, c, a, Shift_a, Shift_p } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      console.log('Precione esto: ', e.key)
      if (e.key === 'Enter' && e.type === 'keyup')
        e.preventDefault()
    },
  })

  const drawer = ref(false)
  const modal = ref(null)

  const vuetifyTheme = useTheme()

  const upgradeBanner = computed(() => {
    return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
  })

  const cancelLastTicket = async() => {
    await cancelLast(modal.value)
  }

  watch(F4, key => {
    if (key){
      openCart()
    }
  })

  watch(r, key => {
    if (key) {
      document.querySelector('.repeatPlays > a').click()
    }
  })
  watch(c, key => {
    if (key) {
      document.querySelector('.paysTickets > a').click()
    }
  })
  watch(a, key => {
    if (key) {
      document.querySelector('.cancelTickets > a').click()
    }
  })
  watch(Shift_a, key => {
    if (key) {
      document.querySelector('.cancelLastTickects > a').click()
    }
  })
  watch(Shift_p, key => {
    if (key) {
      document.querySelector('.printLastTicket > a').click()
    }
  })

  const openCart = ()=> {
    drawer.value = !drawer.value
  }

  const refreshList = () => {
    emit('refresh', true)
  }
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <VSpacer />

        <IconBtn
          class="me-2"
          @click.stop="openCart"
        >
          <VIcon icon="mdi-cart-minus" />
        </IconBtn>

        <NavbarThemeSwitcher class="me-2" />

        <UserProfile />
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: 'Dashboard',
          icon: 'bx-home',
          to: '/dashboard',
        }"
      />
      <!-- 👉 Rifas -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Rifas',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Listado de rifas',
          icon: 'bx-user-plus',
          to: '/clientes/rifas',
        }"
      />
      <!-- 👉 User Configuración -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Tickets',
        }"
      />
      <VerticalNavLink
        class="repeatPlays"
        :item="{
          title: 'Repetir Jugada',
          icon: 'mdi-repeat',
          to: '/clientes/repetir-jugada',
        }"
      />
      <VerticalNavLink
        class="paysTickets"
        :item="{
          title: 'Pagar ticket',
          icon: 'mdi-credit-card-outline',
          to: '/clientes/pagar-boleto',
        }"
      />
      <VerticalNavLink
        class="cancelTickets"
        :item="{
          title: 'Anular ticket',
          icon: 'mdi-close-box-multiple-outline',
          to: '/clientes/anular-ticket',
        }"
      />
      <VerticalNavLink
        class="cancelLastTickects"
        :item="{
          title: 'Anular último ticket',
          icon: 'mdi-cancel',
        }"
        @click="cancelLastTicket"
      />
      <VerticalNavLink
        class="printLastTicket"
        :item="{
          title: 'Reimprimir el último ticket',
          icon: 'mdi-printer',
          to: '/admin/config/clientes',
        }"
      />
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
    <!-- CARRITO -->
    <Cart
      :drawer="drawer"
      @refresh-list="refreshList"
    />
    <Modal ref="modal" />
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
