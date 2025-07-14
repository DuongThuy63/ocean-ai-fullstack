
const SignInPage = () => {
  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    // const callbackUrl ="/api/oauth/google";
    const callbackUrl = "https://ocean-ai-fullstack.onrender.com/api/oauth/google";
    window.open(callbackUrl, "_self");
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo/Brand */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Ocean AI</h2>
          <p className="text-lg text-gray-400">Welcome back</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 border border-gray-800 py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              Sign in to your account
            </h3>
            <p className="text-gray-400">
              Continue your journey with AI-powered meeting insights
            </p>
          </div>

          {/* Features Preview */}
          <div className="mb-8 p-4 bg-violet-600/10 border border-violet-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-3 text-center">What you'll get:</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center">
                <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Real-time meeting transcripts</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>AI-powered summaries & insights</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Smart speaker identification</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Organized meeting history</span>
              </li>
            </ul>
          </div>

          {/* Sign in Button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-700 rounded-lg shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 font-medium"
            >
              <img 
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
                alt="Google Logo" 
                className="w-5 h-5 mr-3" 
              />
              Continue with Google
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 leading-relaxed">
              🔒 Secure authentication powered by Google. We respect your privacy and only access information necessary for Ocean AI to function properly.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            New to Ocean AI?{' '}
            <a href="/welcome" className="font-medium text-violet-400 hover:text-violet-300">
              Learn more about our features
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
