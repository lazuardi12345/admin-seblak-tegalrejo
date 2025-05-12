import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import logo from './seblak1.jpeg';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://testing.kopdesmerahputih.id/api/login', form);
      alert('Login berhasil!');
      localStorage.setItem('token', res.data.token);
      navigate('/'); 
    } catch (err) {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="app">
      <div className="login-container">
        <img src={logo} alt="Toko Logo" className="login-logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Selamat Datang Kembali 👋</h2>
          {error && <p className="error-text">{error}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
