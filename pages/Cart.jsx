import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const deliveryFee = cart.length > 0 ? 20 : 0;
  const total = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Cart ({cart.length} items)</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Bill Summary</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-gray-900">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-700">
              You are saving ₹{cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0).toFixed(2)} on this order!
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Delivery Address</p>
              <p className="text-sm text-gray-500 mt-0.5">Mumbai, Maharashtra 400001</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Link
            to="/"
            className="flex-1 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/payment"
            className="flex-[2] py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl text-center transition-colors"
          >
            Checkout • ₹{total.toFixed(2)}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
