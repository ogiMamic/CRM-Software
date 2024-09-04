'use client'

import { useUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Dobrodošli, {user.firstName}!</p>
    </div>
  );
}