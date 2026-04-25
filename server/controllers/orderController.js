import { Order } from '../db.js';

export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const order = new Order({
      user: userId,
      orderItems: orderItems.map(item => ({
        ...item,
        productId: item._id || item.id
      })),
      shippingAddress,
      totalPrice: totalPrice || 0,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const userId = req.user?.id || req.user?._id;
    if (order.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
