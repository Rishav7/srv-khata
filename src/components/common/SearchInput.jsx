import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return <TextField size="small" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
  />
}
