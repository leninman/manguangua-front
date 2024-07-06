<!-- eslint-disable-->
<script setup>
  import { show_alert, show_swal } from '@/services/functions';
  import RestResource from "@/services/httpService";
  import FormLayoutFilter from "@/views/pages/form-layouts/FormLayoutFilter.vue";
  import TablePaginateProps from "@/views/pages/tables/TablePaginateProps.vue";
  import Form from "vform";
  import { onMounted } from "vue";

  const url = "Currency"; //url page
  const title = "Monedas"; //titulo pagina
  const http = new RestResource();

  const dataMonedas = ref([]);
  const dialog = ref(false);
  const editMode = ref(false);

  let formFilter = ref({});

  const formEstatus = new Form({
    id: 0,
    description: "",
    statusID: 0,
    status: "",
  });

  const header = [
    {
      align: "start",
      key: "id",
      sortable: false,
      title: "Id",
    },
    { title: "Descripcion", key: "description" },
    { title: "Estatus", key: "status" },
    { text: "Acciones", value: "action", key: "action", sortable: false },
  ];

  onMounted(async () => {
    getData();
  });

  async function getData(filters = "", page = 1) {
    const response = await http.get(url, filters, page);
    if (response) {
      if (response?.errors) show_alert(response.errors, "error");
      else dataMonedas.value = response;
    }
  }

  function addData() {
    formEstatus.reset();
    formEstatus.clear();
    editMode.value = false;
    dialog.value = true;
  }

  async function saveData() {
    await formEstatus
      .post(url)
      .then(() => {
        dialog.value = false;
        show_swal("Información Almacenada");
        getData();
      })
      .catch((error) => {
        const errMsj = {
          errors: error?.response?.data?.message
            ? error.response.data.message
            : error.message,
        };
        show_alert(errMsj.errors, "error");
      });
  }

  async function updateData() {
    console.log(formEstatus);
    formEstatus.statusID = getFilterStatus(formEstatus.status);
    if (formEstatus.statusID == 0) {
      await formEstatus
        .delete(url + "/" + formEstatus.id)
        .then(() => {
          dialog.value = false;
          show_swal("Registro Eliminado");
          getData();
        })
        .catch((error) => {
          const errMsj = {
            errors: error?.response?.data?.message
              ? error.response.data.message
              : error.message,
          };
          show_alert(errMsj.errors, "error");
        });
    } else {
      //sino elimina actualiza
      await formEstatus
        .patch(url + "/" + formEstatus.id)
        .then(() => {
          dialog.value = false;
          show_swal("Información Actualizada");
          getData();
        })
        .catch((error) => {
          const errMsj = {
            errors: error?.response?.data?.message
              ? error.response.data.message
              : error.message,
          };
          show_alert(errMsj.errors, "error");
        });
    }
  }

  function openModal(esVisible) {
    if (esVisible === true) dialog.value = esVisible;
    else {
      updateData(); //actualiza en base al status
    }
  }

  function editModal(data) {
    editMode.value = true;
    formEstatus.fill(data);
  }
  function getFilterStatus(nameStatus) {
    if (nameStatus === "Activo") return 1;
    if (nameStatus === "Inactivo") return 2;
    if (nameStatus === "Bloqueado") return 3;
    return null;
  }
  function searchData(filter) {
    const nStatus = getFilterStatus(filter.status);
    filter.statusID = nStatus;
    formFilter = filter; //nStatus===true?filter:Object.assign(filter, {statusID: nStatus});
    getData(formFilter);
  }
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Filter Form -->
      <VCard title="Filtro">
        <VCardText>
          <FormLayoutFilter @formFilter="searchData" />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <VRow>
    <VCol cols="12">
      <VCard>
        <template v-slot:title>
          <v-row
            ><v-col md="6">{{ title }}</v-col
            ><v-col md="6" class="text-md-right text-xs-right"
              ><v-btn @click="addData()" icon="mdi-plus"></v-btn></v-col
          ></v-row>
        </template>
        <!-- title="Estatus"  -->
        <TablePaginateProps
          @formActual="editModal"
          @openDialog="openModal"
          :nPage="1"
          :itemsPerPage="10"
          :dataRow="dataMonedas"
          :headers="header"
        />
      </VCard>
    </VCol>
  </VRow>
  <!-- Modal -->
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="600" hide-overly="true">
      <v-form ref="formModal">
        <v-card>
          <v-card-title>
            <span class="text-h5" v-show="!editMode">Nuevo Estado</span>
            <span class="text-h5" v-show="editMode">Editar Estado</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <br />
              <v-row>
                <VCol cols="12">
                  <VRow no-gutters>
                    <!-- 👉 Descripción -->
                    <VCol cols="12" md="3">
                      <label for="description">Descripción*</label>
                    </VCol>
                    <VCol cols="12" md="9">
                      <VTextField
                        id="description"
                        v-model="formEstatus.description"
                        placeholder=""
                        persistent-placeholder
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12" v-show="editMode">
                  <VRow no-gutters>
                    <!-- 👉 Estatus -->
                    <VCol cols="12" md="3">
                      <label for="estatus">Estatus</label>
                    </VCol>
                    <VCol cols="12" md="9">
                      <v-combobox
                        v-model="formEstatus.status"
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
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="editMode ? updateData() : saveData()"
            >
              <div v-show="!editMode">Guardar</div>
              <div v-show="editMode">Modificar</div>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
