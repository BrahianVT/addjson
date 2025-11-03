import { AppHeader } from '@/components/app-header';
import { ProductDisplay } from '@/components/product-display';
import { products as allProducts, Product } from '@/lib/products';

export default function Home() {
  const approvedProducts = allProducts
    .filter(p => p.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const allTags = [...new Set(approvedProducts.flatMap((p) => p.tags))];
  const maxPrice = Math.ceil(Math.max(...approvedProducts.map((p) => p.price), 0));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <ProductDisplay
        products={approvedProducts}
        tags={allTags}
        maxPrice={maxPrice}
      />
    </div>
  );
}
