import React, { useEffect, useState } from 'react';
import { Container, Stack, Typography, Card, CardContent, Divider, Skeleton } from '@mui/material';
import PaymentButton from '../components/PaymentButton';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';
import BuyerTransactions from '../components/BuyerTransactions';

export default function PurchaseHistory() {
  const [balance, setBalance] = useState(null);
  const { success, error } = useToast();

  const load = async () => {
    try {
      const response = await api.get('/api/wallet');

      // Route on the backend will look like this:
      // server.get(PROXY + '/api/wallet', authenticateToken, async (req, res) => {

      //   try {
      //     console.log("Fetching wallet details for user:", req.user);

      //     const user = req.user;

      //     const [users] = await pool.execute(
      //       'SELECT credits FROM userData WHERE username = ?',
      //       [user.username]
      //     );

      //     res.json({
      //       balance: user.credits,
      //       credits: user.credits,
      //     });

      //     const userFromDb = users[0];

      //     if (userFromDb) {
      //       res.json({
      //         balance: userFromDb.credits,
      //         credits: userFromDb.credits,
      //       });
      //     } else {
      //       res.json({ balance: 0, credits: 0 }); // Default demo values
      //     }
      //   } catch (error) {
      //     console.error('Wallet balance error:', error);
      //     res.status(500).json({ error: 'Database error - wallet balance retrieval failed' });
      //   }
      // });


      console.log("Wallet data:", response.data);

      let data = response.data;

      // Set balance directly from response data
      setBalance(data?.balance ?? 0);
    } catch (e) {
      console.error(e);
      setBalance(100); // demo fallback
    }
  };

  useEffect(() => { load(); }, []);

  const onPaymentError = () => error('Payment could not be started');

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2}>
        {/* <Typography variant="h4" color="secondary.main">Earnings</Typography>
        <Card variant="outlined">
          <CardContent> */}

        <BuyerTransactions />
        {/* </CardContent> */}
        {/* </Card> */}
      </Stack>
    </Container>
  );
}