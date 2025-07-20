import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddCategoryModal from './AddCategoryModal';

const API_URL = 'http://localhost:3000/api/v1/categories';

interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditCategory(null);
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCategories();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSave = async (formData: FormData, isEdit: boolean) => {
    try {
      const url = isEdit && editCategory ? `${API_URL}/${editCategory._id}` : API_URL;
      const method = isEdit ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-600">Manage service categories and subcategories</p>
        </div>
        <Button onClick={handleAdd} className="bg-brand-600 hover:bg-brand-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-12 w-12 object-cover rounded mb-2"
                    />
                  )}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        category={editCategory || undefined}
        onSave={handleSave}
      />
    </div>
  );
};

export default Categories;
