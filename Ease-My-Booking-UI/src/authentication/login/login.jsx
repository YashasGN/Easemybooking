import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../appState/appThunk/authThunk';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
 
  useEffect(() => {
    if (user.isLoggedIn) {
      const roles = Array.isArray(user.role) ? user.role : [];
      setUserRoles(roles);
      if (roles.length === 1 && roles[0] === 'User') {
        navigate('/');
      } else {
        setShowModal(true);
      }
    }
  }, [user, navigate]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ username, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        const roles = resultAction.payload.Role || [];
        setUserRoles(roles);
        toast.success('✅ Login successful!');
        // Check role before showing modal
        if (roles.length === 1 && roles[0] === 'User') {
          navigate('/');
        } else {
          setShowModal(true);
        }
      } else {
        toast.error(`❌ Login failed: ${resultAction.payload || 'Invalid credentials'}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('❌ Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleRedirect = (path) => {
    setShowModal(false);
    navigate(path);
  };
 
  const handleGoogleLogin = () => {
    toast.info('🔒 Google login not implemented.');
  };
 
  return (
<div className="login-page">
<ToastContainer position="top-right" autoClose={3000} />
 
      {isLoading && (
<div className="loading-overlay">
<div className="loading-spinner"></div>
<div className="loading-text">Logging in...</div>
</div>
      )}
 
      <div className="login-container">
<form className="login-form" onSubmit={handleSubmit}>
<h2 className="login-title">Welcome</h2>
 
          <div className="input-group">
<label htmlFor="username">Username</label>
<input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
</div>
 
          <div className="input-group">
<label htmlFor="password">Password</label>
<input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
</div>
 
          <button type="submit" className="login-button">Login</button>
 
          <p className="login-footer">
            Don't have an account? <a href="/register">Register</a>
</p>
 
          <div className="oauth-divider">or</div>
<button type="button" className="google-login-button" onClick={handleGoogleLogin}>
<img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="google-logo"
            />
            Login with Google
</button>
</form>
</div>
 
      {showModal && (
<div className="overlay">
<div className="popup-modal">
<h3>Select where to go</h3>
 
            <button onClick={() => handleRedirect('/')}>🏠 Home</button>
 
            {userRoles.includes('Admin') && (
<button onClick={() => handleRedirect('/admin/dashboard')}>
                🛠️ Admin Dashboard
</button>
            )}
 
            {userRoles.includes('Organiser') && (
<button onClick={() => handleRedirect('/organiser/dashboard')}>
                🧭 Organiser Dashboard
</button>
            )}
</div>
</div>
      )}
</div>
  );
}