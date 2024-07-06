<!-- eslint-disable -->
<script setup>
  import SearchTicket from '../components/SearchTicket.vue'
  import Modal from '@/shared/components/Modal.vue'
  import { alerts } from '@/shared/utils/alerts'
  import loading from '@/shared/components/Loading.vue'
  import { useCartStore } from '@/shared/stores/cart'
  import { useMagicKeys } from '@vueuse/core'

  const modal = ref(null)
  const cart = useCartStore()
  const search = ref(null)
  const { F8 } = useMagicKeys()

  const handlerClickRepeatGame = async (data) => {
    if (await alerts.confirm('¿Esta seguro que desea repetir esta jugada?')) {
      modal.value.open({ component: loading, message: 'Repitiendo Jugada...', width: 200 })
      await cart.repeatGame(data)
      modal.value.close()
      await alerts.success('Jugada cargada al carrito, satisfactoriamente!.')
      search.value.reset()
    }
  }

  watch(F8, key => {
    if (key) {
      const data = document.querySelector('.repeatPlay-btnYes').getAttribute('data-info')
      handlerClickRepeatGame(JSON.parse(data))
    }
  })
</script>

<template>
  <div class="repeatPlay">
    <SearchTicket ref="search">
      <template #title>
        Repetir Jugada
      </template>
      <template #buttons="{ data }">
        <VRow class="repeatPlay-sticky payTicket-sticky">
          <VCol class="v-col-4 offset-8 text-end">
            <VBtn
              :data-info="JSON.stringify(data)"
              class="repeatPlay-btnYes "
              @click="handlerClickRepeatGame(data)"
            >
              <VIcon icon="mdi-check" /> &nbsp;Repetir Jugada
            </VBtn>
          </VCol>
        </VRow>
      </template>
    </SearchTicket>
    <Modal ref="modal" />
  </div>
</template>