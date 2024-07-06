<!-- eslint-disable -->
<script setup>
import SearchTicket from '../components/SearchTicket.vue'
import Modal from '@/shared/components/Modal.vue'
import { promiseHandler } from '@/shared/promiseHandler'
import { requestTicket } from '@/views/tickets/services/ticket.axios'
import { alerts } from '@/shared/utils/alerts'
import loading from '@/shared/components/Loading.vue'
import { useMagicKeys } from '@vueuse/core'

const modal = ref(null)
const search = ref(null)
const { F8 } = useMagicKeys()

const handlerClickCancel = async (serial) => {
  if (await alerts.confirm('¿Esta seguro que desea anular este ticket?')) {
    try {
      modal.value.open({ component: loading, message: 'Anulando Ticket...', width: 200 })
      const [response, error] = await promiseHandler({
        promise: requestTicket.cancelTicket(serial)
      }, true)
      modal.value.close()
      if (error) throw error;
      await alerts.information(response.data.message)
      search.value.reset()
    } catch (error) {
      await alerts[error.template](error.message)
    }
  }
}

watch(F8, key => {
  if (key) {
    const serial = document.querySelector('.cancel-btnYes').getAttribute('data-serial')
    handlerClickCancel(serial)
  }
})
</script>

<template>
  <div class="cancel">
    <SearchTicket ref="search">
      <template #title>
        Anular Ticket
      </template>
      <template #buttons="{ serialConsulted }">
        <VRow class="repeatPlay-sticky cancelTicket-sticky">
          <VCol class="v-col-4 offset-8 text-end">
            <VBtn
              class="cancel-btnYes"
              :data-serial="serialConsulted"
              @click="handlerClickCancel(serialConsulted)"
            >
              <VIcon icon="mdi-check" /> &nbsp;Anular Ticket
            </VBtn>
          </VCol>
        </VRow>
      </template>
    </SearchTicket>
    <Modal ref="modal" />
  </div>
</template>