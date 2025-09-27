import React, { useEffect, useState } from 'react';
import { Container, Stack, Typography, Card, CardContent, Divider, Skeleton, Button } from '@mui/material';
import PaymentButton from '../components/PaymentButton';
import Notifications from '../components/Notifications.jsx';
import api from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Wallet() {
    const [balance, setBalance] = useState(null);
    const { success, error } = useToast();

    const navigate = useNavigate();

    const load = async () => {
        try {
            const { data } = await api.get('/wallet/balance');
            setBalance(data?.balance ?? 0);
        } catch (e) {
            console.error(e);
            setBalance(100); // demo fallback
        }
    };

    useEffect(() => { load(); }, []);

    const onPaymentError = () => error('Payment could not be started');

    return (
        <Container sx={{ py: 4, backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ color: '#ffd700', fontWeight: 700 }}>Main</Typography>
                <Card variant="outlined" sx={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '2px solid #ffd700',
                    borderRadius: 2 
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ color: '#ffd700' }}>Current Balance</Typography>
                        {balance === null ? (
                            <Skeleton variant="text" width={220} height={54} animation="wave" />
                        ) : (
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2e7d32' }}>{balance} credits</Typography>
                        )}

                    </CardContent>

{/* purchase button : go to purchase page */}

                    <CardContent>
                        <Divider sx={{ my: 2, borderColor: '#444' }} />
                        <Button 
                            onClick={() => navigate("/purchase")} 
                            variant="outlined"
                            sx={{
                                borderColor: '#2e7d32',
                                color: '#2e7d32',
                                '&:hover': {
                                    backgroundColor: '#2e7d32',
                                    color: '#fff'
                                }
                            }}
                        >
                            Get More Credits
                        </Button>
                    </CardContent>
                </Card>
                <Card variant="outlined" sx={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '2px solid #ffd700',
                    borderRadius: 2 
                }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#ffd700' }}>Notifications</Typography>
                        <Notifications />
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}