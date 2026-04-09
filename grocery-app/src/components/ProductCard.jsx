import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const inCart = cart.find((item) => item.id === product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate('/payment');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="relative p-4">
        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {discount}% OFF
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 pt-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.unit}</p>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {product.deliveryTime}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
            <span className="text-sm text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1 ${
              inCart
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            {inCart ? `${inCart.quantity}` : 'Add'}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm bg-yellow-400 text-black hover:bg-yellow-500 transition-all flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-4 h-4" />
            Buy
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
