import React, { useState, useEffect } from "react";
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Redirect admin to admin panel
  useEffect(() => {
    if (state?.user?.role === 'admin') {
      navigate('/admin');
    }
  }, [state?.user, navigate]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state?.user?.role !== 'admin') {
      fetchPlans();
    }
  }, [state?.user]);

  const handlePurchase = async (planName, price) => {
    try {
      setPurchaseLoading(true);
      const response = await fetch('/api/plans/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ planName, price }),
      });

      if (response.ok) {
        alert('Plan purchased successfully!');
        // Redirect to my transactions page
        navigate('/my-transactions');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
      alert('Failed to purchase plan. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Don't render for admin (they get redirected)
  if (state?.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            💳 Flexible Pricing Plans
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            Choose the perfect plan
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              for your needs
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Ocean AI builds a sustainable revenue stream through flexible subscription packages designed to meet the needs of individuals, teams, and enterprises.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan, index) => (
                <div key={plan.name} className="relative group flex">
                  {/* Popular Badge for Pro plan */}
                  {plan.name === 'Pro' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex-1 p-8 bg-black rounded-2xl hover:shadow-xl transition-all duration-300 flex flex-col ${
                    plan.name === 'Pro' 
                      ? 'border-2 border-violet-500 hover:border-violet-400 hover:shadow-violet-500/20' 
                      : 'border border-gray-800 hover:border-violet-500/50 hover:shadow-violet-500/10'
                  }`}>
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                      plan.name === 'Pro' 
                        ? 'bg-violet-600/30 border border-violet-500/50 group-hover:bg-violet-600/40' 
                        : 'bg-violet-600/20 border border-violet-500/30 group-hover:bg-violet-600/30'
                    }`}>
                      <span className="text-2xl">
                        {plan.name === 'Plus' && '⭐'}
                        {plan.name === 'Pro' && '🚀'}
                        {plan.name === 'Business' && '🏢'}
                      </span>
                    </div>
                    
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 mb-6">
                      {plan.name === 'Plus' && 'Ideal for individual users seeking essential services with flexibility and affordability.'}
                      {plan.name === 'Pro' && 'Best suited for professionals looking for advanced tools and enhanced capabilities.'}
                      {plan.name === 'Business' && 'Tailored for large organizations and enterprises seeking comprehensive solutions and premium support.'}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-white">{formatCurrency(plan.price)}</span>
                        <span className="text-gray-400 ml-1">/month</span>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-violet-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* CTA Button */}
                    <button 
                      onClick={() => handlePurchase(plan.name, plan.price)}
                      disabled={purchaseLoading}
                      className="w-full py-3 px-6 bg-violet-600 text-white hover:bg-violet-700 font-semibold rounded-lg transition-all duration-200 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {purchaseLoading ? 'Processing...' : `Choose ${plan.name}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-400 mb-12">
            Everything you need to know about Ocean AI pricing
          </p>
          
          <div className="text-left space-y-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Is there a free trial?</h3>
              <p className="text-gray-400">Yes, we offer a 14-day free trial for all plans. No credit card required to get started.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for enterprise customers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Transaction;
