<!-- eslint-disable -->
<script setup>
const props = defineProps({
  config: {
    type: Object,
  }
});

const handlerClick = (value)=>{
  props.config.handler.close(value);
}
</script>

<template class="alert">
  <VCard>
    <VCardTitle class="alert-title">
      <div class="error">
        <VIcon icon="mdi-alert-circle" />
      </div>
    </VCardTitle>
    <VCardText class="pa-4 black--text alert-body">
      {{ config.message }}
    </VCardText>
    <VCardActions class="alert-footer">
      <VSpacer />
      <VBtn @click.prevent="handlerClick(true)">
        <VIcon icon="mdi-check" /> Aceptar
      </VBtn>
    </VCardActions>
  </VCard>
</template>