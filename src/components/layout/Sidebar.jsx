import { NavLink } from 'react-router-dom'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import ImportExportRoundedIcon from '@mui/icons-material/ImportExportRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'

const items = [
  ['/', 'Dashboard', DashboardRoundedIcon],
  ['/suppliers', 'Suppliers', PeopleAltRoundedIcon],
  ['/transactions', 'Transactions', ReceiptLongRoundedIcon],
  ['/statement', 'Supplier Statement', AccountBalanceRoundedIcon],
  // ['/excel','Excel Import / Export',ImportExportRoundedIcon],
  ['/how-to-use', 'How to Use', HelpOutlineRoundedIcon],
]

export default function Sidebar({ mobileOpen, onClose }) {
  return <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
    <div className="brand">
      <div className="brand__logo"><MenuBookRoundedIcon /></div>
      <div><strong>Shri Ram</strong><span>Vastralaya</span><small>Supplier Khata</small></div>
    </div>
    <div className="nav-label">MAIN MENU</div>
    <nav>{items.map(([to, label, Icon]) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
      <Icon fontSize="small" /><span>{label}</span>
    </NavLink>)}</nav>
    <div className="sidebar__bottom">
      <div className="nav-item"><HelpOutlineRoundedIcon fontSize="small" /><span>Support</span></div>
      <div className="version">Version 2.0.0</div>
    </div>
  </aside>
}
