import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserTransactions = () => {
  const { state } = useAuthContext();
  const user = state?.user;
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);

  // Debug log
  useEffect(() => {
    console.log('UserTransactions - User state:', user);
    console.log('UserTransactions - User role:', user?.role);
  }, [user]);

  // Redirect admin to admin panel
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans/my-plans', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">My Plans & Transactions</h1>
          <p className="text-gray-400">Manage your subscriptions and view purchase history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Transaction History */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">My Active Plans</h2>
            <p className="text-sm text-gray-400">Manage your current subscriptions and purchase history</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-400">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                          </div>
                          <h3 className="text-lg font-medium text-white mb-2">No active plans</h3>
                          <p className="text-gray-400 mb-4">You don't have any active subscriptions</p>
                          <button
                            onClick={() => window.location.href = '/plans'}
                            className="inline-flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
                          >
                            Browse Plans
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Account Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-black/50 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-violet-400 mb-2">
                  {transactions.length}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Active Plans</p>
              </div>
              <div className="text-center p-6 bg-black/50 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-green-600/20 border border-green-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-green-400 mb-2">
                  {formatCurrency(transactions.reduce((total, t) => total + t.price, 0))}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Total Investment</p>
              </div>
              <div className="text-center p-6 bg-black/50 rounded-lg border border-gray-800">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-blue-400 mb-2">
                  {transactions[0]?.planName || 'None'}
                </p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Current Plan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTransactions;
