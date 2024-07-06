<!-- eslint-disable  -->
<script setup>
  const dialog = ref(false)
  const config = ref({
    title: null,
    message: null,
    handler: null,
    width: 350
  })

  const resolver = ref(null)
  const reject = ref(null)

  const component = shallowRef(null)

  const open = async(options) => {
    component.value = options.component ? options.component : null
    config.value = {
      ...config.value,
      ...options,
      message: options.message ? options.message : null,
      width: options.width ? options.width : 350,
      handler: options.handler ? options.handler : undefined,
      title:  options.title ? options.title : null
    }
    dialog.value = true
    return new Promise((resol, rej) =>{
      resolver.value = resol
      reject.value = rej
    })
  }

  const close = (value = true) => {
    dialog.value = false
    resolver.value(value)
  }

  defineExpose({ open, close })
</script>

<template>
  <VDialog
    v-model="dialog"
    :width="config.width"
    persistent
  >
    <Component
      :is="component"
      :config="config"
    />
  </VDialog>
</template>