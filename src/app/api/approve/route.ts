import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/lib/products';

export const runtime = 'edge';
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

async function readProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return an empty array
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function POST(request: Request) {
  try {
    const { productId, status } = await request.json();

    if (!productId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid productId or status' }, { status: 400 });
    }
    
    const allProducts = await readProducts();
    const productIndex = allProducts.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    const updatedProducts = [...allProducts];
    updatedProducts[productIndex].status = status;

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));

    return NextResponse.json({ message: `Product status updated to ${status}` }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to update product status', error: errorMessage }, { status: 500 });
  }
}
