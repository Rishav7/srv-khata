import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
export default function ConfirmDialog({ open, title, message, onClose, onConfirm }) {
  return <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Delete</Button>
    </DialogActions>
  </Dialog>
}
