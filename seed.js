import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './server/db.js';

dotenv.config();

const products = [
  {
    title: 'Premium Cotton Oversized Tee',
    description: 'A heavy-weight premium cotton t-shirt with a relaxed oversized fit. Perfect for everyday luxury comfort.',
    price: 45,
    category: 'clothing',
    brand: 'LUXE ESSENTIALS',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    stock: 50,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8
  },
  {
    title: 'Minimalist Leather Sneakers',
    description: 'Handcrafted Italian leather sneakers with a clean, minimalist silhouette and durable rubber sole.',
    price: 180,
    category: 'clothing',
    brand: 'LUXE FOOTWEAR',
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800'],
    stock: 25,
    sizes: ['7', '8', '9', '10', '11'],
    rating: 4.9
  },
  {
    title: 'Noise Cancelling Wireless Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life and premium high-fidelity sound.',
    price: 349,
    category: 'electronics',
    brand: 'LUXE AUDIO',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    rating: 4.7
  },
  {
    title: 'Smart Minimalist Watch',
    description: 'A sleek smart watch that blends traditional design with modern health tracking features.',
    price: 299,
    category: 'electronics',
    brand: 'LUXE TECH',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
    stock: 30,
    rating: 4.6
  },
  {
    title: 'The Art of Modern Design',
    description: 'A comprehensive guide to modern aesthetic principles and architectural masterpieces.',
    price: 65,
    category: 'books',
    brand: 'LUXE PUBLISHING',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'],
    stock: 100,
    rating: 4.9
  },
  {
    title: 'Professional Yoga Mat',
    description: 'High-density eco-friendly yoga mat with superior grip and cushioning for professional practice.',
    price: 85,
    category: 'sports',
    brand: 'LUXE ACTIVE',
    images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=800'],
    stock: 40,
    rating: 4.8
  }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxecommerce';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Database seeded with products');

    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
