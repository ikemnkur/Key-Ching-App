import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack, 
  Skeleton, 
  Grid2 as Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Chip
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../api/client';
import KeyCard from '../components/KeyCard';
import KeyRevealDialog from '../components/KeyRevealDialog';
import { useToast } from '../contexts/ToastContext';

export default function Listing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyValue, setKeyValue] = useState('');
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    keyTitle: '',
    description: '',
    price: '',
    tags: '',
    isActive: true
  });
  const { error, info, success } = useToast();
  const userData = JSON.parse(localStorage.getItem("userdata") || '{"username":"user_123"}');

  const loadListings = async () => {
    try {
      const username = userData.username;
      const { data } = await api.get(`/api/listings/${username}`);
      setItems(data || []);
    } catch (e) {
      console.error(e);
      // fallback demo items
      setItems([
        { id: 1, keyTitle: 'Windows Pro Key', description: 'Genuine retail key batch', price: 250, quantity: 50, sold: 3 },
        { id: 2, keyTitle: 'Game DLC Code', description: 'Season pass S5', price: 120, quantity: 10, sold: 10, dark: true },
        { id: 3, keyTitle: 'Archive #42 Password', description: 'Encrypted zip password', price: 75, quantity: 5, sold: 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleUnlock = async (item) => {
    try {
      info('Unlocking…');
      const { data } = await api.post(`/unlock/${item.id}`);
      if (data?.key) {
        setKeyValue(data.key);
        setOpen(true);
      } else {
        error('Unlock failed');
      }
    } catch (e) {
      if (e?.response?.status === 402) return error('Insufficient credits');
      error('Server error');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditFormData({
      keyTitle: item.keyTitle || item.title || '',
      description: item.description || '',
      price: item.price || item.price_credits || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : 
           (typeof item.tags === 'string' ? item.tags : ''),
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const submitEdit = async () => {
    if (!selectedItem) return;

    try {
      const updateData = {
        keyTitle: editFormData.keyTitle,
        description: editFormData.description,
        price: parseInt(editFormData.price),
        tags: editFormData.tags,
        isActive: editFormData.isActive
      };

      const { data } = await api.put(`/api/listings/${selectedItem.id}`, updateData);
      
      if (data.success) {
        success('Listing updated successfully');
        setEditDialogOpen(false);
        setSelectedItem(null);
        // Refresh listings
        await loadListings();
      } else {
        error(data.message || 'Failed to update listing');
      }
    } catch (e) {
      console.error('Edit error:', e);
      error(e.response?.data?.message || 'Failed to update listing');
    }
  };

  const submitDelete = async () => {
    if (!selectedItem) return;

    try {
      const { data } = await api.delete(`/api/listings/${selectedItem.id}`, {
        data: { username: userData.username }
      });
      
      if (data.success) {
        success(data.message || 'Listing deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedItem(null);
        // Refresh listings
        await loadListings();
      } else {
        error(data.message || 'Failed to delete listing');
      }
    } catch (e) {
      console.error('Delete error:', e);
      error(e.response?.data?.message || 'Failed to delete listing');
    }
  };

  return (
    <Container sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h4" color="primary.main">Your Key Listings For Sale</Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, color: 'text.secondary' }}>View and manage the keys that you have on sale.</Typography>
      </Stack>

      {loading ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={180} animation="wave" sx={{ bgcolor: 'grey.800' }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {items.map(item => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <KeyCard item={item} onUnlock={() => handleUnlock(item)} />
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(item)}
                  sx={{ flex: 1, color: 'primary.light', borderColor: 'primary.dark' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(item)}
                  sx={{ flex: 1, color: 'error.light', borderColor: 'error.dark' }}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'background.default', border: '1px solid #884', color: 'rgba(186, 186, 39, 1)' }
        }}
      >
        <DialogTitle>Edit Listing</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, backgroundColor: 'grey.900', p: 2, borderRadius: 1 }} >
            <TextField
              label="Title"
              fullWidth
              value={editFormData.keyTitle}
              onChange={(e) => setEditFormData({...editFormData, keyTitle: e.target.value})}
              InputProps={{ sx: { color: 'text.primary' } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={editFormData.description}
              onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
              InputProps={{ sx: { color: 'text.primary' } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField
              label="Price (credits)"
              fullWidth
              type="number"
              value={editFormData.price}
              onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
              InputProps={{ sx: { color: 'text.primary' } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={editFormData.tags}
              onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
              helperText="e.g., gaming, software, premium"
              InputProps={{ sx: { color: 'text.primary' } }}
              InputLabelProps={{ sx: { color: 'text.secondary' } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                  color="primary"
                />
              }
              label="Active (visible to buyers)"
              sx={{ color: 'text.secondary' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={submitEdit} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: { bgcolor: 'background.default', border: '1px solid #884', color: 'rgba(186, 186, 39, 1)' }
        }}
      >
        <DialogTitle>Delete Listing</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedItem?.keyTitle || selectedItem?.title}"?
          </Typography>
          {selectedItem?.sold > 0 && (
            <Typography color="warning.main" sx={{ mt: 1 }}>
              Note: This listing has sold {selectedItem.sold} keys. It will be deactivated instead of deleted.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={submitDelete} variant="contained" color="error">
            {selectedItem?.sold > 0 ? 'Deactivate' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <KeyRevealDialog open={open} onClose={() => setOpen(false)} value={keyValue} />
    </Container>
  );
}