import { Product } from '../db.js';

export const getProducts = async (req, res) => {
  const { category, search, minPrice, maxPrice } = req.query;
  const isNew = req.query.new;
  
  try {
    let query = {};

    if (category) {
      query.category = category;
    }

    if (isNew === 'true') {
      query.isNewProduct = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewProduct: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
