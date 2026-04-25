import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: number, required: true },
  category: { type: String, enum: ['electronics', 'clothing', 'books', 'sports'], required: true },
  brand: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true },
  sizes: [{ type: String }],
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
