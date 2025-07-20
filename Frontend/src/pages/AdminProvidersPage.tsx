import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Star, Users, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { useToast } from '../components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/provider` : 'http://localhost:5000/api/v1/provider';
const CATEGORY_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : 'http://localhost:5000/api/v1/categories';

const defaultProvider = {
  fullName: '',
  email: '',
  phoneNumber: '',
  hourlyRate: '',
  category: '',
  address: '',
  city: '',
  bio: '',
  yearsOfExperience: '',
  image: null,
  isVerified: false,

  certifications: '',
  serviceAreas: '',
  servicesOffered: '',
  availability: 'Available Mon-Fri, 8AM-6PM',
};

const AdminProvidersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [providers, setProviders] = useState([]);
  const [editProvider, setEditProvider] = useState(null);
  const [form, setForm] = useState(defaultProvider);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast ? useToast() : { toast: () => {} };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const [providersRes, categoriesRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(CATEGORY_URL),
      ]);
      setProviders(providersRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch providers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleOpenModal = (provider = null) => {
    setEditProvider(provider);
    setForm(provider ? {
      fullName: provider.fullName || '',
      email: provider.email || '',
      phoneNumber: provider.phoneNumber || '',
      hourlyRate: provider.hourlyRate || '',
      category: provider.category?._id || '',
      address: provider.address || '',
      city: provider.city || '',
      bio: provider.bio || '',
      yearsOfExperience: provider.yearsOfExperience || '',
      image: null,
      isVerified: provider.verified || false,
      certifications: provider.certifications?.join(', ') || '',
      serviceAreas: provider.serviceAreas?.join(', ') || '',
      servicesOffered: provider.servicesOffered?.join(', ') || '',
      availability: provider.availability || 'Available Mon-Fri, 8AM-6PM',
    } : defaultProvider);
    setShowAddModal(true);
  };

  const handleCloseModal = () => setShowAddModal(false);

  const handleFormChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files }));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phoneNumber', form.phoneNumber);
      formData.append('hourlyRate', form.hourlyRate);
      formData.append('category', form.category);
      formData.append('address', form.address);
      formData.append('city', form.city);
      formData.append('bio', form.bio);
      formData.append('yearsOfExperience', form.yearsOfExperience);
      formData.append('certifications', form.certifications);
      formData.append('serviceAreas', form.serviceAreas);
      formData.append('servicesOffered', form.servicesOffered);
      formData.append('availability', form.availability);
      formData.append('isVerified', form.isVerified.toString());
      
      if (form.image && form.image[0]) {
        formData.append('image', form.image[0]);
      }

      if (editProvider && editProvider._id) {
        await axios.put(`${API_URL}/${editProvider._id}`, formData, { 
          headers: { 
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } 
        });
        toast({ title: 'Success', description: 'Provider updated successfully' });
      } else {
        await axios.post(API_URL, formData, { 
          headers: { 
            'Content-Type': 'multipart/form-data', 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } 
        });
        toast({ title: 'Success', description: 'Provider added successfully' });
      }
      
      handleCloseModal();
      fetchProviders();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.message || 'Failed to save provider', 
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, { 
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        });
        toast({ title: 'Success', description: 'Provider deleted successfully' });
        fetchProviders();
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: error.response?.data?.message || 'Failed to delete provider', 
          variant: 'destructive' 
        });
      }
    }
  };

  const toggleVerification = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}/verify`, { 
        isVerified: !currentStatus 
      }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      toast({ title: 'Success', description: 'Verification status updated' });
      fetchProviders();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update verification status', 
        variant: 'destructive' 
      });
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.yearsOfExperience?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && provider.verified) ||
                         (filter === 'unverified' && !provider.verified);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (verified) => {
    return verified ? <Badge variant="default">Verified</Badge> : <Badge variant="secondary">Unverified</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
          <p className="text-gray-600">Manage all service providers</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.filter(p => p.verified).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {providers.length > 0 
                ? (providers.reduce((sum, p) => sum + (p.rating || 0), 0) / providers.length).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={provider.image ? `${API_URL.replace('/api/v1', '')}/uploads/${provider.image}` : 'https://randomuser.me/api/portraits/men/32.jpg'}
                          alt={provider.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://randomuser.me/api/portraits/men/32.jpg';
                          }}
                        />
                        <div>
                          <div className="font-medium">{provider.fullName}</div>
                          <div className="text-sm text-gray-500">{provider.city}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{provider.category?.name || 'No Category'}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{provider.yearsOfExperience || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{provider.email}</div>
                        <div className="text-gray-500">{provider.phoneNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${provider.hourlyRate}/hr</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{provider.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-gray-500 ml-1">({provider.reviewCount || 0})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(provider.verified)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleVerification(provider._id, provider.verified)}
                        >
                          {provider.verified ? 'Unverify' : 'Verify'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(provider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(provider._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredProviders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No providers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editProvider ? 'Edit Provider' : 'Add Provider'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="fullName" 
                  placeholder="Full Name" 
                  value={form.fullName} 
                  onChange={handleFormChange} 
                  required 
                />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="phoneNumber" 
                  placeholder="Phone Number" 
                  value={form.phoneNumber} 
                  onChange={handleFormChange} 
                  required 
                />
                <Input 
                  name="hourlyRate" 
                  type="number" 
                  placeholder="Hourly Rate ($)" 
                  value={form.hourlyRate} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
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
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="address" 
                  placeholder="Address" 
                  value={form.address} 
                  onChange={handleFormChange} 
                  required 
                />
                <Input 
                  name="city" 
                  placeholder="City" 
                  value={form.city} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>
              
              <Input
                name="yearsOfExperience"
                placeholder="Years of Experience (e.g., 5 years)"
                value={form.yearsOfExperience}
                onChange={handleFormChange}
                required
              />
              
              <Input
                name="certifications"
                placeholder="Certifications (comma-separated)"
                value={form.certifications}
                onChange={handleFormChange}
              />
              
              <Input
                name="serviceAreas"
                placeholder="Service Areas (comma-separated)"
                value={form.serviceAreas}
                onChange={handleFormChange}
              />
              
              <Input
                name="servicesOffered"
                placeholder="Services Offered (comma-separated)"
                value={form.servicesOffered}
                onChange={handleFormChange}
              />
              
              <Input
                name="availability"
                placeholder="Availability"
                value={form.availability}
                onChange={handleFormChange}
              />
              
              <textarea
                name="bio"
                placeholder="Bio/Description"
                value={form.bio}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 h-20 resize-none"
              />
              
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFormChange}
              />
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={handleFormChange}
                    className="rounded"
                  />
                  <span>Verified Provider</span>
                </label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                  {editProvider ? 'Update' : 'Add'} Provider
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProvidersPage; 