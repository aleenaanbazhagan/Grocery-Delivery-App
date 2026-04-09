import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');

  const from = location.state?.from || '/';

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setFormData({ ...formData, email: phone + '@grocer.com' });
      setStep(2);
    } else {
      setError('Please enter a valid 10-digit phone number');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Try registering first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="p-4 text-left">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-2xl">G</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-left">Grocer</h1>
              <p className="text-sm text-gray-500">Express Delivery</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-left">
            {step === 1 ? 'Sign in' : 'Welcome back'}
          </h2>
          <p className="text-gray-500 mb-8 text-left">
            {step === 1 
              ? 'Enter your phone number to continue' 
              : 'Enter your password'
            }
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-4 bg-gray-100 rounded-l-2xl border border-r-0 border-gray-200">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-gray-700 font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-4 bg-white border border-gray-200 rounded-r-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg tracking-wider"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={phone.length !== 10}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all text-lg"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setFormData({ ...formData, email: '' });
                  setPhone('');
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Change phone number
              </button>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verifying</p>
                  <p className="font-medium text-gray-900">+91 {phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-4 pr-12 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.password}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          )}

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 hover:text-yellow-700 font-semibold">
              Create one
            </Link>
          </p>

          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-500 underline">Terms</a> and{' '}
            <a href="#" className="text-gray-500 underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
