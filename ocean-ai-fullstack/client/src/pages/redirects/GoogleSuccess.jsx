import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext'

function GoogleSuccess() {
  const navigate = useNavigate();
  const { state } = useAuthContext();

  useEffect(() => {
    if (!state?.user) {
      navigate('/login');
      return;
    }
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [state.user, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome to Ocean AI!
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-400 mb-8">
            Successfully signed in. Redirecting you to your dashboard...
          </p>
          
          {/* Loading Animation */}
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
          </div>
          
          {/* Manual Navigation */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black transition-colors"
            >
              Go to Dashboard Now
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleSuccess;