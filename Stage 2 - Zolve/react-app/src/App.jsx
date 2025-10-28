import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import { isAuthenticated, logout } from './utils/auth';
import toast from 'react-hot-toast';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    toast.error('Your session has expired — please log in again.');
    return <Navigate to="/auth/login" />;
  }
  return children;
}

function Navbar() {
  const [auth, setAuth] = useState(isAuthenticated());
  const [menuOpen, setMenuOpen] = useState(false); // For hamburger
  const navigate = useNavigate(); // <--- added

  useEffect(() => {
    const checkAuth = () => setAuth(isAuthenticated());

    // storage fires only on other tabs; authchange fires in same tab
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authchange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authchange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuth(false);
    toast.success('Logged out successfully');
    setMenuOpen(false);
    navigate('/'); // <--- navigate back to landing immediately
  };

  return (
    <header style={{ background: '#1f2937', color: 'white', padding: '1rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h2>Zolve</h2></Link>
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          {auth ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/tickets" className="nav-link" onClick={() => setMenuOpen(false)}>Tickets</Link>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/auth/signup" className="nav-link" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
