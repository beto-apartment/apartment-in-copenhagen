import axios from 'axios'

const baseUrl = '/api/hours'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async newObject => {
    const config = {
      headers: { Authorization: token}
    }
  
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
  }
  
  const update = (id, newObject) => {
    const config = {
      headers: { Authorization: token}
    }

    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    return request.then(response => response.data)
  }

  const hoursService = {
    setToken,
    create,
    update
  }

  // export default { setToken, create, update }
  export default hoursService