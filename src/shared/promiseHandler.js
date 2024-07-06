/* eslint-disable */
import { template } from '@/shared/utils/getTemplateMessage'
import { useAuthStore } from "@/services/auth";

const useStore = useAuthStore();

export const promiseHandler = async ({ promise, logErr = false }) => {
  try {
    const response = await promise
    return [response, undefined]
  } catch (err) {
    if(err?.response?.status === 401){
      useStore?.logout()
      return;
    }

    const data = err?.response?.data ?? undefined
    const error = {
      template: template[data?.code ?? 500] ?? 500,
      message:
        data?.message ? data?.message.charAt(0) + data?.message.slice(1).toLowerCase() : 'Oop! ha ocurrido un error'
    };
    if(logErr){
      console.table({
        errorType: typeof error,
        message: error.message,
        name: error.name,
      })
    }

    return [undefined, error]
  }
}
