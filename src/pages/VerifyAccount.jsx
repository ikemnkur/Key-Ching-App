import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import api from '../api/client';

const API_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001';

// Deposit wallet address mappings

const recipientAddresses = {
    BTC: 'bc1q4j9e7equq4xvlyu7tan4gdmkvze7wc0egvykr6',
    LTC: 'ltc1qgg5aggedmvjx0grd2k5shg6jvkdzt9dtcqa4dh',
    ETH: '0x9a61f30347258A3D03228F363b07692F3CBb7f27',
    SOL: 'qaSpvAumg2L3LLZA8qznFtbrRKYMP1neTGqpNgtCPaU',
};

export default function VerifyAccount() {
    const location = useLocation();

    const [currency, setCurrency] = useState('LTC');
    const [userWalletAddress, setUserWalletAddress] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [infoOpen, setInfoOpen] = useState(false);

    const timerCanvasRef = useRef(null);
    const qrCanvasRef = useRef(null);

    const [amounts] = useState(() => {
        const verification = localStorage.getItem('verification') ? JSON.parse(localStorage.getItem('verification')) : null;
        const a1 = verification.amount1;
        const a2 = verification.amount2;
        return {
            LTC: {
                amount1: Number((0.0075 * (1 + a1)).toPrecision(4)),
                amount2: Number((0.0075 * (1 + a2)).toPrecision(4)),
            },
            BTC: {
                amount1: Number((0.000075 * (1 + a1)).toPrecision(4)),
                amount2: Number((0.000075 * (1 + a2)).toPrecision(4)),
            },
            ETH: {
                amount1: Number((0.000018 * (1 + a1)).toPrecision(4)),
                amount2: Number((0.000018 * (1 + a2)).toPrecision(4)),
            },
            SOL: {
                amount1: Number((0.0024 * (1 + a1)).toPrecision(4)),
                amount2: Number((0.0024 * (1 + a2)).toPrecision(4)),
            },
        };
    });

    const currentRecipient = useMemo(() => recipientAddresses[currency], [currency]);
    const { amount1, amount2 } = useMemo(() => amounts[currency], [amounts, currency]);

    useEffect(() => {
        const id = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const canvas = timerCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const totalTime = 10 * 60;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50;
        const percent = timeLeft / totalTime;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * percent);
        ctx.strokeStyle = timeLeft < 60 ? '#dc3545' : '#007bff';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        ctx.fillText(`${mins}:${secs < 10 ? '0' : ''}${secs}`, centerX, centerY);
    }, [timeLeft]);

    const renderQr = async () => {
        if (!qrCanvasRef.current) return;
        try {
            await QRCode.toCanvas(qrCanvasRef.current, currentRecipient, {
                width: 128,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
        } catch (e) {
            setStatusMsg('Failed to render QR code');
        }
    };

    useEffect(() => {
        renderQr();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRecipient]);

    useEffect(() => {
        if (timeLeft === 0) {
            setStatusMsg('Session expired. Please refresh.');
        }
    }, [timeLeft]);

    const copyAddress = async () => {
        try {
            await navigator.clipboard.writeText(currentRecipient);
            setStatusMsg('Address copied!');
            setTimeout(() => setStatusMsg(''), 2000);
        } catch (err) {
            setStatusMsg('Error copying.');
        }
    };

    const handleSubmit = async () => {
        const params = new URLSearchParams(location.search).toString();
        try {

            let email = '';
            let username = '';
            const userdata = localStorage.getItem('userdata');
            if (userdata) {
                const userDataObj = JSON.parse(userdata);
                email = userDataObj.email;
                username = userDataObj.username;
            }

            // Lazy import to avoid circular if api file changes
            let response = await api.post(`${API_URL}/api/auth/verify-account?email=${email}&username=${username}`, {
                username: username,
                email: email,
                amount1: amount1,
                amount2: amount2,
                timeLeft: timeLeft,
                chain: currency,
                address: userWalletAddress,
                urlParams: params,
            });

            setStatusMsg('Verification process completed.');
            console.log('Verification response:', res);
        } catch (error) {
            console.error('Error during verification:', error);
            setStatusMsg('Verification failed. Please try again.');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                style={{
                    width: '100%',
                    maxWidth: 560,
                    margin: '0 16px',
                    padding: 20,
                    background: '#0f0f0f',
                    border: '1px solid #222',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
            >
                <h2 style={{ color: '#fff', textAlign: 'center' }}>Account Verification</h2>

                <div style={{ marginBottom: 20, textAlign: 'center' }}>
                    <button
                        onClick={() => setInfoOpen(true)}
                        style={{
                            background: 'transparent',
                            color: '#ccc',
                            border: 'none',
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                        aria-label="Why is verification required?"
                    >
                        Why is verification required?
                    </button>
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5, color: '#fff' }}>Your Public Wallet Address</label>
                    <input
                        type="text"
                        value={userWalletAddress}
                        onChange={(e) => setUserWalletAddress(e.target.value)}
                        placeholder="Enter your address"
                        style={{ width: '100%', padding: 10, borderRadius: 4 }}
                    />
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 5, color: '#fff' }}>Select Asset</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ width: '100%', padding: 10, borderRadius: 4 }}
                    >
                        <option value="LTC">Litecoin (LTC)</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="SOL">Solana (SOL)</option>
                    </select>
                </div>

                <div style={{ background: '#111', border: '1px solid #222', padding: 20, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', margin: '10px 0' }}>
                        <canvas ref={timerCanvasRef} width={120} height={120} />
                    </div>

                    <p style={{ color: '#ccc' }}>Send exactly the amount below within 10 minutes:</p>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#e9bc27', margin: '10px 0' }}>
                        {amount1} {currency}
                    </div>
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#54d334', margin: '10px 0' }}>
                        {amount2} {currency}
                    </div>

                    <div style={{ display: 'inline-block', margin: '15px 0', padding: 10, background: 'white', border: '1px solid #eee' }}>
                        <canvas ref={qrCanvasRef} width={128} height={128} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <input type="text" readOnly value={currentRecipient} style={{ flex: 1, padding: 10, borderRadius: 4 }} />
                        <button onClick={copyAddress} style={{ padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>Copy</button>
                    </div>
                    <div style={{ height: 20, marginTop: 10, fontSize: '0.9em', color: timeLeft === 0 ? 'red' : '#ccc' }}>{statusMsg}</div>
                </div>

                <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center' }}>
                    <button onClick={handleSubmit} style={{ padding: 10, borderRadius: 4 }}>Done</button>
                </div>
            </div>
            <Dialog open={infoOpen} onClose={() => setInfoOpen(false)} maxWidth="sm" fullWidth >
                <div style={{ backgroundColor: '#0a0a0a' }}>
                    <DialogTitle>Why a small verification payment?</DialogTitle>
                    <DialogContent >
                        {/* a note to the user telling why they need to send the exact amount to the address below within 10 minutes */}
                        <p style={{ marginTop: 8 }}>
                            To main the quality of the site we need to verify that you are a real user as there has be problems with spam bots and abuse in the past. We ask for a small verification payment less than 0.10$ USD.
                        </p>
                        <p>
                            To verify your account and be able to use all features, please send the exact amounts shown below to the address provided within 10 minutes. This helps us confirm that your a real person and reduces abuse of the system.
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setInfoOpen(false)} autoFocus>Close</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}
