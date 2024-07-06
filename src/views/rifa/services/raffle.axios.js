/* eslint-disable  */
import {axiosObject}  from '../helpers/axiosObject'

export const requestObject = {
  getListRaffle: async () => {
    try {
      const response = await (axiosObject()).get("Raffle/list");
      return response
    } catch (error) {
      throw error
    }
  },
  getRaffle: async (idRaffle) => {
    try {
      const response = await (axiosObject()).get(`Raffle/${idRaffle}`)
      return response
    } catch (error) {
      throw error;
    }
  },
  buyTickets: async(payload) => {
    try {
      return await (axiosObject()).post(`Raffle`, payload);
    } catch (error) {
      throw error;
    }
  },
  cancelTicket: async(serial) => {
    try {
      return await axiosObject().put(`ticket/cancel/${serial}`);
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async(numeroDeTelefono,cuerpo) =>  {

   
    const token = 'pz5lkzf2bv1s0zgs';
    const to = numeroDeTelefono;
    const body = cuerpo;

    const data = new URLSearchParams();
    data.append('token', token);
    data.append('to', to);
    data.append('body', body);

    try{
      axios.post('https://api.ultramsg.com/instance76747/messages/chat', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    }catch(error){
      throw error
    }
  }
}