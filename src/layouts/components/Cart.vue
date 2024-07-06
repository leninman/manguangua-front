<!-- eslint-disable -->
<script setup>
import Modal from '@/shared/components/Modal.vue'
import { alerts } from '@/shared/utils/alerts'
import  loading  from '@/shared/components/Loading.vue'
import { promiseHandler } from '@/shared/promiseHandler';
import { useCartStore } from '@/shared/stores/cart'
import { requestObject } from '@/views/rifa/services/raffle.axios'
import InfoResultModal from "./infoResultModal.vue";
import { useMagicKeys } from '@vueuse/core'

const props = defineProps({
  drawer: {
    type: Boolean,
    default: false,
  },
})

const { Enter } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'Enter' && e.type === 'keyup')
      e.preventDefault()
  },
})

const emit = defineEmits(['close', 'refreshList'])
const cart = useCartStore()
const isDrawer = ref(null)
const modal = ref(null)
const isVisible = ref(false)

watch(() => props.drawer, () => {
  isDrawer.value = !isDrawer.value
})

watch(Enter, key => {
  if (key){
    setTimeout(async () => {
      await handlerClickBuy()
    }, 50);
  }
})

function buttonClick() {
  isDrawer.value = !isDrawer.value
}

const deleteTicket = (idRaffle, ticket) => {
  cart.removeItemRaffle(idRaffle,ticket)
}

const deleteRaffle = (idRaffle) => {
  cart.removeRaffle(idRaffle)
}

const handlerClickBuy = async() => {

  const element = document.querySelector('.v-navigation-drawer--active')
  if((!element || element == null)) {
    return;
  }

  if(await alerts.confirm('¿Esta seguro de comprar estos números?') ) {
    try {
      const payload = cart.getFormatPayload
      modal.value.open({ component: loading, message: 'Guardando...', width: 200 })
      const [response, error] = await promiseHandler({
        promise: requestObject.buyTickets(payload)
      }, true)
      modal.value.close()

      if (error) throw error;
      cart.setLastSerial(response?.data?.data?.headboard.serial)
      cart.flushRaffle()
      emit('refreshList')
      await modal.value.open({component: InfoResultModal, handler: modal.value, dataModal: response?.data?.data, width: 800 })

    } catch (error) {
      console.log(error);
      await alerts[error.template](error.message)
    }
  }
}

</script>

<template>
  <div class="containerCar">
    <VNavigationDrawer
      v-model="isDrawer"
      temporary
      location="right"
      :width="500"
      class="cart"
    >
      <h2 class="v-card-title title-h2 cart-header">
        <VIcon icon="mdi-cart-minus" /> Carrito de Rifas
        <VIcon
          class="cart-header-close"
          icon="mdi-window-close"
          @click.stop="buttonClick"
        />
      </h2>
      <VDivider />

      <div class="cart-body container">
        <VExpansionPanels
          variant="inset"
          class="my-4"
        >
          <VExpansionPanel
            v-for="item in cart.items"
            :key="item.idRaffle"
          >
            <VExpansionPanelTitle class="cart-titleItem">
              <VRow>
                <VCol cols="2">
                  <VAvatar class="rounded-shaped">
                    <VImg
                      :src="item.images[0]"
                      :alt="item.name"
                    />
                  </VAvatar>
                </VCol>
                <VCol cols="10">
                  {{ item.name }}
                  <div><small>Cantidad: {{ cart.getRaffleById(item.idRaffle)?.tickets?.length }} - Subtotal: {{ cart.getRaffleById(item.idRaffle)?.tickets?.length * cart.getRaffleById(item.idRaffle)?.priceNumber }} USD</small></div>
                </VCol>
              </VRow>


              <VIcon
                icon="mdi-delete"
                class="cart-titleItem-delete"
                @click.stop="deleteRaffle(item.idRaffle)"
              />
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VChipGroup>
                <VChip
                  v-for="ticket in item.tickets"
                  :key="ticket"
                >
                  {{ ticket }} &nbsp;&nbsp;<VIcon
                    icon="mdi-window-close"
                    @click.stop="deleteTicket(item.idRaffle, ticket)"
                  />
                </VChip>
              </VChipGroup>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
      <div class="cart-footer cuerpo-texto-2">
        <div class="pt-5 pb-2 d-flex flex-row justify-space-around">
          <span><VIcon icon="mdi-cart-minus" /> {{ cart.totalNumbers }} numero (s)</span>
          <span>Subtotal: {{ cart.totalToPay }} USD</span>
        </div>
        <VBtn
          :disabled="cart.totalNumbers <= 0"
          block
          class="cart-botton"
          @click="handlerClickBuy"
        >
          Comprar Boletos
        </VBtn>
      </div>
    </VNavigationDrawer>
    <Modal ref="modal" />
  </div>
</template>