import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <main>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/order/:id" element={<OrderDetail />} />
                      </Routes>
                    </main>
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
