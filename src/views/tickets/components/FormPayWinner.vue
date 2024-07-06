<!-- eslint-disable -->
<script setup>
  import { useVuelidate } from '@vuelidate/core'
  import { required, helpers, email, numeric } from '@vuelidate/validators'
  import { requestTicket } from '@/views/tickets/services/ticket.axios'
  import { promiseHandler } from '@/shared/promiseHandler';
  import Modal from '@/shared/components/Modal.vue'
  import { alerts } from '@/shared/utils/alerts'
  import loading from '@/shared/components/Loading.vue'

  const props = defineProps({
    config: {
      type: Object,
      default: {},
    }
  });

  const modal = ref(null)

  const formModels = reactive({
    nameWinner: 'test',
    dniWinner: '123456',
    phoneWinner: '123456',
    emailWinner: 'test@test.com',
    adressWinner: 'test',
    serial: `${props?.config?.serial}` ?? null
  })

  const rules =  {
    nameWinner: {required: helpers.withMessage('El nombre es requerido', required)},
    dniWinner: {required: helpers.withMessage('La cédula es requerida', required), numeric: helpers.withMessage('La cédula debe ser numerica', numeric) },
    phoneWinner: {required: helpers.withMessage('El teléfono es requerido', required), numeric: helpers.withMessage('El teléfono debe ser númerico', numeric) },
    emailWinner: { required: helpers.withMessage('El correo es requerido', required), email: helpers.withMessage('El correo es invalido', email) },
    adressWinner: { required: helpers.withMessage('La dirección es requerida', required) },
    serial: { required }
  }

  const validationForm = useVuelidate(rules, formModels)

  const handlerClickPay = async () => {
    const isValid = await validationForm.value.$validate()
    if(isValid){
      try {
        modal.value.open({ component: loading, message: 'Pagando ticket...', width: 200 })
        const [response, error] = await promiseHandler({
          promise: requestTicket.payTicket(formModels)
        })
        modal.value.close()
        if (error) throw error;
        await alerts.success(response?.data?.message ?? 'Ticket pagado con éxito.')
        printTicket()
      } catch (error) {
        console.log(error)
        props.config.handler.close()
        await alerts[error.template ?? 500](error?.message)
      }
    }
  }

  const printTicket = () => {
    modal.value.open({ component: loading, message: 'Imprimiendo boleto...', width: 200 })
    setTimeout(async () => {
      await modal.value.close()
      await alerts.success('Ticket impreso con éxito.')
      await props.config.reset.reset()
      props.config.handler.close()
    }, 2000);
  }
</script>

<template>
  <form type>
    <VRow>
      <VCol cols="12">
        <VTextField
          v-model="formModels.nameWinner"
          label="Nombre"
          variant="outlined"
          :error-messages="validationForm.nameWinner.$error ? validationForm.nameWinner.$errors[0].$message : ''"
        />
      </VCol>
      <VCol
        cols="12"
        class="pt-2"
      >
        <VTextField
          v-model="formModels.dniWinner"
          label="Cédula"
          variant="outlined"
          :error-messages="validationForm.dniWinner.$error ? validationForm.dniWinner.$errors[0].$message : ''"
        />
      </VCol>
      <VCol
        cols="12"
        class="pt-2"
      >
        <VTextField
          v-model="formModels.phoneWinner"
          label="Teléfono"
          variant="outlined"
          :error-messages="validationForm.phoneWinner.$error ? validationForm.phoneWinner.$errors[0].$message : ''"
        />
      </VCol>
      <VCol
        cols="12"
        class="pt-2"
      >
        <VTextField
          v-model="formModels.emailWinner"
          label="Correo electronico"
          variant="outlined"
          :error-messages="validationForm.emailWinner.$error ? validationForm.emailWinner.$errors[0].$message : ''"
        />
      </VCol>
      <VCol
        cols="12"
        class="pt-2"
      >
        <VTextField
          v-model="formModels.adressWinner"
          label="Dirección"
          variant="outlined"
          :error-messages="validationForm.adressWinner.$error ? validationForm.adressWinner.$errors[0].$message : ''"
        />
      </VCol>
      <VCol cols="12">
        <VBtn
          block
          @click.prevent="handlerClickPay"
        >
          Guardar ganador
        </VBtn>
      </VCol>
    </VRow>
    <Modal ref="modal" />
  </form>
</template>