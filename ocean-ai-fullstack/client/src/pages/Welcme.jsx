import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Import demo images
import DashboardImg from '../Imgdemoweb/Doashboard.png';
import FeatureImg from '../Imgdemoweb/Fearture.png';
import ReviewerImg from '../Imgdemoweb/Reviewer.png';
import TransactionImg from '../Imgdemoweb/Transaction.png';

function Welcome() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { state } = useAuthContext();

  // Demo images array
  const demoImages = [
    { src: DashboardImg, alt: "Ocean AI Dashboard" },
    { src: FeatureImg, alt: "Ocean AI Features" },
    { src: ReviewerImg, alt: "Ocean AI Reviews" },
    { src: TransactionImg, alt: "Ocean AI Pricing" }
  ];

  // Auto-cycle through images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % demoImages.length
      );
    }, 2500); // Change image every 4 seconds (slower)

    return () => clearInterval(interval);
  }, [demoImages.length]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8">
            🚀 Now Available as Chrome Extension
          </div>
          
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            AI-powered meeting
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              companion
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your meetings with Ocean AI. Generate comprehensive reports, track speakers, 
            and get AI-powered insights from every conversation.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")} 
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-violet-700"
            >
              {state?.user ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <button className="px-8 py-4 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200">
              Watch Demo
            </button>
          </div>
          
          {/* Product Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-800">
              <div className="relative h-96 bg-gradient-to-br from-gray-900 to-black">
                {/* Image Slideshow */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={demoImages[currentImageIndex].src}
                    alt={demoImages[currentImageIndex].alt}
                    className="max-w-full max-h-full object-contain rounded-lg transition-all duration-1000 ease-in-out transform"
                    style={{
                      opacity: 1,
                      transform: 'scale(1)',
                    }}
                  />
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {demoImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out ${
                        index === currentImageIndex 
                          ? 'bg-violet-500 scale-125' 
                          : 'bg-gray-500 hover:bg-gray-400 hover:scale-110'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentImageIndex((prevIndex) => 
                    prevIndex === 0 ? demoImages.length - 1 : prevIndex - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-3 rounded-full transition-all duration-300 ease-in-out hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentImageIndex((prevIndex) => 
                    (prevIndex + 1) % demoImages.length
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-3 rounded-full transition-all duration-300 ease-in-out hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need for
              <span className="text-violet-400"> better meetings</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ocean AI provides comprehensive meeting management with AI-powered insights
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Meeting Tracking</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically capture and organize your meetings with intelligent speaker detection and timeline tracking.
              </p>
              {hoveredFeature === 1 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>

            {/* Feature 2 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(2)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Reports</h3>
              <p className="text-gray-400 leading-relaxed">
                Generate comprehensive reports with sentiment analysis, speaker insights, and customizable formats.
              </p>
              {hoveredFeature === 2 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>

            {/* Feature 3 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(3)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Email Delivery</h3>
              <p className="text-gray-400 leading-relaxed">
                Send meeting reports directly to participants' emails in PDF or DOCX format automatically.
              </p>
              {hoveredFeature === 3 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>

            {/* Feature 4 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(4)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sentiment Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Understand the emotional tone of your meetings with advanced AI sentiment detection.
              </p>
              {hoveredFeature === 4 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>

            {/* Feature 5 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(5)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Chat Assistant</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask questions about your meetings and get instant AI-powered answers and insights.
              </p>
              {hoveredFeature === 5 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>

            {/* Feature 6 */}
            <div 
              className="group p-8 rounded-2xl border border-gray-800 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer bg-black/50 backdrop-blur-sm"
              onMouseEnter={() => setHoveredFeature(6)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/30 transition-colors">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Custom Reports</h3>
              <p className="text-gray-400 leading-relaxed">
                Choose from speaker-based, interval-based, or general report formats to suit your needs.
              </p>
              {hoveredFeature === 6 && (
                <div className="mt-4 text-violet-400 font-medium">
                  Learn more →
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by teams
              <span className="text-violet-400"> worldwide</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what professionals are saying about Ocean AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  W
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Wynand Viljoen</h4>
                  <p className="text-gray-400 text-sm">@wynand_viljoen</p>
                </div>
                <div className="ml-auto text-blue-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-blue-400">@OceanAI </span> AI meeting notes are absolutely insane. It actually summarizes what has been said and doesn't just transcribe.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Max Treml</h4>
                  <p className="text-gray-400 text-sm">@max_xam</p>
                </div>
                <div className="ml-auto text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Amazing tool - I am never late to any of my meetings! Plus, the AI note taking launch just received a lot of 🔥🔥🔥
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  Y
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Yeol K.</h4>
                  <p className="text-gray-400 text-sm">@Th3Y30l</p>
                </div>
                <div className="ml-auto text-blue-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                I've been a happy user of <span className="text-blue-400">@OceanAI </span> for a year now, but their latest AI note feature is just I'm blown away by how helpful and intuitive it
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  O
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Ovais Tariq</h4>
                  <p className="text-gray-400 text-sm">@ovaistariq</p>
                </div>
                <div className="ml-auto text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                My team and I have been a user of <span className="text-blue-400">@OceanAI </span> for over a year. We absolutely love the product. It helps us be more productive and timely with meetings.
              </p>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  N
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Nina Stepanov</h4>
                  <p className="text-gray-400 text-sm">@ninastepanov</p>
                </div>
                <div className="ml-auto text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Simple, yet powerful. If I didn't have it, I'd be genuinely sad and annoyed at all the excess clicking. The team is super responsive and the new features are always spot on.
              </p>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  H
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-semibold">Harry Bonay</h4>
                  <p className="text-gray-400 text-sm">@harry_bonay</p>
                </div>
                <div className="ml-auto text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Fantastic tool! Was already super useful and the addition of AI Notes just took it over the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-400">
              Get started with Ocean AI in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Install Extension</h3>
              <p className="text-gray-400">
                Add Ocean AI Chrome extension to your browser and connect with Google Meet
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Join Meetings</h3>
              <p className="text-gray-400">
                Ocean AI automatically captures and analyzes your meeting conversations
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Get Reports</h3>
              <p className="text-gray-400">
                Receive comprehensive AI-generated reports with insights and action items
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform your meetings?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who use Ocean AI to make their meetings more productive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => state?.user ? navigate("/dashboard") : navigate("/login")} 
              className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-all duration-200 shadow-lg"
            >
              {state?.user ? "Go to Dashboard" : "Start Free Trial"}
            </button>
            <button className="px-8 py-4 border border-violet-400 text-violet-400 font-semibold rounded-lg hover:bg-violet-600 hover:text-white transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Welcome;
