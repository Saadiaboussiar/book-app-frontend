import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SigninForm = () => {
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

    const userData = {
      username: authdetails.username,
      password: authdetails.password,
  };
    try {
      const response = await axios.post('http://localhost:8081/users', userData, {
        headers: { 'Content-Type': 'application/json', 
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        withCredentials: false // JWT doesn't need cookies unless you're setting them on the server
      });

      
      navigate('/login', { replace: true }); // Redirect to homepage
    } catch (error:any) {
      if (error.response?.status === 409) {
      alert("Username already exists!");
      } else {
        alert("Sign in failed!");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <form className="border p-4 rounded shadow" style={{ minWidth: '300px' }} onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">SignIn</h2>

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

        <button type="submit" className="btn btn-primary w-100">Signin</button>
      </form>
    </div>
  );
}

export default SigninForm