import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product, products as allProducts } from '@/lib/products';

export const runtime = 'edges';
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const productIndex = allProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    // Make sure we preserve existing imageUrls if they are not part of the update
    const updatedProduct = { 
        ...allProducts[productIndex], 
        ...body,
    };
    
    const updatedProducts = [...allProducts];
    updatedProducts[productIndex] = updatedProduct;

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to update product', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const productIndex = allProducts.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const updatedProducts = allProducts.filter(p => p.id !== id);

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to delete product', error: errorMessage }, { status: 500 });
  }
}
