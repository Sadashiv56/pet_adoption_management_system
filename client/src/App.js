import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { logout, fetchCurrentUser } from './features/authSlice';
import Toasts from './components/Toasts';
import { addNotification } from './features/notificationSlice';

const App = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // show auth messages as toasts
  useEffect(()=>{
    if (auth.error) dispatch(addNotification(auth.error, 'error'));
    if (auth.successMessage) dispatch(addNotification(auth.successMessage, 'success'));
  }, [auth.error, auth.successMessage]);

  // if we have a token (from localStorage) but no user loaded, fetch current user
  useEffect(()=>{
    if (auth.token && !auth.user) dispatch(fetchCurrentUser());
  }, [auth.token]);

  return (
    <div>
      <Toasts />
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">PetAdopt</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              {!auth.token && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                </>
              )}
              {auth.token && (
                <>
                  {/* hide Dashboard and brand link for admin users */}
                  {auth.user?.role !== 'admin' && <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>}
                  {auth.user?.role === 'admin' && <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>}
                  <li className="nav-item"><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><Admin/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
