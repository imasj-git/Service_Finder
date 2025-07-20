import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/contacts` : 'http://localhost:5000/api/v1/contacts';

const defaultContact = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const AdminContactsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [editContact, setEditContact] = useState(null);
  const [form, setForm] = useState(defaultContact);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setContacts(data.data || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch contacts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleOpenModal = (contact = null) => {
    setEditContact(contact);
    setForm(contact ? { ...contact } : defaultContact);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = editContact ? 'PUT' : 'POST';
      const url = editContact ? `${API_URL}/${editContact._id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      handleCloseModal();
      fetchContacts();
      toast({ title: 'Success', description: editContact ? 'Contact updated' : 'Contact added' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save contact', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchContacts();
      toast({ title: 'Success', description: 'Contact deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete contact', variant: 'destructive' });
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage all contact us messages</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-brand-600 hover:bg-brand-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Message
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenModal(contact)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(contact._id)}>
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
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editContact ? 'Edit Message' : 'Add Message'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <Input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required />
              <Input name="email" placeholder="Email" value={form.email} onChange={handleFormChange} required />
              <Input name="subject" placeholder="Subject" value={form.subject} onChange={handleFormChange} required />
              <Input name="message" placeholder="Message" value={form.message} onChange={handleFormChange} required />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit" className="bg-brand-600 hover:bg-brand-700">{editContact ? 'Update' : 'Add'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminContactsPage; 