import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Search, Eye, Mail, Phone, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ fname: '', lname: '', email: '', phone: '', password: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch customers');
        setCustomers(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    (customer.fname + ' ' + customer.lname).toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Customer handler
  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add customer');
      setAddOpen(false);
      setAddForm({ fname: '', lname: '', email: '', phone: '', password: '' });
      // Refresh customers
      setLoading(true);
      const token = localStorage.getItem('token');
      const res2 = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data2 = await res2.json();
      setCustomers(data2.data || []);
      setLoading(false);
    } catch (err: any) {
      setAddError(err.message || 'Error adding customer');
      setAddLoading(false);
    }
  };

  // Edit Customer handlers
  const openEdit = (customer: any) => {
    setEditForm({ ...customer, password: '' });
    setEditError(null);
    setEditOpen(true);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fname: editForm.fname,
          lname: editForm.lname,
          email: editForm.email,
          phone: editForm.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update customer');
      setEditOpen(false);
      setEditForm(null);
      // Refresh customers
      setLoading(true);
      const res2 = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data2 = await res2.json();
      setCustomers(data2.data || []);
      setLoading(false);
    } catch (err: any) {
      setEditError(err.message || 'Error updating customer');
      setEditLoading(false);
    }
  };

  // Delete Customer handlers
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete customer');
      setDeleteId(null);
      // Refresh customers
      setLoading(true);
      const res2 = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data2 = await res2.json();
      setCustomers(data2.data || []);
      setLoading(false);
    } catch (err: any) {
      setDeleteError(err.message || 'Error deleting customer');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">View and manage all customer accounts</p>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddOpen(true)}>Add Customer</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">1,156</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">91</p>
              <p className="text-sm text-gray-600">New This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">$125k</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Booking</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{customer.fname?.[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.fname} {customer.lname}</p>
                            <p className="text-sm text-gray-600">ID: {customer._id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{customer.totalBookings ?? '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{customer.totalSpent ? `$${customer.totalSpent}` : '-'}</span>
                      </TableCell>
                      <TableCell>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{customer.lastBooking ? new Date(customer.lastBooking).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'}>
                          {customer.status || 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteId(customer._id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fname">First Name</Label>
                <Input id="fname" name="fname" value={addForm.fname} onChange={handleAddChange} required />
              </div>
              <div>
                <Label htmlFor="lname">Last Name</Label>
                <Input id="lname" name="lname" value={addForm.lname} onChange={handleAddChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={addForm.email} onChange={handleAddChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={addForm.phone} onChange={handleAddChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={addForm.password} onChange={handleAddChange} required minLength={6} />
            </div>
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={addLoading}>Cancel</Button>
              <Button type="submit" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Customer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-fname">First Name</Label>
                  <Input id="edit-fname" name="fname" value={editForm.fname} onChange={handleEditChange} required />
                </div>
                <div>
                  <Label htmlFor="edit-lname">Last Name</Label>
                  <Input id="edit-lname" name="lname" value={editForm.lname} onChange={handleEditChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" value={editForm.phone} onChange={handleEditChange} />
              </div>
              {editError && <div className="text-red-500 text-sm">{editError}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={editLoading}>Cancel</Button>
                <Button type="submit" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>Are you sure you want to delete this customer? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
