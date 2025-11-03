
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/products';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Clock, ZoomIn, X } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';

interface ProduceCardProps {
  product: Product;
}

export function ProduceCard({ product }: ProduceCardProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (product.createdAt) {
      setFormattedDate(
        format(new Date(product.createdAt), "MMM d, yyyy 'at' h:mm a")
      );
    }
  }, [product.createdAt]);

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {product.imageUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <div 
                    className="aspect-video relative group cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                  >
                    <Image
                      src={url}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={product.imageHint}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {product.imageUrls.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              </>
            )}
          </Carousel>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font.headline mb-1">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm">
            {product.description}
          </CardDescription>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="outline"
                className="capitalize bg-accent text-accent-foreground border-accent-foreground/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {formattedDate && (
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Card>

      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-2">
             <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video">
              <Image 
                src={selectedImage} 
                alt="Enlarged product view" 
                fill
                className="object-contain"
              />
            </div>
             <DialogClose asChild>
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background text-muted-foreground"
                    >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
