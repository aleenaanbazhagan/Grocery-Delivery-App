import { useParams, Link } from 'react-router-dom';
import { Star, Clock, ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const product = products.find((p) => p.id === parseInt(id));
  const inCart = cart.find((item) => item.id === product?.id);
  const category = categories.find((c) => c.id === product?.category);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/" className="text-yellow-500 hover:text-yellow-600 font-medium">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div className="relative">
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10">
                {discount}% OFF
              </div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover rounded-xl"
              />
            </div>

            <div>
              <Link
                to={`/?category=${category?.id}`}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full mb-3 hover:bg-gray-200 transition-colors"
              >
                {category?.name}
              </Link>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>{product.deliveryTime}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <span className="text-lg text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                <span className="ml-2 text-green-600 font-medium">Save ₹{product.originalPrice - product.price}</span>
              </div>

              <p className="text-sm text-gray-500 mb-6">Unit: {product.unit}</p>

              <button
                onClick={() => addToCart(product)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                  inCart
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {inCart ? `Added to Cart (${inCart.quantity})` : 'Add to Cart'}
              </button>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <span className="text-lg">⚡</span>
                  <span className="font-medium">Express delivery available in {product.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Product Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Brand</span>
              <span className="font-medium text-gray-900">Fresh Farms</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Weight</span>
              <span className="font-medium text-gray-900">{product.unit}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Storage</span>
              <span className="font-medium text-gray-900">Cool & Dry Place</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Shelf Life</span>
              <span className="font-medium text-gray-900">7-10 Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
              <p className="text-sm text-gray-500">{product.unit}</p>
            </div>
            <button
              onClick={() => addToCart(product)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                inCart
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {inCart ? `Added (${inCart.quantity})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
