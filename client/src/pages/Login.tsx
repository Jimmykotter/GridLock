import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthService from '../utils/auth'
import '../styles/login.css'

interface LoginFormState {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [form,    setForm]    = useState<LoginFormState>({ email: '', password: '' })
  const [error,  setError]   = useState<string | null>(null)
  const [loading,setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { email, password } = form
    if (!email || !password) {
      setError('Both email and password are required.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      AuthService.login(data.token)
      navigate('/gameboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  const loggedIn = () => {
    navigate("/gameboard")
  }

  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            autoComplete="current-password"
          />
        </div>
        <button onClick={loggedIn} type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}

export default LoginPage
