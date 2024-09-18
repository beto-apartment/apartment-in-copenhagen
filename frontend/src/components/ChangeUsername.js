import React, { useContext, useState } from 'react'
// global context
import { GlobalContext } from '../App'
// material
import { Button, CircularProgress, TextField, Box } from '@mui/material'
// services
import userService from '../services/users'

const UpdateUsernameForm = () => {
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { user, setErrorMessage } = useContext(GlobalContext)
  
  const userId = user.id

  const handleChange = (value) => {
    setNewUsername(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await userService.changeUsername(userId, newUsername)   // al cambiar username no se actualiza la view
      console.log(response);
      
      user.username = newUsername
      setLoading(false)
      setErrorMessage('Name updated successfully')
    } catch (error) {
        console.log(error.message);
        
      setLoading(false)
      setErrorMessage(error.message)
    }
  }

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit}>
        <p style={{wordBreak: 'break-all'}}>Current Name:</p>
        <p style={{wordBreak: 'break-all'}}>
          { 
            user.username
            .split(' ') // Split the name into an array by spaces
            .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
            .join(' ') // Join the array back into a string with spaces
          }
        </p>
        <TextField
          sx={{ marginBottom: '1em' }}
          label="Username"
          variant="outlined"
          value={newUsername}
          onChange={({ target }) => handleChange(target.value)}
          required
        />
        <Button variant="contained" type="submit">Update Name</Button>
      </Box>
      <Box className="spinner" sx={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress size={24} color="inherit" />}
      </Box>
    </div>
  )
}

export default UpdateUsernameForm