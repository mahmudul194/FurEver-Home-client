'use client';
import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}
