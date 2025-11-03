
'use client';

import { useState } from 'react';
import { Product } from '@/lib/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ApprovalClientProps {
  initialProducts: Product[];
}

const ITEMS_PER_PAGE = 10;

export function ApprovalClient({ initialProducts }: ApprovalClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);

  const pendingProducts = products.filter((p) => p.status === 'pending');
  const totalPages = Math.ceil(pendingProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = pendingProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (
    productId: string,
    status: 'approved' | 'rejected'
  ) => {
    setIsLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status} product`);
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status } : p))
      );

      toast({
        title: 'Success',
        description: `Product has been ${status}.`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div>
      {pendingProducts.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div
                      className="relative w-16 h-16 cursor-pointer group"
                      onClick={() => setViewingProduct(product)}
                    >
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                      {product.imageUrls.length > 1 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold text-sm">
                            +{product.imageUrls.length - 1}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:bg-green-100 hover:text-green-700"
                      onClick={() => handleUpdateStatus(product.id, 'approved')}
                      disabled={isLoading[product.id]}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100 hover:text-red-700 ml-2"
                      onClick={() => handleUpdateStatus(product.id, 'rejected')}
                      disabled={isLoading[product.id]}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
          <h3 className="text-xl font-semibold text-muted-foreground">
            No Pending Products
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The approval queue is empty.
          </p>
        </div>
      )}

      {viewingProduct && (
        <Dialog
          open={!!viewingProduct}
          onOpenChange={(open) => !open && setViewingProduct(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Images for: {viewingProduct.name}</DialogTitle>
            </DialogHeader>
            <Carousel className="w-full">
              <CarouselContent>
                {viewingProduct.imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative">
                      <Image
                        src={url}
                        alt={`${viewingProduct.name} image ${index + 1}`}
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {viewingProduct.imageUrls.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
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
    </div>
  );
}
