<script setup>
import { ref } from "vue";
import { StatusesObject } from '@/services/functions';
const props = defineProps({
  monedas: {
    type: Array,
    default: [],
    required: false,
  },
})

const emits = defineEmits({
    formFilter: Object
});

let formFilter = ref({      
      description: '',
      statusID: 0,
      status: 'Todos',
      currency_id: null,
    });

function searchData(){
  emits('formFilter', formFilter.value);
}

function resetSearch(){
  console.log(StatusesObject());
  formFilter.value = {      
      description: '',
      statusID: 0,
      status: 'Todos'
    };
  searchData()
}
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 Estatus -->
      <VCol
        cols="12"
        md="3"
      >
        <!-- multiple -->
        <v-combobox
          v-model="formFilter.status"
          density="compact"
          clearable
          label="Estatus"
          item-value="statusID"
          item-title="status"
          :items="StatusesObject()"
          :return-object="true"
      ></v-combobox>        
      </VCol>
      <!-- 👉 Moneda -->
      <VCol
        cols="12"
        md="3"
        v-if="monedas.length > 0"
      >
        <!-- multiple -->
        <v-combobox
          v-model="formFilter.moneda"
          density="compact"
          clearable
          label="Moneda"
          item-value="id"
          item-title="description"
          :items="monedas"
          :return-object="true"
      ></v-combobox>        
      </VCol>      
      <!-- 👉 Description -->
      <VCol
        cols="12"
        md="3"
      >
        <VTextField
          v-model="formFilter.description"
          label="Descripción"
          placeholder=""
          density="compact"
          clearable
        />
      </VCol>
      <!-- 👉 Actions -->
      <VCol
        cols="12"
        class="d-flex flex-row-reverse gap-4"
      >
        <VBtn type="button" @click="searchData()">
          Buscar
        </VBtn>
        <VBtn
          type="button"
          color="secondary"
          variant="tonal"
          @click="resetSearch()"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
