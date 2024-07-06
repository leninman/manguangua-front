import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useAuthStore } from './auth';


export function show_swal(msj, icon = 'success', position= 'top-end'){
    Swal.fire({
        title: msj,
        icon: icon,
        showConfirmButton: false,
        toast: true,
        position: position,
        timer: 3000
      });
}

export function show_alert(msj, icon, redirect){
    if(focus !== ''){
        //nextTick( () => focus.value.focus());
    }

    Swal.fire({
        title: msj,
        icon: icon,
        buttonsStyling: true
    });
}

export function confirmation(name, icon, redirect){
    const alert = Swal.mixin({ buttonsStyling: true });

    alert.fire({
        title: 'Esta seguro de Eliminar' + name + ' ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-check"></i> Si, Borrar',
        cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
    }).then( (result) => {
        if(result.isConfirmed){
            //Send Request
            sendRequest('DELETE',{},redirect);
        }
    });
};

export async function sendRequest(method, params, url, redirect = ''){
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken
    let res;
    await axios ({ method: method, url: url, data: params}).then(
        response=> {
            res = response.data.status,
            show_alert(response.data.message, 'success', ''),
            setTimeout(
                () => (redirect !== '')? window.location.href: '',
                2000)
        }).catch( (errors) => {
            let desc = '';
            res = errors.response.data.status;
            errors.response.data.errors.map( (e) => { desc = desc + ' ' + e})
            show_alert(desc,'error', '')
        })
        return res;
}

export const STATUSES = {
    Activo: 1,
    Inactivo: 2,
    Bloqueado: 3,
    Eliminado: 0
}

export const STATUSNAMES = Object.keys(STATUSES);

export function StatusesObject(){
    const arrStatuses = Object.keys(STATUSES)
  return  arrStatuses.filter((item, index) => { if(index < 2) return { statusID: index, status: item }});
}
