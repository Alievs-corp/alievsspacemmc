import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A1E] flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="font-inter text-3xl font-bold text-white mb-2">
            Alievs Space
          </h1>
          <p className="font-inter text-[#C5C5C5]">
            Premium Digital & Commerce Ecosystems
          </p>
        </div>

        <div className="bg-[#13132F] border border-[#2A2A3A] rounded-xl p-6">
          <div className="text-center mb-6">
            <h2 className="font-inter text-2xl font-bold text-white">
              Sign in to your account
            </h2>
            <p className="mt-1 font-inter text-sm text-[#C5C5C5]">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-[#133FA6] hover:text-[#1a4cc0] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-inter text-sm text-red-400">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block font-inter text-sm font-medium text-[#C5C5C5] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 font-inter text-sm bg-[#0A0A1E] border border-[#2A2A3A] rounded-lg text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-inter text-sm font-medium text-[#C5C5C5] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-[#808087]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 font-inter text-sm bg-[#0A0A1E] border border-[#2A2A3A] rounded-lg text-white placeholder-[#808087] focus:outline-none focus:ring-1 focus:ring-[#133FA6] focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-[#133FA6] focus:ring-[#133FA6] border-[#2A2A3A] rounded bg-[#0A0A1E]"
                />
                <label htmlFor="remember-me" className="ml-2 block font-inter text-xs text-[#C5C5C5]">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-inter font-medium text-[#133FA6] hover:text-[#1a4cc0]">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 border border-transparent rounded-lg font-inter text-sm font-medium text-white bg-gradient-to-r from-[#133FA6] to-blue-700 hover:from-blue-700 hover:to-[#133FA6] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#133FA6] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center font-inter text-xs text-[#808087] hover:text-white"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to homepage
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="font-inter text-xs text-[#808087]">
            © {new Date().getFullYear()} Alievs Space MMC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}