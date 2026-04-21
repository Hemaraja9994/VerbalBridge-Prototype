import React from 'react';
import { Brain, Activity, Settings, User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      background: 'white',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'var(--primary)',
          color: 'white',
          padding: '0.5rem',
          borderRadius: '10px',
          display: 'flex'
        }}>
          <Brain size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>VerbalBridge</h2>
      </div>

      <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#" className="nav-item active" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Dashboard</a>
        <a href="#" className="nav-item" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>History</a>
        <a href="#" className="nav-item" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Clinical Data</a>
      </div>

      <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Settings size={20} />
        </button>
        <div className="user-profile" style={{
          height: '40px',
          width: '40px',
          borderRadius: '50%',
          background: 'var(--bg-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          border: '1px solid var(--border)'
        }}>
          <User size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
