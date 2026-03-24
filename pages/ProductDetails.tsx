import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, CheckCircle, Shield, Zap, Download, BookOpen, ArrowRight } from 'lucide-react';
import { SHOP_PRODUCTS } from '../constants';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const product = SHOP_PRODUCTS.find(p => p.id === id);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h2 className="text-4xl font-black text-navy mb-6">Product Not Found</h2>
          <Link to="/shop" className="bg-navy text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-teal transition-all">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/shop" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 hover:text-navy mb-12 transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 mb-32">
          {/* Product Image */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent"></div>
              <div className="absolute bottom-12 left-12">
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl text-navy font-black text-sm uppercase tracking-widest shadow-xl">
                  {product.category}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-in fade-in slide-in-from-right duration-700 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-coral fill-coral" />
              ))}
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">5.0 (2,400+ Reviews)</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-navy mb-8 tracking-tighter leading-tight uppercase">
              {product.name}
            </h1>
            
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center space-x-6 mb-12">
              <div className="text-5xl font-black text-navy">${product.price}</div>
              <div className="px-4 py-2 bg-teal/10 text-teal rounded-xl text-[10px] font-black uppercase tracking-widest">
                In Stock & Ready
              </div>
            </div>

            <div className="space-y-6 mb-12">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-teal/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-teal" />
                  </div>
                  <span className="text-navy font-bold">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-6 rounded-full font-black text-xl uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center ${
                isAdding ? 'bg-teal text-navy' : 'bg-navy text-white hover:bg-teal hover:text-navy'
              }`}
            >
              {isAdding ? (
                <>
                  <CheckCircle className="mr-3 h-6 w-6" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-3 h-6 w-6" /> Add to Cart
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-teal" /> Secure Checkout
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-coral" /> Instant Access
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description / Social Proof */}
        <div className="bg-light rounded-[4rem] p-16 md:p-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-navy mb-12 tracking-tighter text-center uppercase">Why you need this strategy.</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-xl font-black text-navy uppercase tracking-tight">The Problem</h4>
                <p className="text-gray-500 leading-relaxed">
                  Most people accept the default settings of their birth country. They pay high taxes, live in stagnant economies, and never realize that better options exist just across a border.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-xl font-black text-navy uppercase tracking-tight">The Solution</h4>
                <p className="text-gray-500 leading-relaxed">
                  This {product.category.toLowerCase()} provides the exact blueprint used by thousands of builders to optimize their tax, mobility, and wealth creation strategies. It's the shortcut to a life of real options.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
