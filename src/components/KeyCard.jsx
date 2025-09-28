import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Stack } from '@mui/material';

export default function KeyCard({ item, onUnlock }){
  const available = item.available ?? Math.max(0, (item.quantity ?? 0) - (item.sold ?? 0));
  return (
    <Card variant={item.dark ? 'outlined' : 'elevated'} sx={{minWidth:280, borderRadius: 6, border: '5px solid rgba(76, 218, 0, 0.68)'}}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" sx={{fontWeight:800}}>{item.title}</Typography>
          <Chip size="small" label={`${available} left`} color={available>0? 'secondary':'default'} />
        </Stack>
        <Typography variant="body2" sx={{opacity:0.85, mb:1}}>{item.description}</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip label={`${item.price_credits} credits`} color="primary" />
          {/* <Chip label="85% to host" variant="outlined" /> */}
        </Stack>
      </CardContent>
      <CardActions>
        <Button fullWidth onClick={onUnlock} disabled={available===0} variant="contained" color="secondary">Unlock</Button>
      </CardActions>
    </Card>
  );
}