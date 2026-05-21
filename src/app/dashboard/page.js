'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Default dashboard route — redirect to My Listings
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/my-listings');
  }, [router]);

  return null;
}
