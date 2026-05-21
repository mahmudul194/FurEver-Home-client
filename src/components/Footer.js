'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <Link href="/" className="logo" style={{ marginBottom: '8px' }}>
              <span>🐾</span>
              <span>FurEver Home</span>
            </Link>
            <p className="footer-text">
              We connect loving families with pets in need of a home. Start your pet adoption journey today and bring home a new best friend.
            </p>
          </div>

          {/* Contact Information */}
          <div className="footer-col">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-links">
              <li className="footer-text">📍 123 Shelter Lane, Cityville</li>
              <li className="footer-text">📞 +1 (555) 123-4567</li>
              <li className="footer-text">✉️ support@fureverhome.org</li>
            </ul>
          </div>

          {/* Social / Quick Links */}
          <div className="footer-col">
            <h4 className="footer-title">Follow Us</h4>
            <div className="footer-socials" style={{ gap: '16px', display: 'flex' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-text" style={{ fontSize: '1.25rem' }} title="Facebook">
                📘 Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-text" style={{ fontSize: '1.25rem' }} title="Instagram">
                📸 Instagram
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-text" style={{ fontSize: '1.25rem' }} title="Twitter">
                🐦 Twitter
              </a>
            </div>
            <ul className="footer-links" style={{ marginTop: '16px' }}>
              <li>
                <Link href="/pets">Browse Pets</Link>
              </li>
              <li>
                <Link href="/about">How to Help</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FurEver Home. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
