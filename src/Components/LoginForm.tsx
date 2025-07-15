import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [showpass, setShowpass] = useState(false);
  const [authdetails, setAuthdetails] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthdetails({
      ...authdetails,
      [e.target.name]: e.target.value
    });
  };

  const togglePassword = () => setShowpass(!showpass);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", authdetails.username);
    formData.append("password", authdetails.password);

    try {
      const response = await axios.post('http://localhost:8081/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: false // JWT doesn't need cookies unless you're setting them on the server
      });

      localStorage.setItem('access_token', response.data['access-token']);
      localStorage.setItem('refresh_token', response.data['refresh-token']);

      navigate('/homepage', { replace: true }); // Redirect to homepage
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <form className="border p-4 rounded shadow" style={{ minWidth: '300px' }} onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Login</h2>

        <div className="mb-3 position-relative">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={authdetails.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-3 position-relative">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type={showpass ? 'text' : 'password'}
            className="form-control pe-5"
            id="password"
            name="password"
            value={authdetails.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
          <span
            onClick={togglePassword}
            className="position-absolute"
            style={{
              top: '50%',
              right: '15px',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888'
            }}
          >
            <FontAwesomeIcon icon={showpass ? faEyeSlash : faEye} />
          </span>
        </div>
        <Link to='/signinform'>Sign In</Link>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
