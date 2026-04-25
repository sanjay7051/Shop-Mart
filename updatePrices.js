import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { Product } = await import('./server/db.js');
    
    const updates = {
      'Premium Cotton Oversized Tee': 999,
      'Minimalist Leather Sneakers': 2499,
      'Noise Cancelling Wireless Headphones': 4999,
      'Smart Minimalist Watch': 3999,
      'The Art of Modern Design': 599,
      'Professional Yoga Mat': 1299
    };

    for (const [title, price] of Object.entries(updates)) {
      await Product.updateOne({ title }, { $set: { price } });
    }
    console.log('Prices updated in database');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
};

update();
