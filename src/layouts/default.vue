<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'

const refresh = ref (false)

const isRefresh = value => {
  refresh.value = value
}
</script>

<template>
  <DefaultLayoutWithVerticalNav @refresh="isRefresh($event)">
    <RouterView v-slot="{ Component }">
      <Component
        :is="Component"
        :refresh="refresh"
        @refresh="isRefresh($event)"
      />
    </RouterView>
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
