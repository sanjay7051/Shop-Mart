import { Product, Order, User } from '../db.js';

export const getStats = async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const users = await User.countDocuments();
    res.json({ products, orders, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, brand, images, stock } = req.body;
    
    // Detailed specific validations
    if (!title || title.trim().length === 0) return res.status(400).json({ message: 'Product title is required' });
    if (!description || description.trim().length < 10) return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    if (price === undefined || isNaN(price) || Number(price) <= 0) return res.status(400).json({ message: 'Price must be a valid positive number' });
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
    if (!brand || brand.trim().length === 0) return res.status(400).json({ message: 'Brand is required' });
    if (!category) return res.status(400).json({ message: 'Category is required' });
    if (!images || images.length === 0 || !images[0]) return res.status(400).json({ message: 'At least one valid image URL is required' });

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, brand, images, stock } = req.body;

    // Detailed specific validations
    if (!title || title.trim().length === 0) return res.status(400).json({ message: 'Product title is required' });
    if (!description || description.trim().length < 10) return res.status(400).json({ message: 'Description must be at least 10 characters long' });
    if (price === undefined || isNaN(price) || Number(price) <= 0) return res.status(400).json({ message: 'Price must be a valid positive number' });
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) return res.status(400).json({ message: 'Stock cannot be negative' });
    if (!brand || brand.trim().length === 0) return res.status(400).json({ message: 'Brand is required' });
    if (!category) return res.status(400).json({ message: 'Category is required' });
    if (!images || images.length === 0 || !images[0]) return res.status(400).json({ message: 'At least one valid image URL is required' });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    console.log("DELETE HIT:", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    console.log("DELETE HIT:", req.params.id);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
