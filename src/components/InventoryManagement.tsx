// src/components/InventoryManagement.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type InventoryItem = {
  name: string;
  category: 'image' | 'rosary' | 'book' | 'other';
  quantity: number;
};

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { register, handleSubmit, reset } = useForm<InventoryItem>();

  const onSubmit = (data: InventoryItem) => {
    setInventory([...inventory, data]);
    reset();
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <input {...register('name')} placeholder="Item Name" className="w-full p-2 border rounded" />
        <select {...register('category')} className="w-full p-2 border rounded">
          <option value="image">Image</option>
          <option value="rosary">Rosary</option>
          <option value="book">Book</option>
          <option value="other">Other</option>
        </select>
        <input {...register('quantity', { valueAsNumber: true })} type="number" placeholder="Quantity" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Add Item
        </button>
      </form>

      <ul className="space-y-2">
        {inventory.map((item, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded flex justify-between">
            <span>{item.name} - {item.category}</span>
            <span>Quantity: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}