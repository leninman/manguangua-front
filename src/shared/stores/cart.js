/* eslint-disable */
import { defineStore } from 'pinia'

export const useCartStore = defineStore("cart", {
  state: () => ({
    raffles: ref([]),
    lastSerial: ref(null)
  }),
  getters: {
    items: (state) => {
      return state.raffles.filter(item => item.tickets?.length > 0)
    },
    numbersByRaffle: (state) => {
      return (idRaffle) =>
        state.raffles.find((item) => item.idRaffle == idRaffle)?.tickets ?? [];
    },
    totalNumbers: (state) => {
      const rafflesArray = state.raffles.filter((item) => item.tickets?.length > 0);
      const numbers = rafflesArray.map((item) => item.tickets);
      return numbers.length > 0 ? numbers.join(",").split(",").length : 0;
    },
    totalToPay: (state) => {
      const rafflesArray = state.raffles.filter((item) => item.tickets?.length > 0);
      const priceNumbers = rafflesArray.map((item) => (item.tickets.length * item.priceNumber));
      const total = priceNumbers.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      return total
    },
    getRaffleById: (state) => {
      return (idRaffle) => {
        return state.raffles.find((item) => item.idRaffle == idRaffle) ?? {};
        // console.log(test.tick, "-->", idRaffle);
      }
    },
    getFormatPayload: (state) => {
      const data = state.raffles
        .filter((item) => item.tickets?.length > 0)
        .map((item) => {
          return { RaffleId: item.idRaffle, TicketNumbers: item.tickets };
        });
      return { dataTicket: data };
    },
    getLastSerial: (state) => {
      return state.lastSerial
    }

  },
  actions: {
    addRaffle(newItem) {
      const index = this.raffles
        .map((item) => item.idRaffle)
        .indexOf(newItem.idRaffle);
      if (index >= 0) {
        this.raffles[index].tickets = [...newItem.tickets];
        return;
      }
      this.raffles.push(newItem);
    },
    async repeatGame(game){
      game.map(item => {
        const index = this.existRaffle(item.raffleId)

        const tickets =
          index < 0
            ? item.ticketNumbers
            : Array.from(
                new Set([...this.raffles[index].tickets, ...item.ticketNumbers])
              );

        this.addRaffle({
          idRaffle: item.raffleId,
          name: item.raffleName,
          images: item.images,
          priceNumber: item.ticketValue,
          tickets,
        })
      })
    },
    removeRaffle(idRaffle) {
      const index = this.raffles.findIndex((item) => item.idRaffle == idRaffle);


      if (index > -1){
        this.raffles = this.raffles.filter(item => item.idRaffle != idRaffle);
      }
    },
    removeItemRaffle(idRaffle, ticket) {
      const newRaffles = this.raffles.map((item) => {
        if (item.idRaffle == idRaffle) {
          const i = item.tickets.lastIndexOf(ticket);
          if (i > -1) item.tickets.splice(i, 1);
          if(item.tickets.length <= 0){
            this.removeRaffle(idRaffle)
          }
        }

        return item;
      });
      this.raffles = newRaffles;
    },
    existRaffle(idRaffle){
      const index = this.raffles
        .map((item) => item.idRaffle)
        .indexOf(idRaffle)
      return index
    },
    flushRaffle(){
      this.raffles = []
    },
    setLastSerial(serial){
      this.lastSerial = serial
    },
    resetLastSerial(){
      this.lastSerial = null
    }
  },
  persist: true,
});