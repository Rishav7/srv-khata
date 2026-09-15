import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import { IconButton } from '@mui/material'
import { useLocation } from 'react-router-dom'

const titles = {
  '/':'Dashboard','/suppliers':'Suppliers','/transactions':'Transactions','/statement':'Supplier Statement',
  '/excel':'Excel Import / Export','/how-to-use':'How to Use'
}
export default function Header({ onMenu }) {
  const location = useLocation()
  const title = titles[location.pathname] ?? 'Supplier Khata'
  return <header className="topbar">
    <div className="topbar__left">
      <IconButton className="mobile-menu" onClick={onMenu}><MenuRoundedIcon /></IconButton>
      <div><div className="breadcrumb">Shri Ram Vastralay <span>/</span> {title}</div><h1>{title}</h1></div>
    </div>
    <div className="topbar__actions">
      <IconButton><NotificationsNoneRoundedIcon /></IconButton>
      <div className="profile"><div className="profile__avatar">SR</div><div className="profile__text"><strong>Store Admin</strong><span>Administrator</span></div></div>
      <IconButton><PersonOutlineRoundedIcon /></IconButton>
    </div>
  </header>
}
