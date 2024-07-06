<!-- eslint-disable vue/v-on-event-hyphenation -->
 <!-- eslint-disable  -->
<script setup>
  import '../raffle.scss'
  import {promiseHandler} from '../../../shared/promiseHandler'
  import {requestObject}  from '../services/raffle.axios'
  import Modal from '@/shared/components/Modal.vue'
  import loading from '@/shared/components/Loading.vue'
  import { computed } from 'vue';
  import  DescriptionModal from '../components/descriptionModal.vue'
  import { useRouter } from 'vue-router'

  const raffleArray = ref([])
  const showDialog = ref(false)
  const description = ref('')
  const router = useRouter()
  const modal = ref(null)

  const getList = (async() => {
    try {
      modal.value.open({ component: loading, message: 'Cragando...', width: 200 })
      const [response, error] = await promiseHandler({
        promise: requestObject.getListRaffle()
      })
      modal.value.close()
      if (error) throw error;
      raffleArray.value = response?.data
    } catch (error) {
      console.log(error);
    }
  })

  const showModal = ((value) => {
    showDialog.value = true
    description.value = value
  })

  const resetDataDialog = (flag) => {
    showDialog.value = flag
  }

  onMounted(async() => {
    await getList()
  })

  const raffles = computed(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    raffleArray.value = raffleArray.value.map(item => ({
      ...item,
      lotteryDatetime: new Date(item.lotteryDatetime).toLocaleDateString(undefined, options),
      show: false
    }));
    return raffleArray.value
  })

  const clickHandler = (idRaffle) => {
    router.push({
      path: '/clientes/boletos',
      query: { idRaffle },
    })
  }
</script>

<template>
  <div>
    <VRow>
      <VCol
        v-for="raffle in raffles"
        :key="raffle.id"
        md="2"
        class="raffle"
      >
        <VCard class="raffle-card">
          <div class="raffle-card-date">
            {{ raffle.lotteryDatetime }}
          </div>
          <VCarousel
            cycle
            height="200"
            show-arrows="hover"
          >
            <VCarouselItem
              v-for="(image, index) in raffle?.product.images"
              :key="index"
              height="200"
              :src="image"
              cover
            />
          </VCarousel>
          <!--
            <VImg
            :src="pages6"
            cover
            height="200"
            aspect-ratio="16/9"
            />
          -->

          <VCardItem>
            <VCardTitle class="text-subtitle-1 raffle-card-title">
              {{ raffle.title }}
            </VCardTitle>
          </VCardItem>

          <VCardText class="raffle-card-description">
            <ul class="text-subtitle-2">
              <li>Precio del boleto: {{ raffle.amountTicket }} {{ raffle.acronymCurrency }}</li>
              <li>Precio del mercado: {{ raffle.productCost }} {{ raffle.symbolMoney }}</li>
            </ul>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn @click="showModal(raffle?.product)">
              Ver mas...
            </VBtn>
          </VCardActions>
          <VBtn
            block
            class="rounded-t-0 raffle-card-button"
            @click="clickHandler(raffle.id)"
          >
            Comprar boletos
          </VBtn>
        </VCard>
      </VCol>
    </VRow>
    <DescriptionModal
      :dialog="showDialog"
      :description="description"
      @close="resetDataDialog($event)"
    />
    <Modal ref="modal" />
  </div>
</template>