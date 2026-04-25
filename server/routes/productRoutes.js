import express from 'express';
import { getProducts, getProductById, getNewArrivals } from '../controllers/productController.js';

const router = express.Router();

router.get('/new', getNewArrivals);
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
