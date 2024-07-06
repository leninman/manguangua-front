/* eslint-disable  */
import { axiosObject } from '../../rifa/helpers/axiosObject'

export const requestTicket = {
  getTicketBySerial: async (serial) => {
    try {
      return await axiosObject().get(`Ticket/repeat/${serial}`)
    } catch (error) {
      throw error;
    }
  },
  cancelTicket: async (serial) => {
    try {
      return await axiosObject().put(`ticket/cancel/${serial}`)
    } catch (error) {
      throw error;
    }
  },
  payTicket: async (payload) => {
    try {
      return await axiosObject().post(`Ticket/reward`, {...payload})
    } catch (error) {
      throw error;
    }
  },
};
