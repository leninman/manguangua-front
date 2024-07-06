<!-- eslint-disable -->
<script setup>
import Plays from './Plays.vue'
import InformationPoster from './InformationPoster.vue'
import Modal from '@/shared/components/Modal.vue'
import { alerts } from '@/shared/utils/alerts'
import loading from '@/shared/components/Loading.vue'
import { promiseHandler } from '@/shared/promiseHandler'
import { requestTicket } from '@/views/tickets/services/ticket.axios.js'
import { useMagicKeys } from '@vueuse/core'
//import '../raffle.scss'

const modal = ref(null)
const serial = ref(null)
const serialRef = ref(null)
const game = ref([])
const serialConsulted = ref(null)
const message = ref('No existe registros')
const { Enter } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'Enter' && e.type === 'keyup')
      e.preventDefault()
  },
})


const handlerClickSearch = async () => {
  if (serial.value != '' && serial.value !== null) {
    try {
      modal.value.open({ component: loading, message: 'Buscando Serial...', width: 200 })
      const [response, error] = await promiseHandler({
        promise: requestTicket.getTicketBySerial(serial.value)
      }, true)
      modal.value.close()
      if (error) throw error;
      const data = response?.data?.data
      game.value = data !== null ? data : []
      serialConsulted.value = serial.value
      console.log(serialConsulted.value);
      if (data === null) {
        message.value = 'Serial no encontrado'
      }

    } catch (error) {
      console.log(error);
      await alerts[error.template ?? 'error'](error.message)
    }
  }
}

const reset = () => {
  game.value = []
  serial.value = null
  message.value = 'No existe registros'
}

onMounted(() => {
  serialRef.value.focus()
})

watch(Enter, key => {
  if (key) {
    setTimeout(async () => {
      await handlerClickSearch()
    }, 50);
  }
})

defineExpose({reset})
</script>

<template>
  <div>
    <VRow>
      <VCol class="v-col-12">
        <h2 class="title-h2">
          <slot name="title" />
        </h2>
        <VDivider />
      </VCol>
    </VRow>
    <VRow>
      <VCol class="v-col-4 offset-4">
        <VTextField
          ref="serialRef"
          v-model="serial"
          variant="solo"
          label="Buscar por serial"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          maxlength="10"
          @click:append-inner="handlerClickSearch"
        />
      </VCol>
    </VRow>

    <InformationPoster
      v-if="game.length <= 0"
      class="mt-5 pt-5"
      :message="message"
    />
    <Plays
      v-else
      :data="game"
    />

    <slot
      v-if="game.length > 0"
      name="buttons"
      :data="game"
      :serial-consulted="serialConsulted"
    />
    <Modal ref="modal" />
  </div>
</template>