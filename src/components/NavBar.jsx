import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar() {

  const accountType = localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')).accountType : null; // 'buyer', 'seller', or null
  const loggedIn = !!accountType;

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
    localStorage.removeItem('accountType');
    localStorage.removeItem('unlockedKeys'); // Clear unlocked keys on logout
    window.location.href = '/login'; // Redirect to login page
  }

  function handleLogin() {
    window.location.href = '/login'; // Redirect to login page
  }

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* add cash register emoji to title */}
        {/* add key emoji to front of the
        title */}
          {/* todo: turn this text into a button/link while Maintaining its current style */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}>  <a href="/" style={{textDecoration: 'none'}}>🔑 Key-Ching 💰</a></Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>

          {loggedIn && <Button component={RouterLink} to="/account" color="secondary" variant="outlined">Account</Button>}
          <Button onClick={loggedIn ? handleLogout : handleLogin} color={loggedIn ? "secondary" : "primary"} variant="outlined">{loggedIn ? "Logout" : "Login"}</Button>
          {/* <Button component={RouterLink} to="/" color="secondary" variant="outlined">Main</Button> */}
          
         

          <Button component={RouterLink} to="/help" color="secondary" variant="contained">Help</Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
}