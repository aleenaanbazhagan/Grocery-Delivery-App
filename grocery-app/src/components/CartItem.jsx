import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.unit}</p>
        <p className="font-bold text-lg text-gray-900 mt-1">₹{item.price}</p>
      </div>

      <div className="flex flex-col justify-between">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors self-end"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
