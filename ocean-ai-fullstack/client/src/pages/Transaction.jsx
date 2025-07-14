import React, { useState, useEffect } from "react";
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
  const { state } = useAuthContext();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);

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

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/plans/my-plans', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (state?.user?.role !== 'admin') {
      fetchPlans();
      fetchTransactions();
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
        fetchTransactions(); // Refresh transactions
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

  const handleCancelPlan = async (transactionId) => {
    if (!confirm('Are you sure you want to cancel this plan? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelLoading(transactionId);
      const response = await fetch(`/api/plans/cancel/${transactionId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Plan cancelled successfully!');
        fetchTransactions(); // Refresh transactions
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error cancelling plan:', error);
      alert('Failed to cancel plan. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg">Select the perfect plan for your meeting needs</p>
        </div>
      </div>

      {/* Available Plans Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Available Plans</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div key={plan.name} className={`relative group ${index === 1 ? 'lg:scale-105 lg:z-10' : ''}`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className={`h-full p-8 bg-black rounded-2xl transition-all duration-300 flex flex-col ${
                    index === 1 
                      ? 'border-2 border-violet-500 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/20' 
                      : 'border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10'
                  }`} style={{ minHeight: '700px' }}>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                      index === 1 
                        ? 'bg-violet-600/30 border border-violet-500/50 group-hover:bg-violet-600/40' 
                        : 'bg-violet-600/20 border border-violet-500/30 group-hover:bg-violet-600/30'
                    }`}>
                      <span className="text-3xl">
                        {index === 0 ? '⭐' : index === 1 ? '🚀' : '🏢'}
                      </span>
                    </div>
                    
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                    
                    {/* Description */}
                    <div className="mb-8" style={{ minHeight: '72px' }}>
                      <p className="text-gray-400 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-white">{formatCurrency(plan.price)}</span>
                        <span className="text-gray-400 ml-2 text-lg">/month</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Billed monthly</p>
                    </div>
                    
                    {/* Features */}
                    <div className="flex-grow mb-8" style={{ minHeight: '200px' }}>
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-gray-300">
                            <svg className="w-5 h-5 text-violet-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mt-auto">
                      <button 
                        onClick={() => handlePurchase(plan.name, plan.price)}
                        disabled={purchaseLoading}
                        className={`w-full py-4 px-6 font-semibold rounded-lg transition-all duration-200 text-lg ${
                          index === 1
                            ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/25'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/25'
                        } ${purchaseLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                      >
                        {purchaseLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          'Purchase Plan'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Purchase History Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Purchase History</h2>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No purchases yet</h3>
              <p className="text-gray-500">Your plan purchases will appear here</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black border border-gray-800 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-violet-400 mb-2">
                    {transactions.length}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">Total Purchases</div>
                </div>
                <div className="bg-black border border-gray-800 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.price, 0))}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">Total Spent</div>
                </div>
                <div className="bg-black border border-gray-800 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {transactions.length > 0 ? transactions[0].planName : 'None'}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">Latest Plan</div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <div>Plan</div>
                    <div>Price</div>
                    <div>Purchase Date</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="divide-y divide-gray-800">
                  {transactions.map((transaction) => (
                    <div key={transaction._id} className="px-6 py-6 hover:bg-gray-900/50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        {/* Plan Name */}
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-violet-400">
                              {transaction.planName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white">{transaction.planName}</div>
                            <div className="text-xs text-gray-500">Monthly subscription</div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="font-bold text-violet-400">
                          {formatCurrency(transaction.price)}
                        </div>
                        
                        {/* Purchase Date */}
                        <div className="text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </div>
                        
                        {/* Status */}
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            Active
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleCancelPlan(transaction._id)}
                            disabled={cancelLoading === transaction._id}
                            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                          >
                            {cancelLoading === transaction._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Plan
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
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
              <h3 className="font-semibold text-white mb-2">Can I cancel my plan?</h3>
              <p className="text-gray-400">Yes, you can cancel your plan at any time from your purchase history. Once cancelled, you'll lose access to the plan features immediately.</p>
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
