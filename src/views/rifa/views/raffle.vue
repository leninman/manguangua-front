<!-- eslint-disable -->
<script setup>
  import Tikets from '../components/tickets.vue';
  import loading from '@/shared/components/Loading.vue'
  import Description from '../components/description.vue';
  import { promiseHandler } from '@/shared/promiseHandler';
  import { requestObject } from '../services/raffle.axios';
  import { useRoute } from 'vue-router'
  import { onMounted } from 'vue';
  import { useCartStore } from '@/shared/stores/cart'
  import Modal from '@/shared/components/Modal.vue'
  import '../raffle.scss'
  const props = defineProps({
    refresh: {
      type: String,
      default: '',
    }
  });

  const emit = defineEmits(['refresh'])
  const cart = useCartStore()
  const route = useRoute()
  const tabItems = ref();
  const numberMax = ref(5);
  const heightScreen = ref(screen.height/2)
  const tickets = ref([]);
  const modal = ref(null)
  const isLoading = ref(true)
  const items = [
    {
      title: 'Listado de rifas',
      disabled: false,
      href: '/clientes/rifas',
    }
  ]

  const getData = async () => {
    try {
      const idRaffle = route.query.idRaffle
      modal.value.open({ component: loading, message: 'Cragando apuestas...', width: 200 })
      isLoading.value = true
      const [response, error] = await promiseHandler({
        promise: requestObject.getRaffle(idRaffle)
      })
      modal.value.close()
      isLoading.value = false
      if (error) throw error;
      tabItems.value = response.data
    } catch (error) {
      console.log('Error ', error);
    }
  }

  onMounted(async() => {
    await getData()
  })

  const addCart = () => {
    cart.addRaffle(tickets.value)
  }

  const refreshTickets = (newTickets) => {
    cart.addRaffle(newTickets)
  }

  watch(
    () => props.refresh,
    async (refresh) => {
      console.log(`refresh is: ${refresh}`)
      if(refresh){
        console.log('ENtreee');
        await getData()
        emit('refresh', false)
      }
    }
  )
</script>

<template>
  <div>
    <VRow v-if="!isLoading">
      <VCol
        xs="12"
        sm="12"
        md="4"
      >
        <VCard class="description">
          <Description
            :details="tabItems"
            @add-cart="addCart($event)"
          />
        </Vcard>
      </VCol>

      <VCol
        xs="12"
        sm="12"
        md="8"
      >
        <VCard>
          <Tikets
            v-if="tabItems"
            :tab-items="tabItems"
            :number-max="numberMax"
            :height-screen="heightScreen"
            @refresh-tickets="refreshTickets($event)"
          />
        </VCard>
      <!--
        <VBtn
        class="float-right float-end"
        block
        >
        Comprar boletos
        </VBtn>
      -->
      </VCol>
    </VRow>
    <Modal ref="modal" />
  </div>
</template>
