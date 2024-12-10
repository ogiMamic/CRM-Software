import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from 'sonner';

export function AddInventory() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Painting',
    quantity: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const determineStatus = (quantity: number) => {
    if (quantity === 0) {
      return 'Out of Stock';
    } else if (quantity < 5) {
      return 'Low Stock';
    } else {
      return 'Available';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) {
      toast.error('Please select a valid item type.');
      return;
    }

    try {
      const quantityNumber = parseInt(formData.quantity, 10) || 0;
      const status = determineStatus(quantityNumber);

      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          quantity: quantityNumber,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add inventory item');
      }

      toast.success('Inventory item added successfully!');
      setFormData({
        name: '',
        type: 'Painting',
        quantity: '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Error adding inventory item.');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Item Type</Label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            value={formData.type}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Painting">Painting</SelectItem>
              <SelectItem value="Religious Item">Religious Item</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Sculpture">Sculpture</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            onKeyDown={(e) => {
              if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                e.preventDefault();
              }
            }}
          />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
    </div>
  );
}
