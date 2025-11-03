import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product, products as allProducts } from '@/lib/products';

const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const tags = (formData.get('tags') as string).split(',').map(tag => tag.trim());
    const images = formData.getAll('images') as File[];

    if (!name || !price || !description || !tags || images.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const publicPath = path.join(process.cwd(), 'public', 'images', 'uploads');
    await fs.mkdir(publicPath, { recursive: true });

    const imageUrls = [];
    for (const image of images) {
      const imagePath = `/images/uploads/${image.name}`;
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(path.join(publicPath, image.name), imageBuffer);
      imageUrls.push(imagePath);
    }
    
    const newProduct: Product = {
      id: (allProducts.length + 1).toString(),
      name,
      price,
      description,
      tags,
      imageUrls,
      imageHint: `${name.split(' ').slice(0, 2).join(' ')}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updatedProducts = [...allProducts, newProduct];

    await fs.writeFile(productsFilePath, JSON.stringify(updatedProducts, null, 2));

    return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to add product', error: errorMessage }, { status: 500 });
  }
}
