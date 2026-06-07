import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { loginApi } from '../api/authApi'
import { loginSuccess } from '../features/auth/authSlice'

function getDashboardRoute(role) {
  switch (role) {
    case 'company_admin':           return '/admin/dashboard'
    case 'collection_center_admin': return '/center/dashboard'
    case 'farmer':                  return '/farmer/payments'
    default:                        return '/login'
  }
}

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [username,     setUsername]     = useState('')
  const [password,     setPassword]     = useState('')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await loginApi(username, password)
      dispatch(loginSuccess({ token: data.token }))
      const decoded = jwtDecode(data.token)
      navigate(getDashboardRoute(decoded.role))
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* ── LEFT PANEL ── 55% on lg, hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden"
        style={{
          backgroundImage: 'url(/logo-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} />

        {/* Content — flex column fills full height */}
        <div
          className="relative flex flex-col w-full"
          style={{ zIndex: 10, padding: '48px' }}
        >
          {/* TOP: Logo only */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Smart-Metrolac" style={{ height: '56px', width: 'auto' }} />
          </div>

          {/* MIDDLE: Tagline, vertically centred */}
          <div className="flex-1 flex items-center">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight max-w-md">
                Precision measurement for Sri Lanka's rubber industry
              </h1>
              <p className="text-base mt-4 max-w-sm" style={{ color: '#97C459' }}>
                Replacing 50 years of manual hydrometers with IoT-powered Dry Rubber Content analysis
              </p>
            </div>
          </div>

          {/* BOTTOM: Stats row */}
          <div className="flex gap-8">
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#97C459' }}>
                Accuracy
              </div>
              <div className="text-base font-bold text-white">±0.5% DRC</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#97C459' }}>
                Reading time
              </div>
              <div className="text-base font-bold text-white">Under 30s</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: '#97C459' }}>
                Connection
              </div>
              <div className="text-base font-bold text-white">Cloud-synced</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── 45% on lg, full width on mobile */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-white">
        <div className="w-full max-w-sm" style={{ padding: '48px 40px' }}>

          {/* Mobile-only logo */}
          <img
            src="/logo.png"
            alt="Smart-Metrolac"
            className="h-10 w-auto mx-auto mb-8 lg:hidden"
          />

          {/* Heading */}
          <h2
            className="font-serif"
            style={{
              fontSize: '2.5rem',
              fontWeight: 500,
              color: '#111827',
              marginBottom: '8px',
              lineHeight: 1.2,
            }}
          >
            Welcome back
          </h2>

          {/* Subtitle */}
          <p className="text-base text-gray-500" style={{ marginBottom: '32px' }}>
            Sign in to continue to your dashboard
          </p>

          <form onSubmit={handleSubmit}>

            {/* Username field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6B7280',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                fontFamily: 'Nunito, sans-serif',
              }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="F0001 or A0001"
                required
                onFocus={(e) => { e.target.style.borderBottomColor = '#42C23D' }}
                onBlur={(e)  => { e.target.style.borderBottomColor = '#E5E7EB' }}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 12px',
                  border: 'none',
                  borderBottom: '2px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#111827',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6B7280',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                fontFamily: 'Nunito, sans-serif',
              }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onFocus={(e) => { e.target.style.borderBottomColor = '#42C23D' }}
                  onBlur={(e)  => { e.target.style.borderBottomColor = '#E5E7EB' }}
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '0 40px 0 12px',
                    border: 'none',
                    borderBottom: '2px solid #E5E7EB',
                    fontSize: '15px',
                    color: '#111827',
                    background: 'transparent',
                    outline: 'none',
                    transition: 'border-color 0.15s',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '28px' }}>
              <a href="#" style={{ fontSize: '0.875rem', color: '#42C23D', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {/* Error message */}
            {error && (
              <div style={{ marginBottom: '16px', fontSize: '0.875rem', color: '#DC2626' }}>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#42C23D',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'Nunito, sans-serif',
                letterSpacing: '0.02em',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: '#9CA3AF' }}>
            Trouble signing in?{' '}
            <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>
              Contact your administrator
            </a>
          </p>

        </div>
      </div>

    </div>
  )
}

export default LoginPage
