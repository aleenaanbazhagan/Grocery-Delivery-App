const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const { category, search, sort, limit = 50 } = req.query;
    
    let query = { inStock: true };
    
    if (category) {
      query.category = parseInt(category);
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));
    
    res.json({ products, count: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const products = [
      { name: 'Fresh Apples', price: 120, originalPrice: 150, unit: '1 kg', category: 1, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Fresh, juicy red apples perfect for snacking or baking.' },
      { name: 'Organic Bananas', price: 60, originalPrice: 80, unit: '6 pcs', category: 1, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Ripe organic bananas, naturally grown without pesticides.' },
      { name: 'Fresh Tomatoes', price: 45, originalPrice: 55, unit: '500 g', category: 1, image: 'https://images.unsplash.com/photo-1546470427-227c7b3f8314?w=300&h=300&fit=crop', rating: 4.2, deliveryTime: '12 min', description: 'Farm-fresh tomatoes ideal for salads and cooking.' },
      { name: 'Spinach Bundle', price: 30, originalPrice: 40, unit: '250 g', category: 1, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '10 min', description: 'Fresh green spinach leaves rich in iron and vitamins.' },
      { name: 'Milk', price: 60, originalPrice: 70, unit: '1 L', category: 2, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop', rating: 4.7, deliveryTime: '8 min', description: 'Fresh whole milk from local dairy farms.' },
      { name: 'Farm Eggs', price: 90, originalPrice: 110, unit: '12 pcs', category: 2, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Farm-fresh eggs from free-range hens.' },
      { name: 'Greek Yogurt', price: 80, originalPrice: 100, unit: '400 g', category: 2, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '12 min', description: 'Creamy Greek yogurt high in protein.' },
      { name: 'Whole Wheat Bread', price: 45, originalPrice: 55, unit: '400 g', category: 3, image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Nutritious whole wheat bread baked fresh daily.' },
      { name: 'Croissants', price: 120, originalPrice: 150, unit: '4 pcs', category: 3, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '15 min', description: 'Buttery, flaky croissants baked to perfection.' },
      { name: 'Orange Juice', price: 99, originalPrice: 120, unit: '1 L', category: 4, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '8 min', description: 'Freshly squeezed orange juice, no added sugar.' },
      { name: 'Sparkling Water', price: 35, originalPrice: 45, unit: '1 L', category: 4, image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=300&h=300&fit=crop', rating: 4.1, deliveryTime: '10 min', description: 'Refreshing sparkling mineral water.' },
      { name: 'Potato Chips', price: 50, originalPrice: 65, unit: '150 g', category: 5, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop', rating: 4.2, deliveryTime: '10 min', description: 'Crispy, salted potato chips for snacking.' },
      { name: 'Mixed Nuts', price: 180, originalPrice: 220, unit: '200 g', category: 5, image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=300&h=300&fit=crop', rating: 4.7, deliveryTime: '12 min', description: 'Premium mix of almonds, cashews, and walnuts.' },
      { name: 'Chicken Breast', price: 250, originalPrice: 300, unit: '500 g', category: 6, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '15 min', description: 'Fresh boneless chicken breast, antibiotic-free.' },
      { name: 'Salmon Fillet', price: 450, originalPrice: 550, unit: '300 g', category: 6, image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=300&h=300&fit=crop', rating: 4.8, deliveryTime: '18 min', description: 'Fresh Atlantic salmon fillet, rich in Omega-3.' },
      { name: 'Frozen Pizza', price: 199, originalPrice: 250, unit: '350 g', category: 7, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '12 min', description: 'Ready-to-bake Margherita pizza with mozzarella.' },
      { name: 'Ice Cream', price: 150, originalPrice: 180, unit: '500 mL', category: 7, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=300&fit=crop', rating: 4.6, deliveryTime: '10 min', description: 'Creamy vanilla ice cream with real vanilla beans.' },
      { name: 'Shampoo', price: 180, originalPrice: 220, unit: '200 mL', category: 8, image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=300&h=300&fit=crop', rating: 4.4, deliveryTime: '10 min', description: 'Nourishing shampoo for all hair types.' },
      { name: 'Toothpaste', price: 120, originalPrice: 150, unit: '100 g', category: 8, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=300&fit=crop', rating: 4.5, deliveryTime: '10 min', description: 'Whitening toothpaste with mint flavor.' },
      { name: 'Hand Cream', price: 150, originalPrice: 180, unit: '100 mL', category: 8, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', rating: 4.3, deliveryTime: '10 min', description: 'Moisturizing hand cream with shea butter.' },
    ];
    
    await Product.deleteMany({});
    await Product.insertMany(products);
    
    res.json({ message: 'Products seeded successfully', count: products.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
