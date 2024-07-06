<!-- eslint-disable  -->
<script setup>
  defineProps({
    config: {
      type: Object,
    }
  });
</script>

<template>
  <VCard>
    <VCardText>
      {{ config.message }}
      <VProgressLinear
        indeterminate
        color="white"
        class="mb-0"
      />
    </VCardText>
  </VCard>
</template>