<!-- eslint-disable -->
<script setup>
  import FormPayWinner from './FormPayWinner.vue'
  const props = defineProps({
    config: {
      type: Object,
      default: {},
    },
  })
</script>

<template>
  <VRow justify="center">
    <VCard class="payWinner">
      <VCardTitle>
        <span class="text-h5">Datos Personales</span>
      </VCardTitle>
      <VDivider />
      <VCardText>
        <FormPayWinner :config="props.config" />
      </VCardText>
    </VCard>
  </VRow>
</template>