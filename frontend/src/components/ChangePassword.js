import React, { useState, useEffect, useContext } from 'react'
// global context
import { GlobalContext } from '../App'
// material
import { Button, CircularProgress, IconButton, InputAdornment, Snackbar, TextField, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Visibility, VisibilityOff } from '@mui/icons-material'
// services
import userService from '../services/users'

const ChangePasswordForm = ({ isRecoverPassword }) => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useContext(GlobalContext)

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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {    
    e.preventDefault()
    setLoading(true)
    if (newPassword.trim() === '') {
      setLoading(false)
      setErrorMessage('New password cannot be empty')
      return
    }

    if (newPassword === newPasswordRepeat) {
      if (isRecoverPassword) {
        try {
          await userService.resetPassword(newPassword, token)
          setLoading(false)
          setErrorMessage('Password recovered successfully')
        } catch (error) {
          setLoading(false)
          setErrorMessage(`Error: ${error.message}`)
        }
      } else {
        try {
          await userService.changePassword( user.id, user.email, newPassword )
          setLoading(false)
          setErrorMessage('Password updated successfully')
        } catch (error) {
          setLoading(false)
          setErrorMessage(`Error: ${error.message}`)
        }
      }
    } else {
      setLoading(false)
      setErrorMessage('Passwords do not match')
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
      <form onSubmit={handleSubmit}>
        <TextField
          type={showPassword ? 'text' : 'password'}
          sx={{ width: isRecoverPassword ? '300px' : 'auto' }}
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          sx={{ width: isRecoverPassword ? '300px' : 'auto' }}
          label="Repeat Password"
          value={newPasswordRepeat}
          onChange={(e) => setNewPasswordRepeat(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
          fullWidth
          margin="normal"
        />

        {isRecoverPassword && (
          <TextField
            type='text'
            sx={{ width: '300px' }}
            label="Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            variant="outlined"
            required
            fullWidth
            margin="normal"
          />
        )}

        <Button variant="contained" type="submit">Change Password</Button>
      </form>
      <Box className="spinner" sx={{ display: 'flex', justifyContent: 'center' }}>
        {loading && <CircularProgress size={24} color="inherit" />}
      </Box>
    </div>
  )
}

export default ChangePasswordForm
