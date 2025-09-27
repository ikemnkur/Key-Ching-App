import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Unlock(){
  return (
    <Container sx={{py:4}}>
      <Typography variant="h4">Unlock Result</Typography>
      <Typography variant="body1" sx={{opacity:0.8}}>This page can display the unlocked key/password with copy-to-clipboard and one-time view controls.</Typography>
    </Container>
  );
}