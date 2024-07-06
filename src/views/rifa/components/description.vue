<!-- eslint-disable -->
<script setup>
import { useCartStore } from '@/shared/stores/cart'
import { useRoute } from 'vue-router';
import { dateFormat } from '@/shared/helpers/date.helper'

  const props = defineProps({
    details: {
      type: Object
    }
  });
  const cartStore = useCartStore()
  const emit = defineEmits(['addCart'])
  const route = useRoute()

  const handlerClick =()=> {
    emit('addCart')
  }
</script>

<template>
  <div class="description-img">
    <VCarousel
      cycle
      height="200"
      hide-delimiter-background
      :show-arrows="false"
    >
      <VCarouselItem
        v-for="(image, index) in props.details?.product.images"
        :key="index"
        height="200"
        :src="image"
        cover
      />
    </VCarousel>
  </div>
  <div>
    <h2 class="mt-5">
      {{ props.details?.product.description }}
    </h2>
  </div>
  <br>
  <div>
    <ul class="description-features">
      <li>El sorteo se realizará el <span>{{ dateFormat(props.details?.lotteryDatetime) }}</span></li>
      <li>Valor comercial del producto: <span>{{ props.details?.product?.commercialValue }}{{ props.details?.currency.currencyCode }}</span></li>
      <li>Precio del ticket: {{ props.details?.ticketValue }}{{ props.details?.currency.currencyCode }}</li>
      <li>Nombre de la institución: {{ props.details?.institutionName }}</li>
      <li>Numero de licencia: {{ props.details?.numberLicensePermission }}</li>
      <li>Fecha de la licencia: {{ props.details?.dateLicense }}</li>
      <li>Numero de registro: {{ props.details?.registryNumberConalot }}</li>
      <li>Periodo de expiracion: {{ props.details?.expirationPeriod }}</li>
      <li>Probabilidad de ganar: {{ props.details?.probabilityWin }}</li>
      <li>Lugar del sorteo: {{ props.details?.rafflePlace }}</li>
      <br>
    </ul>
  </div>
  <div class="description-warning">
    <div class="description-warning-icon">
      <VIcon icon="mdi-alert" /> <span>ADVERTENCIA</span>
    </div>
    {{ props.details?.gamingWarning }}
  </div>
</template>