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
import { Search, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import AddServiceModal from './AddProviderModal';
import axios from 'axios';

const ServiceProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get('/api/services'),
        axios.get('/api/categories'),
      ]);
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setShowAddModal(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const filteredServices = services.filter(service =>
    service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage all registered services</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-brand-600 hover:bg-brand-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">127</p>
              <p className="text-sm text-gray-600">Total Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">112</p>
              <p className="text-sm text-gray-600">Active Services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">15</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">4.8</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8">No services found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.category?.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell>
                        {service.image && (
                          <img src={service.image} alt="Service" className="w-12 h-12 object-cover rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
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
          )}
        </CardContent>
      </Card>

      <AddServiceModal 
        open={showAddModal || showEditModal}
        onOpenChange={(open) => {
          setShowAddModal(false);
          setShowEditModal(false);
          if (!open) setSelectedService(null);
        }}
        categories={categories}
        service={selectedService}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default ServiceProviders;
