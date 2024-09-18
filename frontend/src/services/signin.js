import axios from 'axios'
const baseUrl = '/api/createUser'

const signin = async newObject => {
    const response = await axios.post(baseUrl, newObject)
    return response.data
}

const signinService = {
  signin
}

  export default signinService