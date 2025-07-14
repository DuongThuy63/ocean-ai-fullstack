import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import iconPng from '../assets/icon.png';
import { useEffect } from 'react';

function Navbar() {
  const { state, dispatch } = useAuthContext();
  
  // Debug để kiểm tra thông tin user
  useEffect(() => {
    console.log("Navbar - Current user state:", state.user);
  }, [state.user]);

  async function handleLogout() {
    await fetch("/api/oauth/logout");
    toast.success("Logged out!");
    dispatch({ type: "LOGOUT" });
  }

  return (
    <nav className="bg-black border-b border-gray-800 p-4 flex justify-between items-center">
      {/* Left side - Ocean AI logo */}
      <div>
        <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out font-bold px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2 text-2xl">
          <img src={iconPng} alt="Ocean AI" className="w-8 h-8" />
          <span>Ocean AI</span>
        </Link>
      </div>

      {/* Right side - Navigation links and user greeting */}
      <div className="flex items-center space-x-6">
        {state?.user ? (
          <>
           <Link to="/home" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
              Home
            </Link>
             <Link to="/dashboard" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
              Dashboard
            </Link>
            
            {/* Role-based navigation */}
            {state.user.role === 'admin' ? (
              <Link to="/admin" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
                👑 Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/transaction" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
                  Plans
                </Link>
                <Link to="/my-transactions" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
                  My Plans
                </Link>
              </>
            )}
            
            <span className="text-white text-lg font-medium">
              Hey, <strong>{state.user?.name || "Ocean User"}</strong>!
              {state.user.role === 'admin' && (
                <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded-full">ADMIN</span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/home" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
              Home
            </Link>
            <Link to="/login" className="text-gray-300 transition-all duration-300 ease-in-out font-medium px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-white">
              Login
            </Link>
            
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
