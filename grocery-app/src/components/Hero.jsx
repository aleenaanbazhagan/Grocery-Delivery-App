import { Zap, Truck, Shield, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 rounded-2xl overflow-hidden p-6 md:p-10 mb-8 shadow-medium">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
          <span className="text-sm font-bold text-orange-700">Express Delivery</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          Groceries in<br />
          <span className="text-orange-600">10 Minutes</span>
        </h1>
        
        <p className="text-gray-700 text-sm md:text-base max-w-md mb-6 leading-relaxed text-left">
          Fresh fruits, vegetables, dairy products and more delivered to your doorstep faster than ever!
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-medium text-gray-700 flex items-center gap-2">
            <Truck className="w-4 h-4 text-green-600" />
            <span>Free Delivery</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-medium text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Quality Assured</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-medium text-gray-700 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>Top Rated</span>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-yellow-400/50 to-transparent" />
    </div>
  );
};

export default Hero;
