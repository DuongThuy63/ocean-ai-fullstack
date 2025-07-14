import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Sign In Failed
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-400 mb-8">
            We couldn't sign you in. This could be due to a network issue or cancelled authentication.
          </p>
          
          {/* Error Details */}
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">
                  Authentication failed
                </h3>
                <div className="mt-2 text-sm text-red-400">
                  <p>Redirecting to sign in page in 5 seconds...</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Manual Navigation */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-black transition-colors"
            >
              Go to Home
            </button>
          </div>
          
          {/* Help Text */}
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team or try refreshing the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleFailure;