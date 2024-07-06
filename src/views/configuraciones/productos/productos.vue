<script setup>
import { show_alert, show_swal, STATUSNAMES } from '@/services/functions';
import RestResource from '@/services/httpService';
import FormLayoutFilter from '@/views/pages/form-layouts/FormLayoutFilter.vue';
import TablePaginateProps from '@/views/pages/tables/TablePaginateProps.vue';
import Form from 'vform';
import { onMounted, reactive } from 'vue';

const url = 'admin/Product';//url page
const title = 'Productos';//titulo pagina
const header = [
          {
            align: 'start',
            key: 'id',
            sortable: false,
            title: 'Id',
          },
          { title: 'Descripción', key: 'description' },
          {title:'Costo', key:'amount' },
          { title: 'Estatus', key: 'status' },
          { text:'Acciones', value: 'action', key:'action', sortable: false }
    ]  
const http = new RestResource()

const dataMonedas = ref([]);
const dialog= ref(false);
const editMode = ref(false);

const monedas = ref([]);
let formFilter = ref({});

let formData = reactive(new Form({
      id: 0,
      description: '',
      currencyID:1,
      statusID: 0,
      status:''
    }));

 
onMounted( async () => {
    getData();    
})
 
async function getData( filters = '', page = 1){
    monedas.value = await http.get('Currency',{ statusID: 1});
    const response = await http.get(url, filters, page);
    if(response){
        if(response?.errors) show_alert(response.errors,'error');
        else {
          dataMonedas.value = response.map((item) => ( {...item, status: STATUSNAMES[item.status], statusID: item.status }));
        }
    }
};

function addData(){
  formData.reset();
  formData.clear();
  editMode.value = false;
  dialog.value = true;
}

async function saveData(){
  await formData.post(url).then( () => {
      dialog.value = false;
      show_swal('Información Almacenada')
      getData()
  }).catch( (error) => {
    console.log(error);
    const errMsj = { errors: (error?.response?.data?.message)?error.response.data.message:error.message }    
    show_alert(errMsj.errors,'error');
  })
}

async function updateData(){
  formData.statusID = getFilterStatus(formData.status);
  if(formData.statusID == 0){
    await formData.delete(url+'/'+formData.id).then( () => {
        dialog.value = false;
        show_swal('Registro Eliminado')
        getData();
    }).catch( (error) => {
      const errMsj = { errors: (error?.response?.data?.message)?error.response.data.message:error.message }
      show_alert(errMsj.errors,'error');
    })
  }else{//sino elimina actualiza
    await formData.patch(url+'/'+formData.id).then( () => {
        dialog.value = false;
        show_swal('Información Actualizada')
        getData();
    }).catch( (error) => {
      const errMsj = { errors: (error?.response?.data?.message)?error.response.data.message:error.message }
      show_alert(errMsj.errors,'error');
    })
  }  
}

function openModal(esVisible){
  if(esVisible === true) dialog.value=esVisible;
  else{
    updateData();//actualiza en base al status
  }
}

function editModal(data){
  editMode.value = true;
  formData.fill(data);
}
function getFilterStatus(nameStatus){
  if(nameStatus === 'Activo') return 1
  if(nameStatus === 'Inactivo') return 2
  if(nameStatus === 'Bloqueado') return 3
  return null
}
function searchData(filter){
  formFilter = filter;//nStatus===true?filter:Object.assign(filter, {statusID: nStatus});
  formFilter.statusID = getFilterStatus(filter.status);
  getData(formFilter)
}
</script>

<template>
    <!-- Filters -->
    <VRow>
      <VCol
        cols="12">
        <!-- 👉 Filter Form -->
        <VCard title="Filtro">
          <VCardText>
            <FormLayoutFilter @formFilter="searchData" :monedas="monedas" />
          </VCardText>
        </VCard>        
      </VCol>
    </VRow>
    <!-- Table -->
    <VRow>
        <VCol cols="12">
        <VCard >
          <template v-slot:title>
            <v-row><v-col md="6">{{ title }}</v-col><v-col md="6" class="text-md-right text-xs-right"><v-btn @click="addData()" icon="mdi-plus"></v-btn></v-col></v-row>
          </template>
            <!-- title="Estatus"  -->
            <TablePaginateProps  @formActual="editModal" @openDialog="openModal" :nPage="1" :itemsPerPage="10" :dataRow="dataMonedas" :headers="header"/>
        </VCard>
        </VCol>
    </VRow>
    <!-- Modal -->
    <VRow justify="center">
      <v-dialog v-model="dialog" persistent  width="600" hide-overly="true">
        <v-form ref="formModal">
          <v-card>
          <v-card-title>
            <span class="text-h5" v-show="!editMode">Nuevo Estado</span>
            <span class="text-h5" v-show="editMode">Editar Estado</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <br>
              <v-row>
                <VCol cols="12">
                  <VRow no-gutters>
                    <!-- 👉 Descripción -->
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <label for="description">Descripción*</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="9"
                    >
                      <VTextField
                        id="description"
                        v-model="formData.description"
                        placeholder=""
                        persistent-placeholder
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12">
                  <VRow no-gutters>
                    <!-- 👉 Costo -->
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <label for="description">Costo*</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="9"
                    >
                      <VTextField
                        id="amount"
                        v-model="formData.amount"
                        placeholder=""
                        persistent-placeholder
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12">
                  <VRow no-gutters>
                    <!-- 👉 Estatus -->
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <label for="estatus">Moneda</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="9"
                    >
                      <v-combobox
                          v-model="formData.currencyID"                          
                          clearable
                          label="Moneda"
                          item-value="id"
                          item-title="description"
                          :items="monedas"
                          :return-object="true"
                      ></v-combobox>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12" v-show="editMode">
                  <VRow no-gutters>
                    <!-- 👉 Estatus -->
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <label for="estatus">Estatus</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="9"
                    >
                      <v-combobox
                          v-model="formData.status"                          
                          clearable
                          label="Estatus"
                          :items="['Activo', 'Inactivo']"
                      ></v-combobox>
                    </VCol>
                  </VRow>
                </VCol> 
              </v-row>
            </v-container>
            <small>*campos requeridos</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Cerrar
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="editMode?updateData():saveData()">
              <div v-show="!editMode">Guardar</div>
              <div v-show="editMode">Modificar</div>
            </v-btn>
          </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </VRow>    
</template>
