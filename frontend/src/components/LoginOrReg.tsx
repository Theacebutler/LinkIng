import { useState, type FormEvent } from 'react';
import { register } from '../utils/userRequests';
import { useAuths } from '../hooks/useAuths';

const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10">
    <rect width="32" height="32" rx="9" fill="url(#auth-logo-gradient)" />
    <path
      d="M13.5 18.5l5-5m-2-2a3.5 3.5 0 0 1 5 5l-2 2a3.5 3.5 0 0 1-5-5m-4 4a3.5 3.5 0 0 1-5-5l2-2a3.5 3.5 0 0 1 5 5"
      stroke="#0b0b10"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="auth-logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c4b5fd" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

export default function LoginOrReg() {
  const { username, password, setUsername, setPassword, setIsLogin } = useAuths();
  const [errors, setErrors] = useState<{ username?: string; password?: string; global?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register(username, password);
      setUsername('');
      setPassword('');
      setIsLogin(true);
      window.location.reload();
    } catch (error: unknown) {
      if (error instanceof Error) setErrors({ global: error.message });
      setIsSubmitting(false);
      setIsLogin(false);
    }
  };

  const handleChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Logo />
          <h1 className="mt-4 text-2xl font-semibold text-text">Welcome to Linking</h1>
          <p className="mt-1 text-sm text-text-soft">
            Sign in or create an account to start saving resources
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-text-soft mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="e.g., jdoe"
                className={`input ${errors.username || errors.global ? 'input-error' : ''}`}
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-danger">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-text-soft mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="At least 8 characters"
                className={`input ${errors.password || errors.global ? 'input-error' : ''}`}
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-danger">{errors.password}</p>
              )}
            </div>

            {errors.global && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {errors.global}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Working…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
