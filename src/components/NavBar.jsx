import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar() {

  const accountType = localStorage.getItem('accountType'); // 'donor', 'host', or null
  const loggedIn = !!accountType;

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* add cash register emoji to title */}
        {/* add key emoji to front of the
        title */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800, color: 'primary.main' }}>   🔑 Key-Ching 💰 </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>

          <Button component={RouterLink} to="/login" color={loggedIn ? "secondary" : "primary"} variant="outlined">{loggedIn ? "Logout" : "Login"}</Button>
          <Button component={RouterLink} to="/" color="secondary" variant="outlined">Main</Button>
          
          {/* {accountType === 'buyer' && ( */}
            <>
              {/* <Button component={RouterLink} to="/wallet" color="secondary" variant="contained">Wallet</Button> */}
              {/* <Button component={RouterLink} to="/purchase" color="primary" variant="outlined">Purchase</Button> */}
              {/* <Button component={RouterLink} to="/unlock" color="secondary" variant="outlined">Unlock</Button> */}
              <Button component={RouterLink} to="/your-keys" color="secondary" variant="outlined">Your Keys</Button>
              <Button component={RouterLink} to="/purchase-history" color="secondary" variant="outlined">Purchases</Button>
            </>
          {/* )} */}

          {/* {accountType === 'seller' && ( */}
            <>
              <Button component={RouterLink} to="/upload" color="primary" variant="contained">Create</Button>
              <Button component={RouterLink} to="/earnings" color="primary" variant="outlined">Earnings</Button>
              <Button component={RouterLink} to="/redeem" color="primary" variant="outlined">Redeem</Button>
              {/* <Button component={RouterLink} to="/" color="secondary" variant="outlined">Listings</Button> */}
            </>
          {/* )} */}

          <Button component={RouterLink} to="/help" color="secondary" variant="contained">Help</Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
}