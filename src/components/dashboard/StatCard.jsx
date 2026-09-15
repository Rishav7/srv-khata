import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import Currency from '../common/Currency'

const icons = {
  outstanding: AccountBalanceWalletRoundedIcon,
  purchased: ShoppingBagRoundedIcon,
  paid: PaymentsRoundedIcon,
  suppliers: GroupsRoundedIcon,
}

export default function StatCard({ type, label, value, helper }) {
  const Icon = icons[type]

  return (
    <div className={`stat-card stat-card--${type}`}>
      <div className="stat-card__top">
        <div className="stat-card__icon">
          {Icon && <Icon />}
        </div>

        <span className="stat-card__trend">
          <TrendingUpRoundedIcon fontSize="inherit" /> Live
        </span>
      </div>

      <div className="stat-card__label">{label}</div>

      <div className="stat-card__value">
        {type === 'suppliers' ? value : <Currency value={value} />}
      </div>

      <div className="stat-card__helper">{helper}</div>
    </div>
  )
}

