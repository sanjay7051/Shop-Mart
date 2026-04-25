import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './db.js';

dotenv.config();

const products = [
  {
    title: "Premium Wireless Headphones",
    description: "High-fidelity sound with active noise cancellation and 30-hour battery life.",
    price: 12999,
    category: "electronics",
    brand: "AudioTech",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    stock: 50,
    rating: 4.8,
    isNewProduct: true
  },
  {
    title: "Minimalist Smartwatch",
    description: "Track your fitness, heart rate, and notifications with this sleek smartwatch.",
    price: 8999,
    category: "electronics",
    brand: "WearableCo",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    stock: 30,
    rating: 4.5,
    isNewProduct: true
  },
  {
    title: "Classic Denim Jacket",
    description: "Timeless denim jacket with a comfortable fit and durable construction.",
    price: 3499,
    category: "clothing",
    brand: "UrbanWear",
    images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80"],
    stock: 100,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    isNewProduct: false
  },
  {
    title: "Cotton Crewneck T-Shirt",
    description: "Soft, breathable cotton t-shirt for everyday wear.",
    price: 999,
    category: "clothing",
    brand: "Basics",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"],
    stock: 200,
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    isNewProduct: true
  },
  {
    title: "The Art of Thinking Clearly",
    description: "A fascinating book about cognitive biases and how to avoid them.",
    price: 499,
    category: "books",
    brand: "Penguin",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"],
    stock: 150,
    rating: 4.7,
    isNewProduct: false
  },
  {
    title: "Atomic Habits",
    description: "An easy and proven way to build good habits and break bad ones.",
    price: 599,
    category: "books",
    brand: "Random House",
    images: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80"],
    stock: 120,
    rating: 4.9,
    isNewProduct: true
  },
  {
    title: "Pro Running Shoes",
    description: "Lightweight and responsive running shoes for your daily miles.",
    price: 7999,
    category: "footwear",
    brand: "SpeedX",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    stock: 80,
    sizes: ["7", "8", "9", "10", "11"],
    rating: 4.8,
    isNewProduct: true
  },
  {
    title: "Casual Canvas Sneakers",
    description: "Comfortable and stylish canvas sneakers for everyday use.",
    price: 2499,
    category: "footwear",
    brand: "StreetWalk",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"],
    stock: 150,
    sizes: ["7", "8", "9", "10", "11"],
    rating: 4.4,
    isNewProduct: false
  },
  {
    title: "4K Action Camera",
    description: "Capture your adventures in stunning 4K resolution.",
    price: 15999,
    category: "electronics",
    brand: "CamPro",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"],
    stock: 40,
    rating: 4.6,
    isNewProduct: true
  },
  {
    title: "Yoga Mat with Alignment Lines",
    description: "Eco-friendly yoga mat with alignment lines for perfect posture.",
    price: 1499,
    category: "sports",
    brand: "ZenFit",
    images: ["https://images.unsplash.com/photo-1518611012118-6a45c36f52e2?w=800&q=80"],
    stock: 200,
    rating: 4.7,
    isNewProduct: false
  },
  {
    title: "Dumbbell Set (10kg)",
    description: "Adjustable dumbbell set for home workouts.",
    price: 3999,
    category: "sports",
    brand: "IronGym",
    images: ["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"],
    stock: 60,
    rating: 4.5,
    isNewProduct: true
  },
  {
    title: "Leather Crossbody Bag",
    description: "Elegant genuine leather crossbody bag for women.",
    price: 4599,
    category: "clothing",
    brand: "LuxeLeather",
    images: ["https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&q=80"],
    stock: 45,
    rating: 4.8,
    isNewProduct: true
  },
  {
    title: "Wireless Charging Pad",
    description: "Fast wireless charging pad for all Qi-enabled devices.",
    price: 1299,
    category: "electronics",
    brand: "ChargeTech",
    images: ["https://images.unsplash.com/photo-1622445275462-f41cb83d463b?w=800&q=80"],
    stock: 100,
    rating: 4.2,
    isNewProduct: false
  },
  {
    title: "Men's Formal Oxford Shoes",
    description: "Classic leather oxford shoes for formal occasions.",
    price: 5999,
    category: "footwear",
    brand: "Gentleman",
    images: ["https://images.unsplash.com/photo-1595950653106-6eb8fb30b1bc?w=800&q=80"],
    stock: 70,
    sizes: ["8", "9", "10", "11"],
    rating: 4.6,
    isNewProduct: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://amin:Admin123@cluster0.aghsibv.mongodb.net/?appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    await Product.insertMany(products);
    console.log('Successfully seeded products');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
