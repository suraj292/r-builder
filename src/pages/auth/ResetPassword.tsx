import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
    } else {
      setError('Invalid or expired password reset link.');
    }
  }, [location]);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength++;
    if (pass.length > 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('No verification token found. Please request a new link.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (passwordStrength < 2) {
      setError('Password is too weak. Please use a stronger password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/reset-password', {
        token,
        new_password: password
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link might have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Card */}
      <main className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-slide-up mx-auto">
        {/* LEFT: Branding Section */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-60 h-60 bg-indigo-500/30 rounded-full blur-2xl animate-float"></div>

          {/* Content */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-8 group w-max">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm border border-white/20 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <span className="font-bold text-lg tracking-tight">Resume<span className="text-indigo-200">AI</span></span>
            </Link>
            
            <h1 className="text-3xl font-display font-bold mb-4 leading-tight">Secure Your Account</h1>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">Choose a strong password to protect your resume data and AI optimization features.</p>
            
            {/* Security Tip */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-auto">
              <div className="flex text-indigo-200 text-xs mb-2 items-center gap-1.5 font-bold">
                <i className="fa-solid fa-shield-halved text-indigo-300"></i> SECURITY ADVICE
              </div>
              <p className="text-xs text-indigo-50 leading-relaxed">
                Ensure your password is at least 8 characters long, contains a mix of uppercase letters, numbers, and symbols.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="relative z-10 mt-8 hidden md:flex gap-4 text-xs text-indigo-200">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        {/* RIGHT: Reset Form */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-xs mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
              <p className="text-sm text-slate-500">Create a secure new password for your account</p>
            </div>

            {success ? (
              <div className="space-y-6 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-2xl shadow-sm border border-green-100">
                  <i className="fa-solid fa-circle-check animate-bounce"></i>
                </div>
                <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl font-medium">
                  Your password has been reset successfully!
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all cursor-pointer text-sm"
                >
                  Proceed to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                    <i className="fa-solid fa-circle-exclamation flex-shrink-0"></i>
                    <span>{error}</span>
                  </div>
                )}

                <div className="input-group relative">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="New Password" 
                    className="form-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={!token}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                <div className="input-group relative">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Confirm New Password" 
                    className="form-input" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    disabled={!token}
                  />
                </div>

                {/* Password Strength */}
                <div className={`flex gap-1 h-1 mt-1 transition-opacity ${password.length > 0 ? 'opacity-100' : 'opacity-0'}`} id="strength-bar">
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 1 ? (passwordStrength === 1 ? 'bg-red-400' : passwordStrength === 2 ? 'bg-yellow-400' : passwordStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-1"></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 2 ? (passwordStrength === 2 ? 'bg-yellow-400' : passwordStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-2"></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 3 ? (passwordStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-3"></div>
                  <div className={`flex-1 rounded-full transition-colors duration-300 ${passwordStrength >= 4 ? 'bg-green-500' : 'bg-slate-200'}`} id="bar-4"></div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !token}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <i className="fa-solid fa-key group-hover:scale-110 transition-transform"></i>
                    </>
                  )}
                </button>

                <div className="text-center mt-4">
                  <Link
                    to="/auth/login"
                    className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
