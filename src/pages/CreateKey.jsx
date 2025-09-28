// import React, { useState } from 'react';
// import axios from '../api/client';

// export default function CreateKey() {
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState('');
//   const [price, setPrice] = useState(50);

//   const submit = async () => {
//     const fd = new FormData();
//     fd.append('file', file);
//     fd.append('title', title);
//     fd.append('price_credits', price);
//     const res = await axios.post('/host/upload', fd);
//     alert('uploaded: ' + res.data.uploadId);
//   };

//   return (
//     <div>
//       <h2>Upload Keys (one-per-line)</h2>
//       <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
//       <input type="number" value={price} onChange={e=>setPrice(e.target.value)} />
//       <input type="file" accept=".txt,.csv" onChange={e=>setFile(e.target.files[0])}/>
//       <button onClick={submit}>Upload</button>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { 
  Container, 
  Stack, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Divider,
  Alert,
  Chip,
  Paper
} from '@mui/material';
import { Upload, AttachFile, Description } from '@mui/icons-material';
import api from '../api/client';

export default function CreateKey(){
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(50);
  const [file, setFile] = useState(null);
  const [keyText, setKeyText] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'text'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');
  const {userData} = JSON.parse(localStorage.getItem('userdata') || '{}');
  const [keysAvailable, setKeysAvailable] = useState(10);
  const [expirationDays, setExpirationDays] = useState('');

  const submit = async () => {
    if (!file && !keyText.trim()) {
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('price_credits', price);
    fd.append('username', userData?.username || 'user_123');
    fd.append('email', userData?.email || '');
    
    if (uploadMethod === 'text' && keyText.trim()) {
      const blob = new Blob([keyText], { type: 'text/plain' });
      const textFile = new File([blob], 'keys.txt', { type: 'text/plain' });
      fd.append('file', textFile);
    } else if (file) {
      fd.append('file', file);
    }

    try {
      const { data } = await api.post('/create-key', fd);
      setUploadStatus('success');
      // Reset form
      setTitle('');
      setPrice(50);
      setFile(null);
      setKeyText('');
    } catch (e) {
      console.error(e);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container sx={{ py: 4, maxWidth: 'md' }}>
      <Stack spacing={4}>
        <Box textAlign="center">
          <Typography variant="h3" color="primary.main" gutterBottom sx={{ fontWeight: 700 }}>
            Create a Key Listing
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Upload your keys and set a price for others to purchase
          </Typography>
        </Box>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <Alert severity="success" onClose={() => setUploadStatus(null)}>
            Keys uploaded successfully! Your listing is now live.
          </Alert>
        )}
        {uploadStatus === 'error' && (
          <Alert severity="error" onClose={() => setUploadStatus(null)}>
            Upload failed. Please check your file and try again.
          </Alert>
        )}

        <Card variant="outlined" sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description color="primary" />
                  Listing Details
                </Typography>
                <Stack spacing={2}>
                  <TextField 
                    label="Listing Title" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    fullWidth
                    required
                    placeholder="e.g., Premium Gaming Keys Bundle"
                    helperText="Give your key listing a descriptive title"
                  />
                  <TextField 
                    type="number" 
                    label="Price per Key (credits)" 
                    value={price} 
                    onChange={e => setPrice(Number(e.target.value))}
                    fullWidth
                    required
                    inputProps={{ min: 1, max: 10000 }}
                    helperText="Set the price in credits for each key"
                  />
                  <TextField 
                    type="number" 
                    label="Keys available" 
                    value={keysAvailable} 
                    onChange={e => setKeysAvailable(Number(e.target.value))}
                    fullWidth
                    required
                    inputProps={{ min: 1, max: 10000 }}
                    helperText="Set the number of keys available for purchase"
                  />
                  {/* expiration date picker */}
                  <TextField 
                    type="number" 
                    label="Expiration Days (optional)" 
                    value={expirationDays} 
                    onChange={e => setExpirationDays(Number(e.target.value))}
                    fullWidth
                    inputProps={{ min: 1, max: 365 }}
                    helperText="Set how many days before the listing expires (leave blank for no expiration)"
                  />
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Upload Method Selection */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Upload color="primary" />
                  Upload Keys
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose how you'd like to provide your keys (one key per line)
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Chip
                    label="Upload File"
                    variant={uploadMethod === 'file' ? 'filled' : 'outlined'}
                    color={uploadMethod === 'file' ? 'primary' : 'default'}
                    onClick={() => setUploadMethod('file')}
                    clickable
                  />
                  <Chip
                    label="Paste/Type Keys"
                    variant={uploadMethod === 'text' ? 'filled' : 'outlined'}
                    color={uploadMethod === 'text' ? 'primary' : 'default'}
                    onClick={() => setUploadMethod('text')}
                    clickable
                  />
                </Stack>

                {/* File Upload Method */}
                {uploadMethod === 'file' && (
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.900', border: '1px solid', borderColor: 'primary.main' }}>
                    <Button 
                      variant="outlined" 
                      component="label" 
                      color="primary"
                      size="large"
                      startIcon={<AttachFile />}
                      sx={{ mb: 2 }}
                    >
                      Choose File (.txt or .csv)
                      <input 
                        type="file" 
                        hidden 
                        accept=".txt,.csv" 
                        onChange={e => setFile(e.target.files?.[0] || null)} 
                      />
                    </Button>
                    {file && (
                      <Typography variant="body2" color="text.primary" sx={{ color: 'white' }}>
                        Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
                      </Typography>
                    )}
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'grey.300' }}>
                      Supported formats: .txt, .csv (one key per line)
                    </Typography>
                  </Paper>
                )}

                {/* Text Input Method */}
                {uploadMethod === 'text' && (
                  <TextField
                    multiline
                    rows={8}
                    fullWidth
                    variant="outlined"
                    placeholder="Paste or type your keys here, one per line:&#10;KEY1-ABCD-EFGH&#10;KEY2-IJKL-MNOP&#10;KEY3-QRST-UVWX"
                    value={keyText}
                    onChange={e => setKeyText(e.target.value)}
                    sx={{ 
                      '& .MuiInputBase-input': { 
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                      }
                    }}
                    helperText={`${keyText.split('\n').filter(line => line.trim()).length} keys entered`}
                  />
                )}
              </Box>

              {/* Submit Button */}
              <Box textAlign="center" sx={{ pt: 2 }}>
                <Button 
                  onClick={submit} 
                  variant="contained" 
                  color="primary"
                  size="large"
                  disabled={isUploading || (!file && !keyText.trim()) || !title.trim()}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Create Listing'}
                </Button>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Your keys will be available for purchase once uploaded
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}