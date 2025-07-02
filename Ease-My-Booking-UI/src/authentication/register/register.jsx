import React, { useState } from 'react';
import './register.css'; // can be empty or small overrides
import { useDispatch } from 'react-redux';
import { registerUserThunk } from '../../appState/appThunk/authThunk';
import { useNavigate } from 'react-router-dom';
 
export default function Register() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    dob: '',
    city: '',
    region: 'IN' // Default region
  });
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const payload = {
      UserName: formData.userName,
      Email: formData.email,
      Password: formData.password,
      DateOfBirth: new Date(formData.dob).toISOString(),
      City: formData.city,
      Region: formData.region
    };
 
    try {
      const resultAction = await dispatch(registerUserThunk(payload));
      if (registerUserThunk.fulfilled.match(resultAction)) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed: ' + (resultAction.payload || 'Unknown error'));
      }
    } catch (error) {
      console.error('Unexpected error during registration:', error);
    }
  };
 
  return (
<div className="login-page">
<div className="login-container">
<form className="login-form" onSubmit={handleSubmit}>
<h2 className="login-title">Create Account</h2>
 
          <div className="input-group">
<label htmlFor="userName">Username</label>
<input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
</div>
 
          <div className="input-group">
<label htmlFor="email">Email</label>
<input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
</div>
 
          <div className="input-group">
<label htmlFor="dob">Date of Birth</label>
<input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
</div>
 
          <div className="input-group">
<label htmlFor="password">Password</label>
<input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
</div>
 
          <div className="input-group">
<label htmlFor="city">City</label>
<input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
</div>
 
          {/* Hidden region input */}
<input
            type="hidden"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
 
          <button type="submit" className="login-button">Register</button>
</form>
</div>
</div>
  );
}