'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { ProduceCard } from '@/components/produce-card';
import { ProduceFilters } from '@/components/produce-filters';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from './ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProductDisplayProps {
  products: Product[];
  tags: string[];
  maxPrice: number;
}

const ITEMS_PER_PAGE = 10;

export function ProductDisplay({
  products,
  tags,
  maxPrice,
}: ProductDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => product.tags.includes(tag));
      return matchesSearch && matchesPrice && matchesTags;
    });
  }, [products, searchTerm, priceRange, selectedTags]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <SidebarProvider>
      <div className="flex min-h-svh">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-headline">Filters</h2>
              <SidebarTrigger />
            </div>
            <Separator />
          </SidebarHeader>
          <SidebarContent>
            <ProduceFilters
              tags={tags}
              maxPrice={maxPrice}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedTags={selectedTags}
              onSelectedTagsChange={setSelectedTags}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          </SidebarContent>
          <SidebarFooter>
            <Separator />
            <p className="p-2 text-xs text-muted-foreground">
              {filteredProducts.length} of {products.length} products shown.
            </p>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center gap-4">
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-headline">
                Fresh Produce
              </h1>
            </div>
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProduceCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
                <h3 className="text-xl font-semibold text-muted-foreground">
                  No Products Found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters to find what you're looking for.
                </p>
              </div>
            )}
             {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1)}} />
                    </PaginationItem>
                     {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1)}}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1)}} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
