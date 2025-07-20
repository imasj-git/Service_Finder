import React, { useEffect } from 'react';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: {
    name?: string;
    description?: string;
    image?: string;
    _id?: string;
  };
  onSave: (formData: FormData, isEdit: boolean) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  image: FileList | null;
}

const AddCategoryModal = ({ open, onOpenChange, category, onSave }: AddCategoryModalProps) => {
  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      description: '',
      image: null,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || '',
        description: category.description || '',
        image: null,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        image: null,
      });
    }
  }, [category, form]);

  const onSubmit = (data: CategoryFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }
    onSave(formData, !!category);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Service Category' : 'Add New Service Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Edit the details of this service category.'
              : 'Create a new service category for the Local Heroes platform.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Plumbing" {...field} />
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
                      placeholder="Brief description of the service category..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, ref, ...rest } }) => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      ref={ref}
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
                {category ? 'Update Category' : 'Add Category'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
