//import information from '../components/Information.vue'
//import confirm from '../components/Confirm.vue'
//import error from '../components/Error.vue'
//import success from '../components/Success.vue'
//export const alerts = { information, confirm, error, success }
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"

const dispatch = async config => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "v-btn v-btn--elevated v-theme--light bg-primary v-btn--density-default v-btn--size-default v-btn--variant-elevated mx-5",
      cancelButton:
        "v-btn v-btn--elevated v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-elevated",
    },
    buttonsStyling: false,
  })

  return await swalWithBootstrapButtons.fire(config)
}

export const alerts = {
  information: async message =>
    await dispatch({ title: message, icon: "info" }),
  confirm: async config => {
    const result = await dispatch({
      title: typeof config === "object" ? config.message : config,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: typeof config === "object" ? config.aceptText : 'Aceptar',
      cancelButtonText: typeof config === "object" ? config.cancelText : 'Cancelar',
    })

    return result.isConfirmed
  },
  error: async message =>
    await dispatch({ title: message, icon: "error" }),
  success: async message =>
    await dispatch({ title: message, icon: "success" }),
}
