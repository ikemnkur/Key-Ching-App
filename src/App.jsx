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
import Account from './pages/Account';
// import { fetchUserProfile } from './api/client';
import { useNavigate } from 'react-router-dom';
// import YourKeys from './pages/YourKeys';
import Listings from './pages/Listing';
import Purchase from './pages/Purchase';
import Info from './pages/Info';
import './styles.css';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {



  // example user data for testing
  // localStorage.setItem('userdata', JSON.stringify({"id":"UU4YFJICVO","loginStatus":true,"lastLogin":null,"accountType":"buyer","username":"ikemnkur","email":"ikemnkur@gmail.com","firstName":"Ikem","lastName":"Nkurumeh","phoneNumber":"","birthDate":"2000-03-02","encryptionKey":"enc_key_1759455609939","credits":100,"reportCount":0,"isBanned":false,"banReason":"","banDate":null,"banDuration":null,"createdAt":1759455609939,"updatedAt":1759455609939,"twoFactorEnabled":false,"twoFactorSecret":"","recoveryCodes":[],"profilePicture":"https://i.pravatar.cc/150?img=6","bio":"","socialLinks":{}}));

  const [userData, setUserData] = useState(
    localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')) : {
      id: '',
      loginStatus: false,
      lastLogin: null,
      accountType: '',
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      birthDate: '',
      encryptionKey: '',
      credits: 0,
      reportCount: 0,
      isBanned: false,
      banReason: '',
      banDate: null,
      banDuration: null,
      createdAt: null,
      updatedAt: null,
      twoFactorEnabled: false,
      twoFactorSecret: '',
      recoveryCodes: [],
      profilePicture: '',
      bio: '',
      socialLinks: {}
    }
  );

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const navigate = useNavigate();

  // Function to fetch user profile from server
  const fetchUserProfile = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userdata") || '{}');
    const username = storedUserData.username || 'user_123';

    const response = await fetch('http://localhost:3001/api/userData');
    if (!response.ok) throw new Error('Failed to fetch user data');

    const allUsers = await response.json();
    const currentUser = allUsers.find(user => user.username === username);

    if (currentUser) {
      return currentUser;
    } else {
      throw new Error('User not found');
    }
  }


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
  const accountType = userData.accountType || (localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')).accountType : null); // 'buyer', 'seller', or null
  const isLoggedIn = userData.loginStatus || (localStorage.getItem('userdata') ? JSON.parse(localStorage.getItem('userdata')).loginStatus : false); // 'buyer', 'seller', or null

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
            {!isLoggedIn && (
              <Route path="/register" element={<Auth isLogin={false} />} />
            )}
            <Route path="/help" element={<HelpPage />} />

            {/* Seller/ Buyer Routes */}
            {/* {accountType === 'buyer' && ( */}
            <>
              <Route path="/unlock/:id" element={<Unlock />} />
              {/* <Route path="/wallet" element={<Wallet />} /> */}
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/your-keys" element={<YourKeys />} />
              <Route path="/purchase-history" element={<PurchaseHistory />} />
              <Route path="/account" element={<Account />} />
            </>
            {/* )} */}
            {/* {accountType === 'seller' && ( */}
            <>
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/create-key" element={<CreateKey />} />
              <Route path="/redeem" element={<Redeem />} />
              <Route path="/listings" element={<Listings />} />
            </>
            {/* )}/ */}

            {/* Main Route */}
            {/* not logged in */}
            {!isLoggedIn && (
              <>
                <Route path="/" element={<Info />} />
              </>
            )}
            {/* logged in */}
            {isLoggedIn && (
              <Route path="/" element={<Main />} />
            )}



          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
