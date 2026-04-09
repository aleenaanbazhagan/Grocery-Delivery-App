import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Hero from '../components/Hero';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, X } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { searchQuery } = useCart();

  const categoryFilter = searchParams.get('category');
  const sortBy = searchParams.get('sort') || 'default';

  const filteredProducts = products
    .filter((product) => {
      if (categoryFilter && product.category !== parseInt(categoryFilter)) {
        return false;
      }
      if (searchQuery) {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const selectedCategory = categories.find((c) => c.id === parseInt(categoryFilter));

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Hero />

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 text-left">Shop by Category</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 text-left">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? selectedCategory.name : 'All Products'}
              </h2>
              <p className="text-sm text-gray-500 mt-1 text-left">
                {filteredProducts.length} products
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3">
              {(categoryFilter || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
              
              <select
                value={sortBy}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value === 'default') {
                    params.delete('sort');
                  } else {
                    params.set('sort', e.target.value);
                  }
                  setSearchParams(params);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
