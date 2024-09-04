'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Subscriber = {
  email: string;
  source: 'organic' | 'campaign' | 'import';
};

export default function NewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const { register, handleSubmit, reset } = useForm<Subscriber>();

  const onSubmit = (data: Subscriber) => {
    setSubscribers([...subscribers, data]);
    reset();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Newsletter Subscribers</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register('email', { required: true })}
            type="email"
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
          <select
            {...register('source')}
            id="source"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="organic">Organic</option>
            <option value="campaign">Campaign</option>
            <option value="import">Import</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Subscriber
        </button>
      </form>
      <ul className="space-y-2">
        {subscribers.map((subscriber, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {subscriber.email} - {subscriber.source}
          </li>
        ))}
      </ul>
    </div>
  );
}