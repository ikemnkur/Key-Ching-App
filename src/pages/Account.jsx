import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Avatar,
  Grid,
  Snackbar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    credits: 0,
    accountType: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:3001';

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const storedUserData = JSON.parse(localStorage.getItem("userdata") || '{}');
        const username = storedUserData.username || 'user_123';

        const response = await fetch(`${API_URL}/api/userData`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const allUsers = await response.json();
        const currentUser = allUsers.find(user => user.username === username);
        
        if (currentUser) {
          setUserData({
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            phoneNumber: currentUser.phoneNumber,
            bio: currentUser.bio || '',
            credits: currentUser.credits || 0,
            accountType: currentUser.accountType || 'buyer',
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        backgroundColor: '#1a1a1a' 
      }}>
        <CircularProgress sx={{ color: '#ffd700' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      p: 2,
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          fontWeight: 700,
          color: '#ffd700'
        }}
      >
        Account Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#ffd700'
              }}
            >
              Profile Information
            </Typography>
            
            <Avatar
              src={userData.profilePicture || '/default-avatar.png'}
              sx={{ 
                width: 100, 
                height: 100, 
                mx: 'auto', 
                mb: 3,
                border: '3px solid #ffd700'
              }}
            />

            <TextField
              fullWidth
              label="First Name"
              value={userData.firstName}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#ffd700' },
                  '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />
            
            <TextField
              fullWidth
              label="Last Name"
              value={userData.lastName}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#ffd700' },
                  '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />

            <TextField
              fullWidth
              label="Email"
              value={userData.email}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#ffd700' },
                  '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />

            <TextField
              fullWidth
              label="Bio"
              value={userData.bio}
              multiline
              rows={3}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  '& fieldset': { borderColor: '#555' },
                  '&:hover fieldset': { borderColor: '#ffd700' },
                  '&.Mui-focused fieldset': { borderColor: '#ffd700' }
                },
                '& .MuiInputLabel-root': { color: '#ccc' }
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3,
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                color: '#ffd700'
              }}
            >
              Account Information
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                Username
              </Typography>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                {userData.username}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                Account Type
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: userData.accountType === 'seller' ? '#4caf50' : '#2196f3',
                  textTransform: 'capitalize'
                }}
              >
                {userData.accountType}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#ccc', mb: 0.5 }}>
                Credits Balance
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffd700' }}>
                {userData.credits?.toLocaleString()} Credits
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          severity="success"
          sx={{ 
            backgroundColor: '#4caf50',
            color: '#fff'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountPage;
