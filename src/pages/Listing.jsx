import React, { useEffect, useState } from 'react';
import { Container, Typography, Stack, Skeleton, Grid2 as Grid } from '@mui/material';
import api from '../api/client';
import KeyCard from '../components/KeyCard';
import KeyRevealDialog from '../components/KeyRevealDialog';
import { useToast } from '../contexts/ToastContext';

export default function Listing(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyValue, setKeyValue] = useState('');
  const [open, setOpen] = useState(false);
  const { error, info } = useToast();

  useEffect(()=>{
    (async ()=>{
      try{
        const { data } = await api.get('/host/listings');
        setItems(data || []);
      }catch(e){
        console.error(e);
        // fallback demo items
        setItems([
          { id:1, title:'Windows Pro Key', description:'Genuine retail key batch', price_credits: 250, quantity: 50, sold: 3 },
          { id:2, title:'Game DLC Code', description:'Season pass S5', price_credits: 120, quantity: 10, sold: 10, dark:true },
          { id:3, title:'Archive #42 Password', description:'Encrypted zip password', price_credits: 75, quantity: 5, sold: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  },[]);

  const handleUnlock = async (item)=>{
    try{
      info('Unlocking…');
      const { data } = await api.post(`/unlock/${item.id}`);
      if (data?.key) {
        setKeyValue(data.key);
        setOpen(true);
      } else {
        error('Unlock failed');
      }
    }catch(e){
      if (e?.response?.status === 402) return error('Insufficient credits');
      error('Server error');
    }
  };

  return (
    <Container sx={{py:4}}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" color="primary.main">Featured Listings</Typography>
        <Typography variant="body1" sx={{opacity:0.8}}>Spend credits to unlock a single-use key/password. </Typography>
      </Stack>

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_,i)=> (
            <Grid key={i} size={{ xs:12, sm:6, md:4 }}>
              <Skeleton variant="rounded" height={180} animation="wave" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map(item=> (
            <Grid key={item.id} size={{ xs:12, sm:6, md:4 }}>
              <KeyCard item={item} onUnlock={()=>handleUnlock(item)} />
            </Grid>
          ))}
        </Grid>
      )}

      <KeyRevealDialog open={open} onClose={()=>setOpen(false)} value={keyValue} />
    </Container>
  );
}