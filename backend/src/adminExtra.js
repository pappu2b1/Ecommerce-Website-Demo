import express from 'express';
import jwt from 'jsonwebtoken';
import { Coupon, Order, User } from './models.js';

const router = express.Router();

const guard = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
    const data = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = await User.findById(data.sub);
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

const valid = body => {
  if (!body.code || !['percentage', 'fixed'].includes(body.type) || Number(body.value) <= 0) return 'Code, type and positive value are required';
  if (body.type === 'percentage' && Number(body.value) > 100) return 'Percentage cannot exceed 100';
  if (Number(body.minimum) < 0) return 'Minimum cannot be negative';
  if (body.expiresAt && new Date(body.expiresAt) <= new Date()) return 'Expiry must be in the future';
};

router.get('/admin/orders/:id', guard, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (error) {
    next(error);
  }
});

router.post('/admin/coupons', guard, async (req, res, next) => {
  try {
    const error = valid(req.body);
    if (error) return res.status(400).json({ message: error });
    res.status(201).json({ coupon: await Coupon.create({ ...req.body, code: String(req.body.code).toUpperCase() }) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Coupon code already exists' });
    next(error);
  }
});

router.patch('/admin/coupons/:id', guard, async (req, res, next) => {
  try {
    const current = await Coupon.findById(req.params.id);
    if (!current) return res.status(404).json({ message: 'Coupon not found' });
    const error = valid({ ...current.toObject(), ...req.body });
    if (error) return res.status(400).json({ message: error });
    Object.assign(current, req.body);
    await current.save();
    res.json({ coupon: current });
  } catch (error) {
    next(error);
  }
});

router.delete('/admin/coupons/:id', guard, async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
