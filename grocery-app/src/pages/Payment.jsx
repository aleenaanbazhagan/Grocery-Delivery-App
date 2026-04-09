import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, Check, Loader2, ArrowLeft, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    landmark: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryFee = cart.length > 0 ? 20 : 0;
  const total = cartTotal + deliveryFee;
  const savings = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, cart.length, orderPlaced]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    return address.name && address.phone && address.street && address.city && address.zipCode && address.phone.length === 10;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newOrderId = 'ORD' + Date.now().toString().slice(-8);
      
      const order = {
        _id: Date.now().toString(),
        orderId: newOrderId,
        items: cart,
        subtotal: cartTotal,
        deliveryFee,
        total,
        deliveryAddress: address,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
      setLoading(false);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Order Placed!</h1>
          <p className="text-gray-500 mb-2 text-center">Thank you for your order</p>
          <p className="text-lg font-semibold text-gray-700 mb-6 text-center">Order ID: {orderId}</p>
          
          <div className="bg-green-50 rounded-2xl p-4 mb-6">
            <p className="text-green-700 font-medium text-center">
              Your order will be delivered in 10-15 minutes
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="block w-full py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all"
            >
              View Order Details
            </Link>
            <Link
              to="/"
              className="block w-full py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">Checkout</h1>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
              step >= 1
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            1. Address
          </button>
          <button
            onClick={() => step === 2 && validateAddress() && setStep(2)}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
              step >= 2 && validateAddress()
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-gray-100 text-gray-500'
            } ${step === 1 && 'opacity-50 cursor-not-allowed'}`}
          >
            2. Payment
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black">1</span>
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="flex items-center gap-2 px-4 bg-gray-100 rounded-l-xl border border-r-0 border-gray-200">
                        <span className="text-lg">🇮🇳</span>
                        <span className="font-medium text-gray-700">+91</span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="House/Flat no., Building, Street"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      maxLength={6}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleAddressChange}
                      placeholder="Nearby landmark"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => validateAddress() && setStep(2)}
              disabled={!validateAddress()}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-lg"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black">1</span>
                Delivery Address
                <button
                  onClick={() => setStep(1)}
                  className="ml-auto text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Edit
                </button>
              </h2>
              <p className="text-gray-700 font-medium">{address.name}</p>
              <p className="text-gray-500 text-sm">{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
              <p className="text-gray-500 text-sm">Phone: +91 {address.phone}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  paymentMethod === 'cod' 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                  />
                  <Banknote className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                  {paymentMethod === 'cod' && <Check className="w-5 h-5 text-yellow-500" />}
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  paymentMethod === 'upi' 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                  />
                  <Smartphone className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">UPI Payment</p>
                    <p className="text-sm text-gray-500">Pay using GPay, PhonePe, Paytm</p>
                  </div>
                  {paymentMethod === 'upi' && <Check className="w-5 h-5 text-yellow-500" />}
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                  paymentMethod === 'card' 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                  />
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay using Visa, Mastercard, RuPay</p>
                  </div>
                  {paymentMethod === 'card' && <Check className="w-5 h-5 text-yellow-500" />}
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                {cart.slice(0, 4).map((item) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ))}
                {cart.length > 4 && (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500 flex-shrink-0">
                    +{cart.length - 4}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold text-lg rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Place Order • ₹{total.toFixed(2)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure payment - 100% protected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
