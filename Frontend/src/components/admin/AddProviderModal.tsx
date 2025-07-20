import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';

interface AddProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  service?: any;
  onSuccess?: () => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  image: FileList | null;
}

const AddServiceModal = ({ open, onOpenChange, categories, service, onSuccess }: AddProviderModalProps) => {
  const form = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      image: null,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        category: service.category?._id || '',
        image: null,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
    }
  }, [service, form]);

  const onSubmit = async (data: ServiceFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }
    try {
      if (service && service._id) {
        await axios.put(`/api/services/${service._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('/api/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      if (onSuccess) onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (err) {
      alert('Failed to save service');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Service Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Service Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the service..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                {service ? 'Update Service' : 'Add Service'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
