import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import type { Customer, Status } from '../../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Customer) => void;
  initialData?: Customer | null;
  isLoading: boolean;
}

const emptyForm: Customer = {
  id: '',
  name: '',
  description: '',
  status: 'Open',
  rate: 0,
  balance: 0,
  deposit: 0,
};

export default function CustomerForm({ isOpen, onClose, onSubmit, initialData, isLoading }: Props) {
  const [formData, setFormData] = useState<Customer>(emptyForm);

  useEffect(() => {
    if (isOpen) {
 setFormData(initialData || { 
  ...emptyForm, 
  id: Date.now().toString() + Math.random().toString(36).substring(2) 
});    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Update Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              required
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Input 
              id="desc" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label>Status</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as Status})}
                >
                  <option value="Open">Open</option>
                  <option value="Paid">Paid</option>
                  <option value="Due">Due</option>
                  <option value="Inactive">Inactive</option>
                </select>
             </div>
             <div className="grid gap-2">
                <Label htmlFor="rate">Rate</Label>
                <Input 
                  id="rate" type="number" step="0.01"
                  value={formData.rate} 
                  onChange={e => setFormData({...formData, rate: parseFloat(e.target.value) || 0})} 
                />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <Label htmlFor="deposit">Deposit</Label>
                <Input 
                  id="deposit" type="number" step="0.01"
                  value={formData.deposit} 
                  onChange={e => setFormData({...formData, deposit: parseFloat(e.target.value) || 0})} 
                />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="balance">Balance</Label>
                <Input 
                  id="balance" type="number" step="0.01"
                  value={formData.balance} 
                  onChange={e => setFormData({...formData, balance: parseFloat(e.target.value) || 0})} 
                />
             </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Customer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}