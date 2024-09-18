import React from 'react'
import { useState } from 'react'
// material
import { Button, TextField, Box, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SignIn = ({handleSignin, username, setUsername, password, setPassword} ) => {
    const [showPassword, setShowPassword] = useState(false)
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    }

    return (
      <>
      <h2>Sign up</h2>

      <Box component="form" onSubmit={handleSignin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          Signin
        </Button>
      </Box>
        </>
    )
  }
  
  export default SignIn