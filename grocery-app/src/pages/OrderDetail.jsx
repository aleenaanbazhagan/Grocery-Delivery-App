import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, Package, Check } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o._id === id);
    setOrder(foundOrder);
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-orange-100 text-orange-700';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'preparing', label: 'Preparing' },
      { key: 'out_for_delivery', label: 'Out for Delivery' },
      { key: 'delivered', label: 'Delivered' },
    ];

    const statusOrder = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4 text-center">Order not found</p>
          <Link to="/orders" className="text-yellow-500 hover:text-yellow-600 font-medium">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.orderStatus);

  return (
    <div className="min-h-screen bg-surface pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 text-left">
                Order #{order.orderId || order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-500 text-left">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
              {getStatusText(order.orderStatus)}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center min-w-fit">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${step.current ? 'ring-2 ring-yellow-400' : ''}`}
                  >
                    {step.completed ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${
                    step.completed ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 ${
                    step.completed && statusSteps[index + 1]?.completed
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-500" />
            Delivery Address
          </h2>
          <p className="font-medium text-gray-900">{order.deliveryAddress?.name}</p>
          <p className="text-gray-600 text-sm">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.city},{' '}
            {order.deliveryAddress?.state} - {order.deliveryAddress?.zipCode}
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
            <Phone className="w-4 h-4" />
            +91 {order.deliveryAddress?.phone}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.unit}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Payment Information</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium capitalize ${
                order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
