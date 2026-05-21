'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Heart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, wishlist } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isLinkActive = (path) => pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <span style={{ fontSize: '1.8rem' }}>🐾</span>
          <span>FurEver Home</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} style={mobileMenuOpen ? {
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '70px',
          left: 0,
          width: '100%',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          padding: '20px',
          gap: '16px',
          boxShadow: 'var(--card-shadow)',
          zIndex: 99
        } : {}}>
          <li>
            <Link href="/" className={`nav-link ${isLinkActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/pets" className={`nav-link ${isLinkActive('/pets') ? 'active' : ''}`}>
              All Pets
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link href="/dashboard/my-requests" className={`nav-link ${isLinkActive('/dashboard/my-requests') ? 'active' : ''}`}>
                  My Requests
                </Link>
              </li>
              <li>
                <Link href="/dashboard/add-pet" className={`nav-link ${isLinkActive('/dashboard/add-pet') ? 'active' : ''}`}>
                  Add Pet
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Action Buttons (Right) */}
        <div className="auth-buttons">
          {/* Wishlist Icon */}
          {user && (
            <Link href="/dashboard/wishlist" className="btn-icon" style={{ position: 'relative' }} title="My Wishlist">
              <Heart size={20} fill={wishlist.length > 0 ? 'var(--accent)' : 'none'} color={wishlist.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'} />
              {wishlist.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {wishlist.length}
                </span>
              )}
            </Link>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Auth State */}
          {user ? (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={user.photoUrl} alt={user.name} className="profile-avatar" />
                <span className="profile-name">{user.name}</span>
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link href="/dashboard/my-listings" className="dropdown-item">
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="divider" style={{ margin: '4px 0' }}></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
                      <LogOut size={16} style={{ color: 'var(--error)' }} />
                      <span style={{ color: 'var(--error)' }}>Logout</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
