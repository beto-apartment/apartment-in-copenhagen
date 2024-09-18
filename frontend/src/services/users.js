import axios from 'axios'

const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}



const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  
  const response = await axios.get(baseUrl, config)
  response.data.map(employee => employee.hours.reverse())
  return response.data
}

const getOne = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.get(`${baseUrl}/${id}`, config)
  // reverse?
  response.data.hours.reverse()
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token}
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const activateUser = async (id) => {
  const isActive = true
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/updateIsActive/${id}`, { isActive }, config)
  return response.data
}

const deactivateUser = async (id) => {
  const isActive = false
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(`${baseUrl}/updateIsActive/${id}`, { isActive }, config)
  return response.data
}

const changeUsername = async (id, newUsername) => {
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.put(`${baseUrl}/changeUsername/${id}`, {
      newUsername
    }, config)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error changing name')
  }
}

const changePassword = async (id, userEmail, newPassword) => {
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.put(`${baseUrl}/changePassword/${id}`, {
      userEmail: userEmail,
      newPassword: newPassword
    }, config)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error changing password')
  }
}

const changeEmail = async (id, currentEmail, newEmail) => {
  const config = {
    headers: { Authorization: token }
  }
  try {
    const response = await axios.put(`${baseUrl}/changeEmail/${id}`, {
      userEmail: currentEmail,
      newEmail: newEmail
    }, config)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error changing email')
  }
}

const forgotPassword = async (userEmail) => {
  try {
    const response = await axios.post(`/api/forgotPassword`, { userEmail })
      return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error sending password reset email')
  }
}

const resetPassword = async (newPassword, manualToken) => {
  const userToken = `bearer ${manualToken}`
  const config = {
    headers: { Authorization: userToken }
  }
  console.log(manualToken);
  
  try {
    const response = await axios.post(`${baseUrl}/resetpassword`, {
      newPassword: newPassword
    }, config)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error changing password. Link is valid only for 1H.')
  }
}

const userService = {
  getAll,
  create,
  getOne,
  activateUser,
  deactivateUser,
  setToken,
  changeUsername,
  changeEmail,
  changePassword,
  forgotPassword,
  resetPassword
}

export default userService