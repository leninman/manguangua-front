<script setup>
import { show_alert } from '@/services/functions'
import RestResource from '@/services/httpService'
import TablePaginateProps from '@/views/pages/tables/TablePaginateProps.vue'
import Form from 'vform'
import { onMounted } from 'vue'

const url = 'Status'
const http = new RestResource()

let select = ref(['Activo'])
let dataUsers = ref([])
let dialog= ref(false)
let editMode = ref(false)

let formEstatus = new Form({
  id: 0,
  description: '',
})



const header = [
  {
    align: 'start',
    key: 'id',
    sortable: false,
    title: 'Id',
  },
  { title: 'Descripcion', key: 'description' },
  { title: 'Update', key: 'updatedAt' },
  { title: 'Creado', key: 'createdAt' },
  { text: '', value: 'action', key: 'action', sortable: false },
]

onMounted( async () => {
  getData()
})

async function getData( params = '', page = 1){
  const response = await http.get(url, params, page)
  if(response){
    if(response?.errors) show_alert(response.errors, 'error')
    else dataUsers.value = response
  }
};

async function buscarItems(){
  await getData()
}

function addEstatus(){
  formEstatus.reset()
  formEstatus.clear()
  editMode.value = false
  dialog.value = true
}

async function saveData(){
  await formEstatus.post(url).then( () => {
    dialog.value = false
    getData()
  }).catch( error => {
    const errMsj = { errors: (error?.response?.data?.message)?error.response.data.message:error.message }

    show_alert(errMsj.errors, 'error')
  })
}

async function updateData(){
  await formEstatus.put(url+'/'+formEstatus.id).then( () => {
    dialog.value = false
    getData()
  }).catch( error => {
    const errMsj = { errors: (error?.response?.data?.message)?error.response.data.message:error.message }

    show_alert(errMsj.errors, 'error')
  })
}

function editModal(data){
  editMode.value = true
  formEstatus.fill(data)
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- <pre>{{ dataUsers }}</pre> -->
      <VCard>
        <div class="d-flex flex-column-reverse flex-md-row">
          <div>
            <VCardItem>
              <VCardTitle>Filtros</VCardTitle>
            </VCardItem>
            <!--
              <VCardText class="d-flex align-center flex-wrap text-body-1">
              <VRating
              :model-value="5"
              readonly
              class="me-3"
              density="compact"
              />
              <span>5 Star | 98 reviews</span>
              </VCardText>
            -->
            <VCardText class="d-flex align-center flex-wrap text-body-1">
              <VRow>
                <VCol cols="3">
                  <VCombobox
                    v-model="select"
                    density="compact"
                    clearable
                    multiple
                    label="Combobox"
                    :items="['Activo', 'Inactivo']"
                  />
                </VCol>
                <VCol cols="3">
                  <VTextField
                    clearable
                    density="compact"
                    label="First name"
                  />
                </VCol>
              </VRow>
            </VCardText>
            <VCardText>
              Before there was a United States of America, there were coffee houses, because how are you supposed to build.
            </VCardText>

            <VCardActions>
              <VBtn @click="buscarItems">
                Buscar
              </VBtn>
              <VBtn>Resetear Filtro</VBtn>
            </VCardActions>
          </div>

          <!--
            <div class="ma-auto pa-5">
            <VImg
            :width="176"
            :src="pages5"
            class="rounded"
            />
            </div>
          -->
        </div>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <VCard>
        <template #title>
          <VRow>
            <VCol md="6">
              Estatus
            </VCol><VCol
              md="6"
              class="text-md-right text-xs-right"
            >
              <VBtn
                icon="mdi-plus"
                @click="addEstatus"
              />
            </VCol>
          </VRow>
        </template>
        <!-- title="Estatus"  -->
        <TablePaginateProps
          :n-page="1"
          :items-per-page="10"
          :data-row="dataUsers"
          :headers="header"
          @formActual="editModal"
          @openDialog="dialog = $event"
        />
      </VCard>
    </VCol>
  </VRow>
  <!-- Modal -->
  <VRow justify="center">
    <VDialog
      v-model="dialog"
      persistent
      width="1024"
    >
      <!--
        <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
        </template>
      -->
      <VCard>
        <VCardTitle>
          <span
            v-show="!editMode"
            class="text-h5"
          >Nuevo Estado</span>
          <span
            v-show="editMode"
            class="text-h5"
          >Editar Estado</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VTextField
                  label="Descripción*"
                  required
                  v-model="formEstatus.description"
                />
              </VCol>
            </VRow>
          </VContainer>
          <small>*campos requeridos</small>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="dialog = false"
          >
            Cerrar
          </VBtn>
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="editMode?updateData():saveData()"
          >
            <div v-show="!editMode">
              Guardar
            </div>
            <div v-show="editMode">
              Modificar
            </div>
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
