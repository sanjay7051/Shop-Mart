import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['electronics', 'clothing', 'books', 'sports', 'footwear'] },
  brand: { type: String, required: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true, default: 0 },
  sizes: [{ type: String }],
  rating: { type: Number, default: 0 },
  isNewProduct: { type: Boolean, default: false }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    selectedSize: { type: String }
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Product = mongoose.model('Product', productSchema);
export const Order = mongoose.model('Order', orderSchema);
