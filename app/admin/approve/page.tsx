import { AppHeader } from '@/components/app-header';
import { products } from '@/lib/products';
import { ApprovalClient } from '@/components/approval-client';

export default function ApprovalPage() {
  // In a real app, you'd fetch this dynamically
  const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold font-headline mb-6">
          Product Approval Queue
        </h1>
        <ApprovalClient initialProducts={sortedProducts} />
      </main>
    </div>
  );
}
