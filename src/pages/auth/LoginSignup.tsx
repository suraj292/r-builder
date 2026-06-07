import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../../lib/api';

export default function LoginSignup() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/forgot-password', { email: forgotEmail });
      setForgotSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Password strength logic

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength++;
    if (pass.length > 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    return strength;
  };

  const signupStrength = getPasswordStrength(signupPassword);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('username', loginEmail);
      formData.append('password', loginPassword);

      const response = await api.post<{ access_token: string }>('/v1/auth/login', formData);
      setAuthToken(response.access_token);
      navigate('/builder');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setSignupLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/register', {
        email: signupEmail,
        password: signupPassword,
        full_name: signupName,
      });
      
      // Auto-login after signup
      const formData = new FormData();
      formData.append('username', signupEmail);
      formData.append('password', signupPassword);
      const loginResp = await api.post<{ access_token: string }>('/v1/auth/login', formData);
      setAuthToken(loginResp.access_token);
      
      navigate('/builder');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Email might already be in use.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Redirect to backend social login endpoint
    window.location.href = `/api/v1/auth/${provider}/login`;
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
            
            <h1 className="text-3xl font-display font-bold mb-4 leading-tight">Build Smarter Resumes with AI</h1>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">Create ATS-friendly resumes in minutes and land 3x more interviews with our intelligent optimization engine.</p>
            
            {/* Mini Testimonial */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-auto">
              <div className="flex text-yellow-400 text-xs mb-2">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-xs italic text-indigo-50 mb-2">"This tool completely transformed my job search. I got hired at my dream company within 2 weeks!"</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center text-[10px] font-bold">JD</div>
                <span className="text-xs font-bold">John D., Software Engineer</span>
              </div>
            </div>
          </div>

          {/* Footer Links (Desktop) */}
          <div className="relative z-10 mt-8 hidden md:flex gap-4 text-xs text-indigo-200">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        {/* RIGHT: Auth Forms */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          {isForgotPassword ? (
            <div className="max-w-xs mx-auto w-full animate-slide-up">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 animate-fade-in">Forgot Password</h2>
                <p className="text-sm text-slate-500">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              {forgotSuccess ? (
                <div className="space-y-6 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 text-2xl shadow-sm border border-green-100">
                    <i className="fa-solid fa-circle-check animate-bounce"></i>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl">
                    Password reset link sent! Please check your email inbox (and server logs).
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setForgotSuccess(false);
                      setForgotEmail('');
                      setError(null);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all cursor-pointer text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake">
                      <i className="fa-solid fa-circle-exclamation"></i>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="input-group relative animate-fade-in">
                    <i className="fa-regular fa-envelope input-icon"></i>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="form-input" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={forgotLoading}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <i className="fa-solid fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform"></i>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setForgotEmail('');
                        setError(null);
                      }}
                      className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-left-long mr-1"></i> Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full max-w-xs mx-auto">
                <button 
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }} 
                  id="tab-btn-login" 
                  className={`flex-1 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    activeTab === 'login' 
                      ? 'font-bold text-slate-800 bg-white shadow-sm' 
                      : 'font-medium text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Login
                </button>
                <button 
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null); }} 
                  id="tab-btn-signup" 
                  className={`flex-1 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    activeTab === 'signup' 
                      ? 'font-bold text-slate-800 bg-white shadow-sm' 
                      : 'font-medium text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-shake max-w-xs mx-auto w-full">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              {/* LOGIN FORM */}
              <div id="login-form" className={`tab-content ${activeTab === 'login' ? 'active' : ''} max-w-xs mx-auto w-full`}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                  <p className="text-sm text-slate-500">Enter your details to access your account</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="input-group">
                    <i className="fa-regular fa-envelope input-icon"></i>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="form-input" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="input-group">
                    <i className="fa-solid fa-lock input-icon"></i>
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      id="login-pass" 
                      placeholder="Password" 
                      className="form-input" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      <i className={`fa-regular ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError(null);
                      }}
                      className="text-indigo-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    id="login-btn" 
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loginLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SIGN UP FORM */}
              <div id="signup-form" className={`tab-content ${activeTab === 'signup' ? 'active' : ''} max-w-xs mx-auto w-full`}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                  <p className="text-sm text-slate-500">Get started with your free resume builder</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="input-group">
                    <i className="fa-regular fa-user input-icon"></i>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="form-input" 
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="input-group">
                    <i className="fa-regular fa-envelope input-icon"></i>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="form-input" 
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="input-group">
                    <i className="fa-solid fa-lock input-icon"></i>
                    <input 
                      type={showSignupPassword ? "text" : "password"} 
                      id="signup-pass" 
                      placeholder="Password" 
                      className="form-input" 
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowSignupPassword(!showSignupPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      <i className={`fa-regular ${showSignupPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  {/* Password Strength */}
                  <div className={`flex gap-1 h-1 mt-1 transition-opacity ${signupPassword.length > 0 ? 'opacity-100' : 'opacity-0'}`} id="strength-bar">
                    <div className={`flex-1 rounded-full transition-colors duration-300 ${signupStrength >= 1 ? (signupStrength === 1 ? 'bg-red-400' : signupStrength === 2 ? 'bg-yellow-400' : signupStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-1"></div>
                    <div className={`flex-1 rounded-full transition-colors duration-300 ${signupStrength >= 2 ? (signupStrength === 2 ? 'bg-yellow-400' : signupStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-2"></div>
                    <div className={`flex-1 rounded-full transition-colors duration-300 ${signupStrength >= 3 ? (signupStrength === 3 ? 'bg-blue-400' : 'bg-green-500') : 'bg-slate-200'}`} id="bar-3"></div>
                    <div className={`flex-1 rounded-full transition-colors duration-300 ${signupStrength >= 4 ? 'bg-green-500' : 'bg-slate-200'}`} id="bar-4"></div>
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 mt-2">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5" 
                    />
                    <span>I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> & <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a></span>
                  </label>

                  <button 
                    type="submit" 
                    id="signup-btn" 
                    disabled={signupLoading}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {signupLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <i className="fa-solid fa-user-plus group-hover:scale-110 transition-transform"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Social Login */}
              <div className="max-w-xs mx-auto w-full mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <span className="relative bg-white px-3 text-xs text-slate-500 font-medium">Or continue with</span>
                </div>

                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => handleSocialLogin('google')}
                    className="social-btn w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <i className="fa-brands fa-google text-lg"></i>
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('linkedin')}
                    className="social-btn w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <i className="fa-brands fa-linkedin-in text-lg text-blue-700"></i>
                  </button>
                  <button 
                    onClick={() => handleSocialLogin('github')}
                    className="social-btn w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <i className="fa-brands fa-github text-lg"></i>
                  </button>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  <i className="fa-solid fa-lock text-green-500"></i> Secure SSL Encrypted
                </div>
              </div>
            </>
          )}

          {/* Footer Links (Mobile Only) */}
          <div className="md:hidden mt-8 text-center text-xs text-slate-400 flex justify-center gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help</a>
          </div>
        </div>
      </main>
    </>
  );
}
