import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <Header onMenu={() => setOpen(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
