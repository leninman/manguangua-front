<!-- eslint-disable -->
<script setup>
  const props = defineProps({
    dialog: {
      type: Boolean,
      default: false,
    },
    description: {
      default: '',
    },
  })

  const isShow = toRef(props, 'dialog')

  const emit = defineEmits(['close'])

  function buttonClick() {
    emit('close')
  }
</script>

<template>
  <VDialog
    v-model="isShow"
    persistent
    width="600"
    hide-overly="true"
  >
    <VForm ref="formModal">
      <VCard>
        <VCardTitle>
          <span class="text-h5">{{ props.description.title }}</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <br>
            <VRow>
              <VCol cols="12">{{ props.description.description }}</VCol>
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="buttonClick"
          >
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>