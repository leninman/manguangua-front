// import axios from '@axios'

export default class RestResource{

  async get(url, filters='', page = 1){
    let data = {}

    //const response = await http.get(`${url}?page=${page}`,{params: filters});
    await axios.get(`${url}?page=${page}`, { params: filters })
      .then(response => {
        data = response.data
      }).catch(error => {
        console.log(error)
        data = { errors: error?.response?.data?.message?error.response.data.message:error.message }
      })

    return data
  }

  async get(url, filters=''){
    let data = {}
    await axios.get(`${url}`, { params: filters })
      .then(response => {
        data = response.data
      }).catch(error => {
        console.log(error)
        data = { errors: error?.response?.data?.message?error.response.data.message:error.message }
      })

    return data
  }

  async post(){
    let response = await axios.post('', data)
  }

  async put(){

  }

  async delete(){

  }

  async setDisabled(){

  }
}
