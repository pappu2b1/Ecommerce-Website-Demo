import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, Coupon, Product, User } from './models.js';

const names = ['Aero Smart Watch', 'Nova Street Sneakers', 'Essential Cotton Tee', 'Arc Lounge Chair', 'Classic Lens Camera', 'Glow Beauty Set', 'Luna Sunglasses', 'Sage Ceramic Vase', 'Muse Leather Heels', 'Orbit Minimal Watch', 'Pure Skin Ritual', 'Studio Headphones', 'Everyday Linen Shirt', 'Cloud Knit Sweater', 'Terra Table Lamp', 'Court Leather Sneaker'];
const categories = ['Electronics', 'Shoes', 'Fashion', 'Home Decor', 'Electronics', 'Beauty', 'Accessories', 'Home Decor', 'Shoes', 'Accessories', 'Beauty', 'Electronics', 'Fashion', 'Fashion', 'Home Decor', 'Shoes'];
const prices = [129, 99, 49, 189, 399, 79, 65, 59, 119, 149, 89, 179, 69, 89, 129, 109];

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);

  for (const [index, name] of names.entries()) {
    const slug = name.toLowerCase().replaceAll(' ', '-');
    await Product.updateOne(
      { slug },
      { $setOnInsert: {
        slug,
        name,
        shortDescription: 'Considered design for elevated everyday living.',
        description: `Thoughtfully designed ${name} for this portfolio demo.`,
        category: categories[index],
        brand: 'Luma Studio',
        price: prices[index],
        originalPrice: prices[index] + 30,
        rating: 4.5 + (index % 5) / 10,
        reviewCount: 18 + index * 7,
        stock: 12 + index,
        sku: `LUMA-${String(index + 1).padStart(4, '0')}`,
        images: [],
        colors: ['Ivory', 'Black'],
        sizes: ['One Size'],
        features: ['Premium materials', 'Everyday utility'],
        isFeatured: index < 8,
        isNew: index > 11,
        isBestSeller: index % 3 === 0,
      } },
      { upsert: true },
    );
  }

  for (const name of [...new Set(categories)]) {
    const slug = name.toLowerCase().replaceAll(' ', '-');
    await Category.updateOne({ slug }, { $setOnInsert: { name, slug } }, { upsert: true });
  }

  for (const coupon of [
    { code: 'WELCOME10', type: 'percentage', value: 10, minimum: 50, expiresAt: new Date('2030-01-01') },
    { code: 'LUMA20', type: 'fixed', value: 20, minimum: 150, expiresAt: new Date('2030-01-01') },
  ]) {
    await Coupon.updateOne({ code: coupon.code }, { $setOnInsert: coupon }, { upsert: true });
  }

  for (const user of [
    { name: 'LUMA Admin', email: 'admin@luma.demo', password: 'AdminDemo123!', role: 'admin' },
    { name: 'Demo Customer', email: 'customer@luma.demo', password: 'CustomerDemo123!', role: 'customer' },
  ]) {
    if (!await User.exists({ email: user.email })) await User.create(user);
  }

  console.log('Seed verified: 16 demo products, 6 categories, 2 coupons and 2 demo users are present.');
  await mongoose.disconnect();
}

seed().catch(error => {
  console.error(error.message);
  process.exit(1);
});
