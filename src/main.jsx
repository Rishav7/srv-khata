import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import App from './App'
import { KhataProvider } from './store/KhataContext'
import './styles/app.scss'
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><KhataProvider><CssBaseline/><App/></KhataProvider></React.StrictMode>)
