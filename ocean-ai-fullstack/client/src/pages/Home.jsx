import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import useWithGmeet from "../assets/works-with-gmeet.jpg";
import chromeWebStore from "../assets/Available Chrome Web Store.png";

function Home() {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            🚀 Available on Chrome Web Store
          </div>
          
          {/* Chrome Web Store Badge */}
          <div className="mb-8">
            <img src={chromeWebStore} alt="Available on Chrome Web Store" className="w-48 mx-auto opacity-90" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Meet your new
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              AI meeting companion
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate custom meeting recaps, reports, and transcripts using AI. Transform your meetings, interviews, and conversations into actionable insights.
          </p>
          
          {/* Google Meet Integration */}
          <div className="mb-8">
            <img src={useWithGmeet} alt="Works with Google Meet" className="w-64 mx-auto rounded-lg shadow-2xl border border-gray-800" />
            <p className="text-sm text-gray-400 mt-2">Other platforms coming soon...</p>
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")} 
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-violet-700"
            >
              {state?.user ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              Learn More
            </button>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-white mb-2">AI Reports</h3>
              <p className="text-sm text-gray-400">Generate comprehensive meeting reports with AI insights</p>
            </div>
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-white mb-2">Smart Tracking</h3>
              <p className="text-sm text-gray-400">Automatically track speakers and meeting dynamics</p>
            </div>
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold text-white mb-2">Email Reports</h3>
              <p className="text-sm text-gray-400">Send reports directly to participants via email</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
