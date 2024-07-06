<!-- eslint-disable vue/require-valid-default-prop -->
<!-- eslint-disable  -->
<template>
  <v-data-table
    v-model:page="page"
    :headers="headersA"
    :items="dataRow"
    :items-per-page="itemsPerPage"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:item.action="props">
      <v-btn-toggle v-model="toggle" divided variant="outlined">
        <!-- <v-btn @click="onButtonClick(props.item)" icon="mdi-content-save-all"></v-btn> -->
        <v-btn
          @click="onButtonUpdateClick(props.item)"
          icon="mdi-edit-box"
        ></v-btn>
        <v-btn
          @click="onButtonEnableClick(props.item)"
          icon="mdi-do-not-disturb"
        ></v-btn>
        <v-btn
          @click="onButtonDeleteClick(props.item)"
          icon="mdi-delete"
        ></v-btn>
      </v-btn-toggle>
    </template>
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, ref } from "vue"
import { VDataTable } from "vuetify/labs/VDataTable"

//const  itemsPerPage  = ref(10)

const props = defineProps({
  dataRow: {
    type: Array,
    default: [],
    required: false,
  },
  headerCol: {
    type: Array,
    default: [],
    required: false,
  },
  nPage: {
    type: Number,
    default: 1,
    required: false,
  },
  itemsPerPage: {
    type: Number,
    default: 10,
    required: false,
  },
  modal: {
    type: Boolean,
    default: false,
    required: false,
  },
})

const emits = defineEmits({
  openDialog: Boolean,
  formActual: Object,
})

let headersA = ref([])
let toggle = null

const page = ref(1)

onMounted(() => {
  page.value = props.nPage
  headersA.value = props.headers
})

const pageCount = computed(() => {
  let pagcnt = Math.ceil(props.dataRow.length / props.itemsPerPage)

  return pagcnt > 0 ? pagcnt : 1
})

function onButtonUpdateClick(value) {
  const formActual = { ...value.columns }

  emits("openDialog", true)
  emits("formActual", formActual)
}

function onButtonEnableClick(value) {
  let formActual = { ...value.columns }
  console.log(formActual.status)
  if (formActual.status !== "Eliminado") {
    formActual.statusID = formActual.status === "Activo" ? 3 : 1 //bloqueado/Activo
    emits("formActual", formActual)
    emits("openDialog", false)
  }
}

function onButtonDeleteClick(value) {
  let formActual = { ...value.columns }
  formActual.statusID = 0 //eliminado
  emits("formActual", formActual)
  emits("openDialog", false)
}
</script>
