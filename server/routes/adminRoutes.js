import express from 'express';
import {
  getStats,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, isAdmin);

router.get('/stats', getStats);

router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/orders')
  .get(getOrders);

router.route('/orders/:id')
  .put(updateOrderStatus)
  .delete(deleteOrder);

export default router;
