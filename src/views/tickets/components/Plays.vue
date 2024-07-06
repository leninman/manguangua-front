<!-- eslint-disable -->
<script setup>
  import Modal from '@/shared/components/Modal.vue'
  import { alerts } from '@/shared/utils/alerts'
  import loading from '@/shared/components/Loading.vue'
  import { useRoute } from 'vue-router'

  const props = defineProps({
    data: {
      type: Array,
      default: [],
    },
    isRepeatGame: {
      type: Boolean,
      default: false
    }
  })

  // const emit = defineEmits(['reset'])
  const modal = ref(null)
  const route = useRoute()

  const path = computed(() => route.path)

  //console.log(route.path)


  // const handlerClickRepeatGame = async () => {
  //   if (await alerts.confirm('¿Esta seguro que desea repetir esta jugada?')) {
  //     modal.value.open({ component: loading, message: 'Repitiendo Jugada...', width: 200 })
  //     await cart.repeatGame(props.data)
  //     modal.value.close()
  //     await alerts.success('Jugada cargada al carrito, satisfactoriamente!.')
  //     reset()
  //   }
  // }

  // const reset = () => {
  //   emit("reset");
  // }
</script>

<template>
  <div>
    <VRow>
      <VCol
        v-for="(data, index) in props.data"
        :key="data.raffleId"
        class="v-col-12"
      >
        <VCard
          :class="{ 'mx-auto oddColumn': index % 2 != 0, 'mx-auto': index % 2 == 0 }"
          :title="data.raffleName"
          :subtitle="`Cantidad de números: ${data.ticketNumbers.length} - Subtotal: ${(data.ticketNumbers.length * data.ticketValue).toFixed(2)}`"
        >
          <template #prepend>
            <VAvatar size="100">
              <VImg
                :src="data.images[0]"
                :alt="data.raffleName"
              />
            </VAvatar>
          </template>
          <VCardText>
            <strong>Números Jugados</strong>
            <VChipGroup class="mt-3">
              <VChip
                v-for="ticket in data.ticketNumbers"
                :key="ticket"
              >
                {{ ticket }}
              </VChip>
            </VChipGroup>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <Modal ref="modal" />
  </div>
</template>