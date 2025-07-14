import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GoogleSuccess from './pages/redirects/GoogleSuccess';
import GoogleFailure from './pages/redirects/GoogleFailure';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/Home';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { useAuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcme';
import TransactionNew from './pages/TransactionNew';
import AdminDashboard from './pages/AdminDashboard';
import UserTransactions from './pages/UserTransactions';

function App() {
  const { state } = useAuthContext();
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path='/home' element={<HomePage />} />
        <Route path="/success" element={state?.user ? <GoogleSuccess /> : <Navigate to="/" />} />
        <Route path="/failed" element={!state?.user ? <GoogleFailure /> : <Navigate to="/" />} />
        <Route path="/login" element={!state?.user ? <SignInPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={state?.user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/transaction" element={state?.user ? <TransactionNew /> : <Navigate to="/login" />} />
        <Route path="/my-transactions" element={state?.user ? <UserTransactions /> : <Navigate to="/login" />} />
        <Route 
          path="/admin" 
          element={
            state?.user && state.user.role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/login" />
          } 
        />
      </Routes>
      <ToastContainer />
      <Footer />
    </Router>
  );
}

export default App;
