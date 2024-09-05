import React, { useState } from 'react';
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Product A", quantity: 100, price: 9.99 },
    { id: 2, name: "Product B", quantity: 50, price: 19.99 },
    { id: 3, name: "Product C", quantity: 75, price: 14.99 },
  ]);

  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', quantity: 0, price: 0 });

  const addItem = () => {
    setInventory([...inventory, { ...newItem, id: inventory.length + 1 }]);
    setNewItem({ name: '', quantity: 0, price: 0 });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
        />
        <Button onClick={addItem}>Add Item</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}