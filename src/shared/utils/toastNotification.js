
import { useToast } from "vue-toast-notification"
import "vue-toast-notification/dist/theme-sugar.css"

const $toast = useToast()

const getConfiguration = config => {
  return {
    position: config?.position ?? "bottom-left",
    duration: config?.duration ?? 2500,
  }
}

export const showNotification = {
  success: config => {
    $toast.success(config?.message ?? config, getConfiguration())
  },
  warning: config => {
    $toast.warning(config?.message ?? config, getConfiguration())
  },
  error: config => {
    $toast.error(config?.message ?? config, getConfiguration())
  },
  info: config => {
    $toast.info(config?.message ?? config, getConfiguration())
  },
}