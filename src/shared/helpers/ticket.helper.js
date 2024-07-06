/* eslint-disable */
import { alerts } from '@/shared/utils/alerts'
import loading from '@/shared/components/Loading.vue'
import { promiseHandler } from '@/shared/promiseHandler'
import { useCartStore } from '@/shared/stores/cart'
import { requestTicket } from "@/views/tickets/services/ticket.axios";

export const cancelLast = async (modal) => {
  const cart = useCartStore()
  const lastSerial = cart.getLastSerial
  if (lastSerial === null){
    await alerts.information('Disculpe, no éxiste un último serial generado')
    return;
  }

  if (
    await alerts.confirm(
      `¿Esta seguro que desea anular el ticket con serial ${lastSerial}?`
    )
  ) {
    try {
      modal.open({
        component: loading,
        message: "Anulando Ticket...",
        width: 200,
      });
      const [response, error] = await promiseHandler(
        {
          promise: requestTicket.cancelTicket(lastSerial),
        },
        true
      );
      modal.close();
      if (error) throw error;
      await alerts.success(response.data.message);
      //search.value.reset();
      cart.resetLastSerial()
    } catch (error) {
      cart.resetLastSerial();
      await alerts[error.template](error.message);
    }
  }
}
