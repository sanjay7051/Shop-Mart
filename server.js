import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import connectDB from './server/config/db.js';
import bcrypt from 'bcryptjs';
import authRoutes from './server/routes/authRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import orderRoutes from './server/routes/orderRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import paymentRoutes from './server/routes/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  await connectDB();
  
  try {
    // Auto-seed
    const { Product, User } = await import('./server/db.js');

    // Admin auto-setup
    const adminEmail = 'admin@shopmart.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    const adminPasswordHash = await bcrypt.hash('Admin123', 10);
    
    if (existingAdmin) {
      existingAdmin.password = adminPasswordHash;
      existingAdmin.isAdmin = true;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('All Clear');
    } else {
      await User.create({ name: 'Admin', email: adminEmail, password: adminPasswordHash, isAdmin: true, role: 'admin' });
      console.log('Admin user created with password Admin123');
    }
    
    // Force clear and re-seed to apply new products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Core definition of 40 varied products mapping realistic titles/categories to robust Unsplash images
    const templates = [
      // Electronics
      { t: "Premium Wireless Headphones", d: "High-fidelity sound with 30-hour battery life.", c: "electronics", b: "AudioTech", img: "1505740420928-5e560c06d30e", p: [2999, 14999] },
      { t: "Minimalist Smartwatch", d: "Track fitness and notifications seamlessly.", c: "electronics", b: "WearableCo", img: "1523275335684-37898b6baf30", p: [4000, 12000] },
      { t: "Ultra-Wide Gaming Monitor", d: "34-inch curved monitor with 144Hz refresh rate.", c: "electronics", b: "VisionTech", img: "1527443224154-c4a3942d3acf", p: [15000, 45000] },
      { t: "Mechanical Gaming Keyboard", d: "RGB backlit mechanical keyboard with blue switches.", c: "electronics", b: "KeyPro", img: "1595225476474-87563907a212", p: [2500, 8999] },
      { t: "4K Action Camera", d: "Capture adventures in stunning 4K 60fps resolution.", c: "electronics", b: "CamPro", img: "1516035069371-29a1b244cc32", p: [8000, 25000] },
      { t: "Wireless Charging Pad", d: "Fast 15W wireless charging pad for all devices.", c: "electronics", b: "ChargeTech", img: "1622445275462-f41cb83d463b", p: [999, 2999] },
      { t: "Noise-Cancelling Earbuds", d: "True wireless earbuds with active noise cancellation.", c: "electronics", b: "AudioTech", img: "1606220588913-b3aacb4d2f46", p: [3500, 11000] },
      { t: "Smart Home Speaker", d: "Voice-controlled smart speaker with rich bass.", c: "electronics", b: "SmartLife", img: "1589003071644-bd7fc23277ce", p: [2500, 8000] },

      // Clothing
      { t: "Classic Denim Jacket", d: "Timeless denim jacket with a comfortable fit.", c: "clothing", b: "UrbanWear", img: "1576871337622-98d48d1cf531", p: [1500, 4500] },
      { t: "Cotton Crewneck T-Shirt", d: "Soft, breathable premium cotton t-shirt.", c: "clothing", b: "Basics", img: "1521572163474-6864f9cf17ab", p: [499, 1299] },
      { t: "Women's Summer Floral Dress", d: "Breezy floral summer dress for casual days.", c: "clothing", b: "SunWear", img: "1572804013309-59a88b7e92f1", p: [1200, 3999] },
      { t: "Men's Slim Fit Chinos", d: "Comfortable stretch cotton chinos for everyday.", c: "clothing", b: "ModernMan", img: "1624378439575-d8705ad7ae80", p: [1100, 2499] },
      { t: "Winter Knit Sweater", d: "Warm and cozy oversized knit sweater.", c: "clothing", b: "UrbanWear", img: "1611312449408-fcece27cdbb1", p: [1500, 3500] },
      { t: "Leather Crossbody Bag", d: "Elegant genuine leather crossbody bag.", c: "clothing", b: "LuxeLeather", img: "1590736969955-71cc94801759", p: [2500, 7999] },
      { t: "Athletic Performance Hoodie", d: "Moisture-wicking hoodie for active lifestyles.", c: "clothing", b: "ProActive", img: "1556821840-0a53f156bcce", p: [1299, 2999] },
      { t: "Casual Plaid Shirt", d: "Soft flannel plaid shirt for a relaxed look.", c: "clothing", b: "StreetStyle", img: "1599939571322-792fa68c07d3", p: [899, 2100] },

      // Footwear
      { t: "Pro Running Shoes", d: "Lightweight running shoes for daily miles.", c: "footwear", b: "SpeedX", img: "1542291026-7eec264c27ff", p: [3500, 8999] },
      { t: "Casual Canvas Sneakers", d: "Comfortable canvas sneakers for everyday use.", c: "footwear", b: "StreetWalk", img: "1525966222134-fcfa99b8ae77", p: [1200, 3500] },
      { t: "Vintage Leather Boots", d: "Handcrafted leather boots for rugged outdoor use.", c: "footwear", b: "RuggedTrail", img: "1520639888713-7851133b1ed0", p: [4500, 11000] },
      { t: "Men's Formal Oxfords", d: "Classic leather oxford shoes for formal occasions.", c: "footwear", b: "Gentleman", img: "1595950653106-6eb8fb30b1bc", p: [3000, 7500] },
      { t: "High-Top Basketball Sneakers", d: "Premium court shoes with excellent ankle support.", c: "footwear", b: "CourtMaster", img: "1608231387042-66d1773070a5", p: [4500, 12999] },
      { t: "Women's Ankle Boots", d: "Stylish suede ankle boots.", c: "footwear", b: "LuxeLeather", img: "1512403754473-2b23531fb5b1", p: [2500, 6500] },
      { t: "Slip-On Loafers", d: "Comfortable slip-on loafers for casual outings.", c: "footwear", b: "StreetWalk", img: "1612093836155-081977759dc0", p: [1500, 4000] },
      { t: "Trail Hiking Shoes", d: "Durable hiking shoes with deep traction.", c: "footwear", b: "RuggedTrail", img: "1551107696-a4b0c5a0d9a2", p: [3500, 8500] },

      // Sports
      { t: "Professional Tennis Racket", d: "Lightweight graphite tennis racket.", c: "sports", b: "CourtMaster", img: "1599586120429-48281b6f0ece", p: [4500, 12000] },
      { t: "Yoga Mat with Alignment", d: "Eco-friendly yoga mat with posture guidelines.", c: "sports", b: "ZenFit", img: "1518611012118-6a45c36f52e2", p: [899, 2499] },
      { t: "Dumbbell Set (10kg)", d: "Adjustable dumbbell set for home workouts.", c: "sports", b: "IronGym", img: "1540497077202-7c8a3999166f", p: [2500, 6000] },
      { t: "Stainless Steel Water Bottle", d: "Insulated bottle keeps drinks cold 24 hours.", c: "sports", b: "HydroVibe", img: "1602143407151-7111542de6e8", p: [799, 1899] },
      { t: "Resistance Jump Rope", d: "Heavy jump rope for intense cardio workouts.", c: "sports", b: "ProActive", img: "1534628522659-3356bc0c76ab", p: [499, 1299] },
      { t: "Professional Boxing Gloves", d: "Premium leather boxing gloves for sparring.", c: "sports", b: "IronGym", img: "1555597673-b21d5c928509", p: [2000, 5500] },
      { t: "Premium Soccer Ball", d: "Match-quality durable soccer ball.", c: "sports", b: "CourtMaster", img: "1615554859842-c97fb842dfbc", p: [999, 2999] },
      { t: "Gymnastics Rings Set", d: "Wooden gymnastics rings with adjustable straps.", c: "sports", b: "ZenFit", img: "1581023725514-469bfd688cf6", p: [1500, 3500] },

      // Books
      { t: "The Art of Thinking Clearly", d: "A fascinating book about cognitive biases.", c: "books", b: "Penguin", img: "1544947950-fa07a98d237f", p: [399, 799] },
      { t: "Atomic Habits", d: "Proven way to build good habits and break bad ones.", c: "books", b: "Random House", img: "1589829085413-56de8ae18c73", p: [499, 899] },
      { t: "Deep Work", d: "Rules for focused success in a distracted world.", c: "books", b: "Grand Central", img: "1491841550275-ad7854e35ca6", p: [450, 850] },
      { t: "Sapiens: A Brief History", d: "A narrative of humanity's creation and evolution.", c: "books", b: "Harper", img: "1589998059171-989d887dda6e", p: [599, 1100] },
      { t: "The Psychology of Money", d: "Timeless lessons on wealth, greed, and happiness.", c: "books", b: "Harriman House", img: "1543002588-bfa74002ed7e", p: [350, 650] },
      { t: "Thinking, Fast and Slow", d: "Groundbreaking tour of the mind and decision making.", c: "books", b: "Penguin", img: "1512820790803-83ca734da294", p: [499, 950] },
      { t: "Essentialism", d: "The disciplined pursuit of less.", c: "books", b: "Crown Business", img: "1495446811362-3482701f5ee7", p: [450, 799] },
      { t: "Rich Dad Poor Dad", d: "What the rich teach their kids about money.", c: "books", b: "Plata Publishing", img: "1532012197267-da84d127e765", p: [399, 750] }
    ];

    // Dynamically generate the 40 products from templates
    const initialProducts = templates.map(t => {
      // Randomize data based on realistic boundaries
      const price = Math.floor(Math.random() * (t.p[1] - t.p[0] + 1)) + t.p[0];
      const stock = Math.floor(Math.random() * 150) + 10;
      const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1); // Keep ratings between 4.0 and 5.0 for premium feel
      const isNewProduct = Math.random() > 0.7; // ~30% chance to be marked as new
      
      const product = {
        title: t.t,
        description: t.d,
        price,
        category: t.c,
        brand: t.b,
        images: [`https://images.unsplash.com/photo-${t.img}?w=800&q=80&ixlib=rb-4.0.3&auto=format&fit=crop`],
        stock,
        rating: Number(rating),
        isNewProduct
      };

      // Add appropriate sizes depending on category
      if (t.c === 'clothing') product.sizes = ["S", "M", "L", "XL"];
      if (t.c === 'footwear') product.sizes = ["7", "8", "9", "10", "11"];

      return product;
    });
    
    await Product.insertMany(initialProducts);
    console.log('Database seeded with new products!');
  } catch (err) {
    console.error('Error during auto-seeding:', err);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payment', paymentRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
