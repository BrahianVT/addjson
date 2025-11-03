'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Paperclip } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const MAX_FILE_SIZE = 5000000;
const MAX_FILES = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Product name must be at least 3 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  tags: z.string().min(1, {
    message: 'Please enter at least one tag.',
  }),
  images: z
    .array(z.instanceof(File))
    .min(1, 'At least one product image is required.')
    .max(MAX_FILES, `You can upload a maximum of ${MAX_FILES} images.`)
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine((files) => files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Only .jpg, .png, and .webp formats are supported.'),
});

type UploadFormValues = z.infer<typeof formSchema>;

export function UploadForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      tags: '',
      images: [],
    },
  });

  const currentFiles = form.watch('images');

  useEffect(() => {
    const urls = currentFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [currentFiles]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;

    const currentFiles = form.getValues('images') || [];
    const combinedFiles = [...currentFiles, ...newFiles];

    if (combinedFiles.length > MAX_FILES) {
      toast({
        title: 'Too many images',
        description: `You can only upload a maximum of ${MAX_FILES} images.`,
        variant: 'destructive',
      });
      // Reset file input
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    
    form.setValue('images', combinedFiles, { shouldValidate: true });
    // Reset file input to allow selecting the same file again if removed
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    const currentFiles = form.getValues('images') || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue('images', updatedFiles, { shouldValidate: true });
  }

  async function onSubmit(values: UploadFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', String(values.price));
    formData.append('description', values.description);
    formData.append('tags', values.tags);
    values.images.forEach((image) => {
        formData.append('images', image);
    });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit product');
      }

      toast({
          title: "Product Submitted!",
          description: "Your product has been sent for approval.",
          className: "bg-primary text-primary-foreground",
      });
      form.reset();
      setImagePreviews([]);
    } catch (error) {
       console.error(error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast({
            title: "Submission Failed",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Avocados" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 3.99" {...field} />
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
                  placeholder="Tell us a little bit about the product"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., organic, fruit, local" {...field} />
              </FormControl>
              <FormDescription>
                Separate tags with a comma.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="space-y-2">
            <FormLabel>Product Images</FormLabel>
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {imagePreviews.map((src, index) => (
                        <div key={index} className="relative aspect-square group">
                            <Image
                                src={src}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            <FormControl>
                <div 
                  className="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                >
                    <div className="text-center">
                        <Paperclip className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Click to browse or drag & drop</p>
                        <p className="text-xs text-muted-foreground">Up to {MAX_FILES} images (max 5MB each)</p>
                    </div>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                </div>
            </FormControl>
            <FormDescription>
              High-quality JPG, PNG, or WEBP files are recommended.
            </FormDescription>
            <FormMessage>{form.formState.errors.images?.message}</FormMessage>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Upload className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </form>
    </Form>
  );
}
