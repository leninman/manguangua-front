<!-- eslint-disable -->
<script setup>
  const props = defineProps({
    message: {
      type: String,
      default: 'No existe registros',
    },
  })
</script>

<template>
  <div>
    <VRow>
      <VCol class="v-col-12">
        <VCard
          class="mx-auto"
          max-width="500"
          variant="flat"
        >
          <VCardItem>
            <VCardTitle class="text-center">
              <div class="mb-5 text-h3 repeatPlay-informationIcon">
                <VIcon icon="mdi-information-outline" />
              </div>
              <div class="text-h4 mb-5 pb-5">
                {{ props.message }}
              </div>
            </VCardTitle>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>