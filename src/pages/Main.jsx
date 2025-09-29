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
    const accountType = localStorage.getItem('accountType'); // 'buyer', 'seller', or null
    

    const navigate = useNavigate();

    const load = async () => {
        try {
            // Direct API call to JSON Server
            const response = await fetch('http://localhost:3001/api/wallet');

            if (response.ok) {
                const wallets = await response.json();
                // Get the first user's wallet or find by username if available
                const userData = JSON.parse(localStorage.getItem("userdata") || '{"username":"user_123"}');
                const userWallet = wallets.find(w => w.username === userData.username) || wallets[0];

                setBalance(userWallet?.balance ?? 750);
            } else {
                throw new Error('Failed to fetch wallet data');
            }
        } catch (e) {
            console.error('Error loading wallet balance:', e);
            setBalance(750); // demo fallback with realistic amount
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
                        {accountType === 'buyer' && (
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
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
                                <Button
                                    onClick={() => navigate("/your-keys")}
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
                                    Your Keys
                                </Button>
                                <Button
                                    onClick={() => navigate("/purchase-history")}
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
                                    Purchase History
                                </Button>
                            </div>
                        )}
                        {accountType === 'seller' && (
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <Button
                                    onClick={() => navigate("/create-key")}
                                    variant="contained"
                                    sx={{
                                        borderColor: '#2e7d32',
                                        color: '#0e0e06ff',
                                        '&:hover': {
                                            backgroundColor: '#7d752eff',
                                            color: '#fff'
                                        }
                                    }}
                                >
                                    Create Keys
                                </Button>
                                <Button
                                    onClick={() => navigate("/earnings")}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#7d7d2eff',
                                        color: '#7d7d2eff',
                                        '&:hover': {
                                            backgroundColor: '#7d752eff',
                                            color: '#fff'
                                        }
                                    }}
                                >
                                    Earnings
                                </Button>
                                <Button
                                    onClick={() => navigate("/redeem")}
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
                                    Redeem Credits
                                </Button>
                            </div>
                        )}

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
        </Container >
    );
}