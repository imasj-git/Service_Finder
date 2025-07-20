import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/v1/categories';

const defaultCategory = {
  name: '',
  description: '',
  image: '',
};

const AdminCategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState(defaultCategory);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpenModal = (category = null) => {
    setEditCategory(category);
    setForm(category ? { ...category } : defaultCategory);
    setImageFile(null);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (imageFile) formData.append('image', imageFile);
      const method = editCategory ? 'PUT' : 'POST';
      const url = editCategory ? `${API_URL}/${editCategory._id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to save');
      handleCloseModal();
      fetchCategories();
    } catch {
      // handle error
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchCategories();
    } catch {
      // handle error
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage all service categories</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
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
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      {category.image && <img src={category.image} alt={category.name} className="h-12 w-12 object-cover rounded" />}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(category._id)}>
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required />
              <Input name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">{editCategory ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage; 