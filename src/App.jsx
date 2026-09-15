import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Suppliers from './pages/Suppliers'
import Transactions from './pages/Transactions'
import SupplierStatement from './pages/SupplierStatement'
import ExcelImportExport from './pages/ExcelImportExport'
import HowToUse from './pages/HowToUse'
export default function App(){return <BrowserRouter><Routes><Route element={<AppLayout/>}><Route path="/" element={<Dashboard/>}/><Route path="/suppliers" element={<Suppliers/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/statement" element={<SupplierStatement/>}/><Route path="/excel" element={<ExcelImportExport/>}/><Route path="/how-to-use" element={<HowToUse/>}/></Route></Routes></BrowserRouter>}
