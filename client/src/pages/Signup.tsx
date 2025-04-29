import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../utils/auth';
import '../styles/signup.css';

interface SignupFormState {
  username: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const [form, setForm] = useState<SignupFormState>({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');

      AuthService.login(data.token);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>Create Your Account</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="signup-input"
            value={form.username}
            onChange={handleChange}
            placeholder="johndoe"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="signup-input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="signup-input"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading} className="signup-button">
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="signup-footer">
        Already have an account?{' '}
        <a href="/login" className="signup-link">Log in</a>
      </p>
    </div>
  );
};

export default SignupPage;
