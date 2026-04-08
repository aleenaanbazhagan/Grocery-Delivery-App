const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();
let dbConnected = false;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Demo users for offline mode
const demoUsers = new Map();
const demoOrders = [];

app.get('/', (req, res) => {
  res.json({ 
    message: 'Grocer API is running', 
    status: 'ok',
    dbStatus: dbConnected ? 'connected' : 'demo mode'
  });
});

// Auth routes with demo mode support
app.post('/api/auth/register', async (req, res) => {
  if (!dbConnected) {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (demoUsers.has(email)) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const user = { id: Date.now().toString(), name, email, phone, address: {} };
    demoUsers.set(email, { ...user, password });
    const token = 'demo-token-' + Date.now();
    return res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  }
  return require('./routes/auth').router(req, res);
});

app.post('/api/auth/login', async (req, res) => {
  if (!dbConnected) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = demoUsers.get(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = 'demo-token-' + Date.now();
    const { password: _, ...userData } = user;
    return res.json({ message: 'Login successful', token, user: userData });
  }
  return require('./routes/auth').router(req, res);
});

app.get('/api/auth/me', (req, res) => {
  if (!dbConnected) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const users = [...demoUsers.values()].filter(u => 'demo-token-' + u.id.startsWith('demo-token-'));
    return res.json({ user: { id: 'demo', name: 'Demo User', email: 'demo@example.com' } });
  }
  return require('./routes/auth').router(req, res);
});

// Products route
app.get('/api/products', (req, res) => {
  const products = [
    { id: 1, name: 'Fresh Apples', price: 120, originalPrice: 150, unit: '1 kg', category: 1, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Fresh, juicy red apples.', inStock: true },
    { id: 2, name: 'Organic Bananas', price: 60, originalPrice: 80, unit: '6 pcs', category: 1, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Ripe organic bananas.', inStock: true },
    { id: 3, name: 'Fresh Tomatoes', price: 45, originalPrice: 55, unit: '500 g', category: 1, image: 'https://images.unsplash.com/photo-1546470427-227c7b3f8314?w=300&h=300&fit=crop', rating: 4.2, deliveryTime: '12 min', description: 'Farm-fresh tomatoes.', inStock: true },
    { id: 4, name: 'Spinach Bundle', price: 30, originalPrice: 40, unit: '250 g', category: 1, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '10 min', description: 'Fresh green spinach.', inStock: true },
    { id: 5, name: 'Milk', price: 60, originalPrice: 70, unit: '1 L', category: 2, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', rating: 4.7, deliveryTime: '8 min', description: 'Fresh whole milk.', inStock: true },
    { id: 6, name: 'Farm Eggs', price: 90, originalPrice: 110, unit: '12 pcs', category: 2, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Farm-fresh eggs.', inStock: true },
    { id: 7, name: 'Greek Yogurt', price: 80, originalPrice: 100, unit: '400 g', category: 2, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '12 min', description: 'Creamy Greek yogurt.', inStock: true },
    { id: 8, name: 'Whole Wheat Bread', price: 45, originalPrice: 55, unit: '400 g', category: 3, image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Nutritious whole wheat bread.', inStock: true },
    { id: 9, name: 'Croissants', price: 120, originalPrice: 150, unit: '4 pcs', category: 3, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '15 min', description: 'Buttery croissants.', inStock: true },
    { id: 10, name: 'Orange Juice', price: 99, originalPrice: 120, unit: '1 L', category: 4, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '8 min', description: 'Freshly squeezed orange juice.', inStock: true },
    { id: 11, name: 'Sparkling Water', price: 35, originalPrice: 45, unit: '1 L', category: 4, image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=300&h=300&fit=crop', rating: 4.1, deliveryTime: '10 min', description: 'Refreshing sparkling water.', inStock: true },
    { id: 12, name: 'Potato Chips', price: 50, originalPrice: 65, unit: '150 g', category: 5, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', rating: 4.2, deliveryTime: '10 min', description: 'Crispy potato chips.', inStock: true },
    { id: 13, name: 'Mixed Nuts', price: 180, originalPrice: 220, unit: '200 g', category: 5, image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=300&h=300&fit=crop', rating: 4.7, deliveryTime: '12 min', description: 'Premium mixed nuts.', inStock: true },
    { id: 14, name: 'Chicken Breast', price: 250, originalPrice: 300, unit: '500 g', category: 6, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '15 min', description: 'Fresh boneless chicken.', inStock: true },
    { id: 15, name: 'Salmon Fillet', price: 450, originalPrice: 550, unit: '300 g', category: 6, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=300&h=300&fit=crop', rating: 4.8, deliveryTime: '18 min', description: 'Fresh Atlantic salmon.', inStock: true },
    { id: 16, name: 'Frozen Pizza', price: 199, originalPrice: 250, unit: '350 g', category: 7, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '12 min', description: 'Ready-to-bake pizza.', inStock: true },
    { id: 17, name: 'Ice Cream', price: 150, originalPrice: 180, unit: '500 mL', category: 7, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '10 min', description: 'Creamy vanilla ice cream.', inStock: true },
    { id: 18, name: 'Shampoo', price: 180, originalPrice: 220, unit: '200 mL', category: 8, image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '10 min', description: 'Nourishing shampoo.', inStock: true },
    { id: 19, name: 'Toothpaste', price: 120, originalPrice: 150, unit: '100 g', category: 8, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Whitening toothpaste.', inStock: true },
    { id: 20, name: 'Hand Cream', price: 150, originalPrice: 180, unit: '100 mL', category: 8, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Moisturizing hand cream.', inStock: true },
  ];
  res.json({ products, count: products.length });
});

app.get('/api/products/categories', (req, res) => {
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop' },
    { id: 2, name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop' },
    { id: 3, name: 'Bread & Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
    { id: 4, name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=200&fit=crop' },
    { id: 5, name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop' },
    { id: 6, name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop' },
    { id: 7, name: 'Frozen Foods', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop' },
    { id: 8, name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
  ];
  res.json({ categories });
});

// Orders routes
app.get('/api/orders', (req, res) => {
  res.json({ orders: demoOrders });
});

app.post('/api/orders', (req, res) => {
  const { items, deliveryAddress, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }
  const order = {
    _id: Date.now().toString(),
    items,
    subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    deliveryFee: 20,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 20,
    deliveryAddress,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'confirmed',
    createdAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 15 * 60000)
  };
  demoOrders.push(order);
  res.status(201).json({ message: 'Order placed successfully', order });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  dbConnected = await connectDB();
  if (!dbConnected) {
    console.log('Running in DEMO MODE (no MongoDB)');
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
