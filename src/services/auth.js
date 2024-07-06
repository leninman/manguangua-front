/* eslint-disable  */
import router from '@/router'
// import axios from '@axios'
import { defineStore } from 'pinia'
import { show_alert } from './functions'

export const useAuthStore = defineStore('auth', {
  state: () =>({ authUser: null, authToken: null }),
  getters: {
    user: state => state.authUser,
    token: state => state.authToken,
  },
  actions: {
    getToken(){
      return this.authUser.token
    },
    async loginClient(form){
      await axios.post('/client/login', form).then( res => {
        this.authToken = res.data.token
        this.authUser = res.data
        router.push("/clientes/rifas");
      },
      ).catch(
        errors => {
          let desc = 'Error'
          if(errors.response.data.hasOwnProperty('errors')){
            desc = errors.response.data.message
          }else{
            desc = errors.response.data.message
          }
          show_alert(desc, 'error', '')
        },
      )
    },
    async register(){
      await this.getToken()
      await axios.post('', form).then( res => {
        setTimeout( () => this.router.push('/login'), 2000)
        this.router.push('icons')
      },
      ).catch(
        errors => {
          let desc = ''
          errors.response.data.errors.map(
            e => {
              desc = desc + ' ' + e
            },
          )
        },
      )
    },
    async logout(){
      this.authToken = null
      this.authUser = null
      router.push('/login')
    },
  },
  persist: true,
})
