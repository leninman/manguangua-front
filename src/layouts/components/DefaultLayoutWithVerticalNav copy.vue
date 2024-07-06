<!-- eslint-disable -->
<script setup>
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import Cart from './Cart.vue'
const drawer = ref(false)

</script>

<template>
  <VLayout>
    <Cart :drawer="drawer" />
    <VMain style="height: 250px">
      <div class="d-flex justify-center align-center h-100">
        <VerticalNavLayout>
          <!-- 👉 navbar -->
          <template #navbar="{ toggleVerticalOverlayNavActive }">
            <div class="d-flex h-100 align-center">
              <!-- 👉 Search -->
              <VSpacer />

              <IconBtn
                class="me-2"
                @click.stop="drawer = !drawer"
              >
                <VIcon icon="mdi-cart-minus" />
              </IconBtn>
              <UserProfile />
            </div>
          </template>

          <!-- 👉 Pages -->
          <slot />

          <!-- 👉 Footer -->
          <!--
            <template #footer>
            <Footer />
            </template>
          -->
        </VerticalNavLayout>
      </div>
    </VMain>
  </VLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
