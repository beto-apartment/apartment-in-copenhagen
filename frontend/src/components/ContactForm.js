import React, { useState, useEffect } from 'react'
import ChangePasswordForm from './ChangePassword'
// services
import userService from '../services/users'
// material
import { CircularProgress, Box , Button, Snackbar, IconButton, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const ContactForm = () => {
  const [formData, setFormData] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // material snackbar
  // -----------------
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }

  const actionSnackbar = (
    <>
      <Button color="secondary" size="small" onClick={handleSnackbarClose}>
        Close
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  useEffect(() => {
    if (errorMessage) {
      setOpenSnackbar(true)
    }
  }, [errorMessage])
  // -----------------
  // material snackbar

  const handleChange = (e) => {
    setFormData( e.target.value )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await userService.forgotPassword(formData)
      setErrorMessage('Email sent successfully.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setLoading(false)
    } catch (error) {
      setErrorMessage('Error sending email. Please ensure the email address is correct.')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setLoading(false)
    }
  }

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={errorMessage}
        action={actionSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <h3>Recover Password</h3>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', paddingBottom: '1em', gap: 2 }}>
        <p className='hint-recover-password'>First, enter your email to receive the token.</p>
        <TextField
          label="E-mail"
          variant="outlined"
          value={formData.to}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained">Send Recover Link</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: '1em', gap: 2 }}>
        <p className='hint-recover-password'>Then, enter your new password and paste the token to confirm the change.</p>
        <ChangePasswordForm isRecoverPassword={true}/>
      </Box>
      <Box className="spinner" sx={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress size={24} color="inherit" />}
      </Box>
    </div>
  )
}

export default ContactForm
