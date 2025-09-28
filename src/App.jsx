import { useState } from 'react'
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import YourKeys from './pages/YourKeys';
import Wallet from './pages/Wallet';
import CreateKey from './pages/CreateKey';
import Unlock from './pages/Unlock';
import Earnings from './pages/Earnings';
import Auth from './components/Auth';
import HelpPage from './pages/HelpPage';
import Main from './pages/Main';
import PurchaseHistory from './pages/PurchaseHistory';
import Redeem from './pages/Redeem';
// import { fetchUserProfile } from './api/client';
import { useNavigate } from 'react-router-dom';
// import YourKeys from './pages/YourKeys';
import Purchase from './pages/Purchase';
import Info from './pages/Info';
import './styles.css';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {

  const [userData, setUserData] = useState({
    loginStatus: false,
    accountType: '', // 'donor' or 'host'
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDate: '',
    encryptionKey: '',
    credits: 0,
  });

  // Load user profile from server
  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      const updatedUserData = {
        ...profile,
        birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
      };
      setUserData(updatedUserData);
      localStorage.setItem('userdata', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setSnackbarMessage(error.response?.data?.message || 'Failed to load user profile. Please refresh or login again.');
      if (error.response?.status === 401) {
        setTimeout(() => navigate('/login'), 500);
      }
    }
  };

  // Determine account type and login status, temporarily using localStorage
  const accountType = userData.accountType || localStorage.getItem('accountType'); // 'donor', 'host', or null
  const isLoggedIn = userData.loginStatus || !!accountType;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            {/* Public Routes */}
            {/* {!isLoggedIn && ( */}
              <Route path="/login" element={<Auth isLogin={true} />} />

            {/* )} */}
            <Route path="/register" element={<Auth isLogin={false} />} />
            <Route path="/help" element={<HelpPage />} />

            {/* Seller/ Buyer Routes */}
            {/* {accountType === 'buyer' && ( */}
            <>
              <Route path="/unlock/:id" element={<Unlock />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/your-keys" element={<YourKeys />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
            </>
            {/* )} */}
            {/* {accountType === 'seller' && ( */}
            <>
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/create-key" element={<CreateKey />} />
              <Route path="/redeem" element={<Redeem />} />
            </>
            {/* )}/ */}

            {/* Main Route */}
            {/* not logged in */}
            {!accountType && (
              <>
                <Route path="/" element={<Info />} />
              </>
            )} 
            {/* logged in */}
            {accountType && (
              <Route path="/" element={<Main />} />
            )}
            


          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
