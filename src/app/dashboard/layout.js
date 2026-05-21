'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { LayoutDashboard, PlusCircle, ClipboardList, Heart } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Private route check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <Loader message="Accessing dashboard secure environment..." />;
  }

  const isLinkActive = (path) => pathname === path;

  return (
    <div className="container" style={{ padding: 0 }}>
      <div className="dashboard-layout">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <span className="sidebar-title">Management Dashboard</span>
          <ul className="sidebar-menu">
            <li>
              <Link href="/dashboard/my-listings" className={`sidebar-link ${isLinkActive('/dashboard/my-listings') ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>My Listings</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/add-pet" className={`sidebar-link ${isLinkActive('/dashboard/add-pet') ? 'active' : ''}`}>
                <PlusCircle size={18} />
                <span>Add Pet</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/my-requests" className={`sidebar-link ${isLinkActive('/dashboard/my-requests') ? 'active' : ''}`}>
                <ClipboardList size={18} />
                <span>My Requests</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/wishlist" className={`sidebar-link ${isLinkActive('/dashboard/wishlist') ? 'active' : ''}`}>
                <Heart size={18} />
                <span>My Wishlist</span>
              </Link>
            </li>
          </ul>
        </aside>

        {/* Dashboard Main Panel */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}
