import { useEffect, useState } from 'react';
import MeetCard from '../components/MeetCard';
import { FaExclamationCircle, FaSpinner, FaCalendarTimes } from 'react-icons/fa';

const Dashboard = () => {
  const [meets, setMeets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [autoEnabled, setAutoEnabled] = useState(false); // State for auto-enabled toggle

  useEffect(() => {
    const fetchMeets = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset any previous errors

      try {
        const response = await fetch('/api/meet', {
          method: "GET",
          credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw (data);
        setMeets(data.meetings || []); // Assuming your API returns an array of meets
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    };

    const fetchAutoEnabled = async () => {
      try {
        const response = await fetch('/api/auto-enabled', {
          method: 'GET',
          credentials: 'include',
        });
        const { autoEnabled } = await response.json();
        setAutoEnabled(autoEnabled || false);
      } catch (error) {
        console.error("Error fetching auto-enabled status:", error);
      }
    };

    fetchMeets();
    fetchAutoEnabled();
  }, []);

  const handleToggleChange = async () => {
    setAutoEnabled(!autoEnabled);

    try {
      await fetch('/api/auto-enabled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ autoEnabled: !autoEnabled }),
      });
    } catch (error) {
      console.error("Error updating auto-enabled status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header Section */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Meeting Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage and analyze your meetings</p>
            </div>

            {/* Auto Report Toggle */}
            <div className="flex items-center gap-3 p-4 bg-violet-600/10 border border-violet-500/30 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  Auto Email Reports
                </span>
                <span className="text-xs text-gray-400">
                  Send reports after every meeting
                </span>
              </div>
              <button
                className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors ${autoEnabled ? 'bg-violet-600' : 'bg-gray-700'}`}
                onClick={handleToggleChange}
              >
                <span
                  className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${
                    autoEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
            <span className="text-lg font-medium text-gray-300">Loading your meetings...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mb-4">
              <FaExclamationCircle className="text-red-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-400 text-center max-w-md">{error}</p>
          </div>
        )}

        {/* No Meets Available State */}
        {!loading && !error && meets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center mb-4">
              <FaCalendarTimes className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No meetings yet</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Start a meeting with Ocean AI extension to see your first meeting report here.
            </p>
            <button className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
              Learn How to Get Started
            </button>
          </div>
        )}

        {/* Meet Cards Grid */}
        {!loading && !error && meets.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {meets.map(meet => (
              <MeetCard
                key={meet._id}
                meet={meet}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
    </div>
  );
};

export default Dashboard;
