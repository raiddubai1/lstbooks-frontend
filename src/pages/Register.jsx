import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // Default to student
    year: '',
    university: '',
    // Teacher-specific fields
    specialization: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiRegister(formData);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🦷</div>
          <h1 className="text-3xl font-extrabold text-orange-600 dark:text-orange-500 tracking-tight" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>lstBooks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'student'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🎓</div>
                <div className="font-semibold text-gray-900 dark:text-white">Student</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Access learning materials
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.role === 'teacher'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">👨‍🏫</div>
                <div className="font-semibold text-gray-900 dark:text-white">Teacher</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Create and manage content
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {/* Student-specific fields */}
          {formData.role === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  className="input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                  <option value="5">Year 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="University"
                />
              </div>
            </div>
          )}

          {/* Teacher-specific fields */}
          {formData.role === 'teacher' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University/Institution
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g., University of Dubai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  placeholder="e.g., Oral Pathology, Periodontology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  className="input"
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about yourself and your teaching experience"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : `Sign Up as ${formData.role === 'teacher' ? 'Teacher' : 'Student'}`}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

