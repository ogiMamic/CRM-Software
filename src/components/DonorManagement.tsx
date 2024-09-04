// src/components/DonorManagement.tsx
'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Donor = {
  name: string;
  email: string;
  donationType: 'Monatsspende' | 'einmalige Spende';
  amount: number;
  country: string;
};

export default function DonorManagement() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const { register, handleSubmit, reset } = useForm<Donor>();

  const onSubmit = (data: Donor) => {
    setDonors([...donors, data]);
    reset();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Donor Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full p-2 border rounded" />
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <select {...register('donationType')} className="w-full p-2 border rounded">
          <option value="Monatsspende">Monatsspende</option>
          <option value="einmalige Spende">Einmalige Spende</option>
        </select>
        <input {...register('amount', { valueAsNumber: true })} type="number" placeholder="Amount" className="w-full p-2 border rounded" />
        <input {...register('country')} placeholder="Country" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Donor
        </button>
      </form>
      <ul className="space-y-2">
        {donors.map((donor, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {donor.name} - {donor.donationType} - {donor.amount}€ - {donor.country}
          </li>
        ))}
      </ul>
    </div>
  );
}