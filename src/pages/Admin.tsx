import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      // Redirect handled by useEffect
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(`Login failed: ${err.message}`);
      } else {
        setError('Login failed: Unable to connect to authentication server');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#Fafaf9] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-vansiii-white rounded-2xl p-8 shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-vansiii-black">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vansiii-accent"
                placeholder="Enter admin email"
                disabled={isLoading}
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vansiii-accent"
                placeholder="Enter admin password"
                disabled={isLoading}
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          {error && (
            <p className="text-vansiii-accent text-sm">{error}</p>
          )}
          <button
  type="submit"
  disabled={isLoading}
  className={`w-full flex items-center justify-center gap-2 bg-vansiii-accent text-vansiii-white px-6 py-3 rounded-lg transition-colors ${
    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:accent-bg'
  }`}
>
  {isLoading ? 'Logging In...' : 'Log In'}
</button>
        </form>
      </motion.div>
    </div>
  );
};

export default Admin;