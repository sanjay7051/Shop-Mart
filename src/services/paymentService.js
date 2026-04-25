import api from './api';

export const createRazorpayOrder = async (amount) => {
  try {
    const { data } = await api.post('/payment/create-order', { amount });
    return data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const { data } = await api.post('/payment/verify', paymentData);
    return data;
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    throw error;
  }
};
