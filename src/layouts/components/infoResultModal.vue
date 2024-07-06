<!-- eslint-disable -->
<script setup>
  import Modal from '@/shared/components/Modal.vue'
  import { promiseHandler } from '@/shared/promiseHandler';
  import loading from '@/shared/components/Loading.vue'
  import { requestObject } from '@/views/rifa/services/raffle.axios'
  import { alerts } from '@/shared/utils/alerts'
  import { useMagicKeys } from '@vueuse/core'

  const props = defineProps({
    config: {
      type: Object,
    }
  });

  const alert = ref(null)

  const { a, p } = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if (e.key === 'Enter' && e.type === 'keyup')
        e.preventDefault()
    },
  })

  watch(a, key => {
    if (key) {
      setTimeout(async () => {
        await handlerClickCancelTicket()
      }, 50);
    }
  })

  watch(p, key => {
    if (key) {
      setTimeout(() => {
        printTicket()
      }, 50);
    }
  })

  const handlerClickCancelTicket = async () => {
    if (await alerts.confirm('¿Deseas Anular el boleto?')) {
      try {
        alert.value.open({ component: loading, message: 'Anulando boleto...', width: 200 })
        const [response, error] = await promiseHandler({
          promise: requestObject.cancelTicket(props.config.dataModal?.headboard.serial)
        }, true)
        alert.value.close()
        if (error) throw error;
        await alerts.information(response.data.message)
        closeModal()
      } catch (error) {
        console.log(error);
        await alerts[error.template](error.message)
      }
    }
  }

  const printTicket = () => {
    alert.value.open({ component: loading, message: 'Imprimiendo boleto...', width: 200 })
    setTimeout(async () => {
      alert.value.close()
      closeModal()
    }, 2000);
  }

  const closeModal = ()=> {
    props.config.handler.close()
  }
</script>

<template>
  <VRow justify="center">
    <VCard
      class="infoModal"
      :width="props.config.width"
    >
      <VCardTitle>
        <span class="text-h5">Resumen de la operación</span>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VExpansionPanels class="my-4">
          <VExpansionPanel
            v-for="item in props.config?.dataModal?.betsData"
            :key="item?.raffleId"
          >
            <VExpansionPanelTitle class="cart-titleItem">
              <VRow>
                <VCol cols="12">
                  {{ item?.raffleName }}
                  <div><small>Guardados: {{ item?.savedTickets?.length ?? 0 }} / Rechazados: {{ item?.returnedTickets?.length ?? 0 }}</small></div>
                </VCol>
              </VRow>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol
                  v-if="item?.savedTickets?.length > 0"
                  :class="{'v-col-md-6': item?.returnedTickets?.length > 0, 'v-col-md-12': item?.returnedTickets?.length <= 0 }"
                >
                  <VCard
                    class="mx-auto infoModal-numbers"
                    max-width="400"
                  >
                    <VCardTitle>
                      <h5>Números Guardados</h5>
                    </VCardTitle>

                    <VDivider class="mx-4" />

                    <VCardText class="container">
                      <VChipGroup>
                        <VChip
                          v-for="(num, index) in item?.savedTickets"
                          :key="index"
                        >
                          {{ num }}
                        </VChip>
                      </VChipGroup>
                    </VCardText>
                  </VCard>
                </VCol>

                <VCol
                  v-if="item?.returnedTickets?.length > 0"
                  :class="{ 'v-col-md-6': item?.savedTickets?.length > 0, 'v-col-md-12': item?.savedTickets?.length <= 0 }"
                >
                  <VCard
                    class="mx-auto infoModal-numbers"
                    max-width="400"
                  >
                    <VCardTitle>
                      <h5>Números Rechazados</h5>
                    </VCardTitle>

                    <VDivider class="mx-4" />

                    <VCardText class="container">
                      <VChipGroup>
                        <VChip
                          v-for="(num, index) in item?.returnedTickets"
                          :key="index"
                        >
                          {{ num }}
                        </VChip>
                      </VChipGroup>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
      <VCardActions>
        <VBtn @click="handlerClickCancelTicket">
          <VIcon icon="mdi-cancel" /> &nbsp;Anular
        </VBtn>
        <VBtn @click="printTicket">
          <VIcon icon="mdi-printer" /> &nbsp;Imprimir
        </VBtn>
      </VCardActions>
    </VCard>
    <Modal ref="alert" />
  </VRow>
</template>
