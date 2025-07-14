import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../context/AuthContext';

const Transaction = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();

  useEffect(() => {
    // Redirect to appropriate page based on role
    if (state?.user) {
      if (state.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/my-transactions');
      }
    }
  }, [state?.user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default Transaction;
