'use client';
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="not-found-container">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Companion Lost in Space</h2>
        <p className="not-found-message">
          We couldn't find the page you were looking for. It seems like this companion has wandered off or the page does not exist.
        </p>
        <Link href="/" className="btn btn-primary" style={{ padding: '12px 28px', marginTop: '10px' }}>
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}
