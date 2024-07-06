<!-- eslint-disable-->
<script setup>

import { useCartStore } from "@/shared/stores/cart";
import { useRoute } from "vue-router";
import { showNotification } from '@/shared/utils/toastNotification'
import { requestObject } from '../services/raffle.axios'
import { avatarText } from "@/@core/utils/formatters";

const props = defineProps({
  tabItems: {
    type: Object,
    default: {},
  },
  numberMax: {
    type: Number,
    default: 0,
  },
  heightScreen: {
    type: Number,
  },
});
const route = useRoute();
const cartStore = useCartStore();
const emit = defineEmits(["refreshTickets"]);
const navigationTab2 = ref("ITEM ONE");
const dataRaffle = ref(props.tabItems);
const flagSearch = ref(false);
const modelSearch = ref('');
let totRaffle = 0
let purchasedNumbers = []
let messageBody = ''
let avNumbers = dataRaffle.value.availableNumbers
const phoneNumber = '+584241360122'
const raffleDateISO = dataRaffle.value.lotteryDatetime
const raffleDate = formatDate(raffleDateISO)
const raffleTime = formatTime(raffleDateISO)
const raffleCurrency = dataRaffle.value.currency.currencyCode
let numIsPresent = false



const selectNewNumber = ({ number }) => {
  let addNumberToCart = undefined;
  const newData = dataRaffle.value.availableNumbers.map((item) => {
    const conditionResult = item.selected ? !item.selected : true;
    if (item.number === number && item.selected) {
      cartStore.removeItemRaffle(dataRaffle.value.id, item.number);
      addNumberToCart = false
    }

    if (item.number === number && !item.used && addNumberToCart === undefined) {
      addNumberToCart = true
    }

    return {
      number: item.number,
      used: item.used,
      selected:
        item.number === number && !item.used ? conditionResult : item.selected,
    };
  });
  dataRaffle.value.availableNumbers = newData;
  refreshTickets();
  if (addNumberToCart !== undefined) {
    showNotification[addNumberToCart ? 'success' : 'info'](`Se ${addNumberToCart ? 'añadio' : 'elimino'} el número ${number} ${addNumberToCart ? 'al' : 'del'} carrito`)
  }
};

function formatDate(noFormatDate) {
  let date = new Date(noFormatDate);
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();
  let formattedDate = `${day}-${month}-${year}`;
  return formattedDate
}

function formatTime(noFormatDate) {
  let date = new Date(noFormatDate);
  let hours = String(date.getHours()).padStart(2, '0');
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');
  let formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime
}


function handleEnter() {
  insertRow();
};

function validateAvailability(number) {
  let isAvailable = false

  for (let i = 0; i < avNumbers.length; i++) {
    if (avNumbers[i].number === number && avNumbers[i].used === false) {
      isAvailable = true
    }
  }


  return isAvailable
}

function insertRow() {

  var numExpression = /^[0-9]+$/;

  var inputText = document.getElementById('selectedNumber').value;

  let available = validateAvailability(inputText)

  numIsPresent = numberIsTaken(inputText)

  console.log(available)

  if (numExpression.test(inputText)) {

    if (available == true) {

      if (numIsPresent == false) {
        let dataTable = document.getElementById('raffleTable')
        let rowsNum = dataTable.rows.length
        let row = dataTable.insertRow(rowsNum);
        var button = document.createElement("button");
        var imagen = document.createElement("img");
        imagen.style.width = "25px"
        imagen.title = "Eliminar"

        imagen.src = "/src/assets/images/icons/logo/bote.png";

        button.appendChild(imagen);
        let col0 = row.insertCell(0);
        let col1 = row.insertCell(1);
        let col2 = row.insertCell(2);
        let col3 = row.insertCell(3);
        let col4 = row.insertCell(4);
        col0.appendChild(button)
        button.addEventListener("click", function () {
          var row = this.parentNode.parentNode;
          row.parentNode.removeChild(row);
          totRaffle = totRaffle - row.cells[4].innerText
          document.getElementById("totalAmount").innerText = totRaffle

        });

        col1.innerHTML = dataRaffle.value.product.description
        col2.innerHTML = raffleDate + ' A las: ' + raffleTime
        let partialRaffleAmount = dataRaffle.value.ticketValue
        col3.innerHTML = document.getElementById("selectedNumber").value
        col4.innerHTML = partialRaffleAmount
        amountPlayed(partialRaffleAmount)
        purchasedNumbers.push(document.getElementById("selectedNumber").value)
        document.getElementById("selectedNumber").value = ""
        document.getElementById("totalAmount").innerText = totRaffle
       

      } else {

        alert('El número ya fue agregado')
      }

    } else {

      alert('Número no disponible')
    }
  } else {

    alert('El valor debe ser numérico')

  }
}

function amountPlayed(valorticket) {
  totRaffle = totRaffle + valorticket
  return totRaffle
}

function delRaffleTable() {
  totRaffle = 0
  var dataTable = document.getElementById('raffleTable')
  var numberRows = dataTable.rows.length

  for (var i = numberRows - 1; i > 0; i--) {
    dataTable.deleteRow(i);
  }

  document.getElementById("totalAmount").innerText = totRaffle

}

function sendMsg() {
  for (let i = 0; i < purchasedNumbers.length; i++) {
    messageBody += purchasedNumbers[i];
    messageBody += ','
  }

  messageBody += raffleDate
  requestObject.sendMessage(phoneNumber, messageBody)
}


const refreshTickets = () => {
  const { id: idRaffle, ticketValue: priceNumber, product } = dataRaffle.value;
  const newTickets = dataRaffle.value.availableNumbers
    .filter((item) => item.selected)
    .map((item) => item.number)
  const aux = new Set(newTickets)
  emit("refreshTickets", {
    idRaffle,
    name: product.description,
    tickets: [...aux],
    images: product.images,
    priceNumber
  });
};

const selectItemFromCart = () => {
  const ticketsToSelectIndex = cartStore.raffles.findIndex(
    (item) => item.idRaffle == dataRaffle.value.id
  );
  const ticketsToSelect = cartStore.raffles[ticketsToSelectIndex]?.tickets;
  if (ticketsToSelect && ticketsToSelect?.length > 0) {
    const newData = dataRaffle.value.availableNumbers.map((item) => {
      return {
        number: item.number,
        used: item.used,
        selected:
          ticketsToSelect.length > 0
            ? ticketsToSelect.includes(item.number)
              ? true
              : item.selected
            : item.selected,
      };
    });
    dataRaffle.value.availableNumbers = newData;
  }
};

const handlerClickSearch = () => {
  flagSearch.value = !flagSearch.value
  modelSearch.value = ''
}

watch(
  () => cartStore.items,
  (newState, oldState) => {
    const objectRaffle =
      newState.find((item) => item.idRaffle == dataRaffle.value?.id) ?? [];
    const newData = dataRaffle.value?.availableNumbers.map((item) => {
      return { ...item, selected: objectRaffle.tickets?.includes(item.number) };
    });
    dataRaffle.value.availableNumbers = newData;
  },
  { deep: true }
);

const listForTemplate = computed(() => {
  return dataRaffle.value?.availableNumbers.filter(item => {
    const expresion = new RegExp(`${modelSearch.value}.*`, "i");

    return expresion.test(item.number);
  });
})

function numberIsTaken(number) {
  let dataTable = document.getElementById('raffleTable')
  let rows = dataTable.getElementsByTagName('tr')
  let isPresent = false
  for (let i = 1; i < rows.length; i++) {
    var row = dataTable.querySelectorAll('tr')[i];
    var celda = row.querySelectorAll('td')[3];
    console.log('El valor de cell es ' + celda.innerText)
    if (number === celda.innerText) {
      isPresent = true
      break
    }
  }

  return isPresent

}




selectItemFromCart();


</script>

<template>
  <VRow class="list-numbers">
    <!--
      <VCol
      class="offset-8 text-right pr-6 pt-6 pb-0"
      cols="4"
      >
      <input
      v-if="flagSearch"
      v-model="modelSearch"
      type="text"
      name="search"
      class="rounded-pill list-numbers-search-input pr-7 pl-2 pt-1 pb-1"
      placeholder="Buscar numero"
      >
      <VIcon
      icon
      class="list-numbers-search-icon"
      @click="handlerClickSearch"
      >
      mdi-magnify
      </VIcon>
      </VCol>-->

    <VCol cols="12 pt-8">
      <VWindow v-model="navigationTab2">
        <VWindowItem>
          <VCardItem>
            <VCardTitle class="text-center">
              <h2 class="title-h2">
                LISTA DE BOLETOS
              </h2>

              <small id="element">
                <VIcon icon="bx-money" /> Total de boletos elegidos:
                {{
        cartStore.numbersByRaffle(route.query.idRaffle)?.length
      }}
                boleto<span v-if="cartStore.numbersByRaffle(route.query.idRaffle)?.length > 1
        ">s</span>
              </small>
            </VCardTitle>
          </VCardItem>

          <v-container fluid class="pa-0">
            <v-layout row wrap align-center>
              <v-flex xs12 sm6>
                <div class="text-xs-center">

                  <div id="divInput">
                    <v-text-field id="selectedNumber" v-model="selectedNumber" @keyup.enter="handleEnter()"
                      placeholder="Introduzca el número" maxlength="4"></v-text-field>
                  </div>

                </div>
              </v-flex>
              &nbsp;&nbsp;&nbsp;
              <v-flex xs12 sm6>
                <div class="text-xs-center">
                  <div>
                    <v-btn small @click="delRaffleTable()" id="cleanButton">LIMPIAR</v-btn>
                  </div>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
          &nbsp;&nbsp;&nbsp;
          <v-container fluid class="pa-0">
            <v-layout row wrap align-center>
              <v-flex xs12 sm6>
                <div class="text-xs-center">

                  <div id="divTable">

                    <table id="raffleTable" name="raffleTable">
                      <thead>
                        <tr>

                          <th id="thAction">Accion</th>
                          <th id="thProduct">Producto</th>
                          <th id="thRaffle">Sorteo</th>
                          <th id="thNumber">Numero</th>
                          <th id="thAmount">Monto {{ raffleCurrency
                            }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                      </tbody>
                    </table>
                  </div>

                  <div id="divTotalAndCurr">

                    <div id="divTotalAmount">

                      <label id="totalAmount"></label>

                    </div>

                    <div id="divCurrency">

                      <label id="totali">Total {{ raffleCurrency }}</label>

                    </div>
                  </div>
                </div>
                <br>


                <div id="divTableLeyend">


                  <div id="divAvailable">


                    <div class="circle" id="circleAvailable"></div>


                    <div class="divText">Números disponibles</div>

                  </div>

                  <div id="divNotAvailable">

                    <div class="circle" id="circleNotAvailable"></div>

                    <div class="divText">Números no disponibles</div>

                  </div>

                </div>
                <br>
              </v-flex>
            </v-layout>
          </v-container>
          <VCardText>
            <div id="lista">
              <div id="pagingBox" class="container" :style="{ height: props.heightScreen + 'px !important' }">
                <div v-for="data in listForTemplate" :id="data.number" :key="data.number" :class="{
        block: data.used,
        selected: data.selected,
      }">
                  {{ data.number }}
                </div>
              </div>
            </div>
          </VCardText>
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>
