import Razorpay from 'razorpay';
import crypto from 'crypto';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID?.trim() || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || '';

    // Debugging logs to verify variable injection (Masking secret)
    console.log('[RAZORPAY DEBUG] Key ID Loaded:', keyId ? `Yes (${keyId.substring(0, 8)}...)` : 'No');
    console.log('[RAZORPAY DEBUG] Secret Loaded:', keySecret ? 'Yes (Masked)' : 'No');

    if (!keyId || !keySecret || keyId.includes('placeholder') || keySecret.includes('placeholder') || keyId.includes('XXXXX')) {
      return res.status(400).json({ 
        message: 'Razorpay API keys are missing. Please ensure BOTH RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set properly.' 
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
    console.log("ORDER AMOUNT:", amount);

    const options = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Send correct response syntax
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: keyId
    });
  } catch (error) {
    console.error('[RAZORPAY ERROR OVERVIEW]:', error);
    if (error.error) console.error('[RAZORPAY DETAILED ERROR RESPONSE]:', error.error);
    
    // Check if the error is an authentication error
    const isAuthError = error?.error?.description === 'Authentication failed' || error?.error?.code === 'BAD_REQUEST_ERROR';
    
    if (isAuthError) {
      return res.status(401).json({ 
        message: 'Razorpay Authentication failed. Please verify that your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct in your environment variables.'
      });
    }

    res.status(500).json({ message: error.error?.description || 'Could not create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim() || '';

    if (!secret) {
        return res.status(401).json({ success: false, message: 'Server missing Razorpay secret for signature verification.' });
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      // Payment successful
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Payment failed
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('RAZORPAY VERIFY PAYMENT ERROR:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
