<!-- eslint-disable -->
<script setup>
import SearchTicket from '../components/SearchTicket.vue'
import Modal from '@/shared/components/Modal.vue'
import PayWinner from '../components/PayWinner.vue'
import { alerts } from '@/shared/utils/alerts'
import { useMagicKeys } from '@vueuse/core'


const modal = ref(null)
const search = ref(null)
const { F8 } = useMagicKeys()

const handlerClickPay = async (serialConsulted) => {
  if (await alerts.confirm('¿Esta seguro que desea pagar el este ticket? ')) {
    modal.value.open({ component: PayWinner, handler: modal.value, serial: serialConsulted, reset: search.value  })
  }
}

watch(F8, key => {
  if (key) {
    const serial = document.querySelector('.pay-btnYes').getAttribute('data-serial')
    handlerClickPay(serial)
  }
})
</script>

<template>
  <div class="pay">
    <SearchTicket ref="search">
      <template #title>
        Pagar Ticket
      </template>
      <template #buttons="{ serialConsulted }">
        <VRow class="repeatPlay-sticky payTicket-sticky">
          <VCol class="v-col-4 offset-8 text-end">
            <VBtn
              :data-serial="serialConsulted"
              class="pay-btnYes "
              @click="handlerClickPay(serialConsulted)"
            >
              <VIcon icon="mdi-check" /> &nbsp;Pagar Ticket
            </VBtn>
          </VCol>
        </VRow>
      </template>
    </SearchTicket>
    <Modal ref="modal" />
  </div>
</template>