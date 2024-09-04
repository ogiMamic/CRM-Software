// components/NewsletterSubscribers.tsx
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
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Newsletter Subscribers</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="mr-2 p-2 border rounded"
        />
        <select {...register('source')} className="mr-2 p-2 border rounded">
          <option value="organic">Organic</option>
          <option value="campaign">Campaign</option>
          <option value="import">Import</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
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