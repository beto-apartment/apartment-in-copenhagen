import React, { useContext, useState } from 'react'
// global context
import { GlobalContext } from '../App'
// material
import { Button, CircularProgress, TextField, Box } from '@mui/material'
// services
import userService from '../services/users'

const UpdateEmailForm = () => {
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { user, setErrorMessage } = useContext(GlobalContext)
  
  const currentEmail = user.email
  const userId = user.id

  const handleChange = (value) => {
    setNewEmail(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await userService.changeEmail(userId, currentEmail, newEmail)   // al cambiar email no se actualiza la view
      user.email = newEmail
      setLoading(false)
      setErrorMessage('Email updated successfully')
    } catch (error) {
      setLoading(false)
      setErrorMessage('Error updating email')
    }
  }

  return (
    <div>
      <Box component="form" onSubmit={handleSubmit}>
        <p style={{wordBreak: 'break-all'}}>Current Email:</p>
        <p style={{wordBreak: 'break-all'}}>{ user.email }</p>
        <TextField
          sx={{ marginBottom: '1em' }}
          label="Username"
          variant="outlined"
          value={newEmail}
          onChange={({ target }) => handleChange(target.value)}
          required
        />
        <Button variant="contained" type="submit">Update Email</Button>
      </Box>
      <Box className="spinner" sx={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress size={24} color="inherit" />}
      </Box>
    </div>
  )
}

export default UpdateEmailForm
