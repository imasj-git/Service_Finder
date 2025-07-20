import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useToast } from '../components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/services` : 'http://localhost:5000/api/v1/services';
const CATEGORY_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : 'http://localhost:5000/api/v1/categories';

const defaultService = {
  name: '',
  description: '',
  price: '',
  category: '',
  image: null,
};

const AdminServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [form, setForm] = useState(defaultService);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { toast } = useToast ? useToast() : { toast: () => {} };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(CATEGORY_URL),
      ]);
      setServices(servicesRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
      if ((categoriesRes.data.data || []).length === 0) {
        toast({ title: 'No categories found', description: 'Please add a category before adding a service.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleOpenModal = (service = null) => {
    setEditService(service);
    setForm(service ? {
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      category: service.category?._id || '',
      image: null,
    } : defaultService);
    setShowAddModal(true);
  };
  const handleCloseModal = () => setShowAddModal(false);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      if (form.image && form.image[0]) {
        formData.append('image', form.image[0]);
      }
      // Debug: log FormData entries
      console.log('Submitting service:', [...formData.entries()]);
      if (editService && editService._id) {
        await axios.put(`${API_URL}/${editService._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      } else {
        await axios.post(API_URL, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` } });
      }
      handleCloseModal();
      fetchServices();
    } catch {
      // handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchServices();
    } catch {
      // handle error
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.category?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage all services</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category?.name}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      {service.image && (
                        <img src={service.image} alt="Service" className="w-12 h-12 object-cover rounded" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(service._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Add/Edit Modal */}
      {showAddModal && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editService ? 'Edit Service' : 'Add Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required />
              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
                className="w-full border rounded px-3 py-2"
                disabled={categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="" disabled>No categories available</option>
                ) : (
                  <>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </>
                )}
              </select>
              <Input name="price" placeholder="Price" value={form.price} onChange={handleFormChange} required />
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFormChange}
              />
              <Input name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={categories.length === 0}>{editService ? 'Update' : 'Add'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminServicesPage; 