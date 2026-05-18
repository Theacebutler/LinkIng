import { useState, type FormEvent } from 'react';
import register from '../utils/register';

export default function AddUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validate()) return;

    setIsSubmitting(false);
    // register & login user
    await register(username, password)
    setIsSubmitting(false);

    setUsername('');
    setPassword('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleChange = (
    field: 'username' | 'password',
    value: string
  ) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-slate-100 mb-4">Register / Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="e.g., jdoe"
            className={`px-3 py-2 border rounded text-base bg-slate-900 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.username ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-blue-400'}`}
          />
          {errors.username && (
            <span className="text-sm text-red-400">{errors.username}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="text" className="text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter a password"
            className={`px-3 py-2 border rounded text-base bg-slate-900 text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10 ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-blue-400'}`}
          />
          {errors.password && (
            <span className="text-sm text-red-400">{errors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium transition-colors hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {isSubmitting ? 'Saving...' : 'Save User'}
        </button>

        {success && (
          <p className="text-sm text-emerald-400 text-center py-2 bg-emerald-900/30 rounded">
            User saved successfully!
          </p>
        )}
      </form>
    </section>
  );
}
