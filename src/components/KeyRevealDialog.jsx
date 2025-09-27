import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useToast } from '../contexts/ToastContext';

export default function KeyRevealDialog({ open, onClose, title = 'Your key', value }){
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      setCopied(true);
      success('Copied to clipboard');
      setTimeout(()=>setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{opacity:0.8}}>Store this securely. Treat it like a password.</Typography>
          <TextField value={value || ''} fullWidth multiline InputProps={{ readOnly: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={copy} color="secondary" variant="contained" startIcon={copied ? <CheckIcon/> : <ContentCopyIcon/>}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button onClick={onClose} color="primary" variant="outlined">Close</Button>
      </DialogActions>
    </Dialog>
  );
}