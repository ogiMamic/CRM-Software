// components/CampaignManagement.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Campaign = {
  name: string;
  startDate: string;
  endDate: string;
  channel: string;
  results: string;
};

export default function CampaignManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { register, handleSubmit, reset } = useForm<Campaign>();

  const onSubmit = (data: Campaign) => {
    setCampaigns([...campaigns, data]);
    reset();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Campaign Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-2">
        <input
          {...register('name', { required: true })}
          placeholder="Campaign Name"
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <input
            {...register('startDate', { required: true })}
            type="date"
            className="p-2 border rounded"
          />
          <input
            {...register('endDate', { required: true })}
            type="date"
            className="p-2 border rounded"
          />
        </div>
        <input
          {...register('channel', { required: true })}
          placeholder="Channel"
          className="w-full p-2 border rounded"
        />
        <input
          {...register('results')}
          placeholder="Results"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Add Campaign
        </button>
      </form>
      <ul className="space-y-2">
        {campaigns.map((campaign, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            {campaign.name} - {campaign.channel} ({campaign.startDate} to {campaign.endDate})
          </li>
        ))}
      </ul>
    </div>
  );
}