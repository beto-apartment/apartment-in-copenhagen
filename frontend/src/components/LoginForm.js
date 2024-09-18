import React from 'react'
import { useState } from 'react'
// components
import SignIn from './SignIn'
import ContactForm from './ContactForm'
// material
import { Button, TextField, Box, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginForm = ({handleLogin, username, setUsername, password, setPassword, handleSignin} ) => {
  const [logSign, setlogSign] = useState(false)
  const [recoverPassword, setRecoverPassword] = useState(false)
   const [showPassword, setShowPassword] = useState(false)

  const log = {display: logSign ? 'none' : ''}
  const sign = {display: logSign ? '' : 'none'}

  const contactForm = {display: recoverPassword ? '' : 'none'}

  const toggleLogSign = () => {
    setlogSign(!logSign)
    if (recoverPassword) {
      setRecoverPassword(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleRecoverPassword = () => {
    setRecoverPassword(!recoverPassword)
  }
  return (
    <>
      <Button variant="outlined" color="error" onClick={toggleLogSign}>{logSign ? 'Log in' : 'Sign up'}</Button>
      <div style={log}>
      <h2>Log in</h2>
      <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          sx={{ width: '300px' }}
          label="Username"
          variant="outlined"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          required
        />
        <TextField
          sx={{ width: '300px' }}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="success" type="submit">
          Login
        </Button>
        <Button variant="outlined" onClick={handleRecoverPassword}>
          Forgot Password
        </Button>
      </Box>
      </div>
      <div style={sign}>
        {/* <h1>signin</h1> */}
        <SignIn
          handleSignin={handleSignin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
      <div style={contactForm}>
        <ContactForm
        />
      </div>
    </>
  )
}

export default LoginForm