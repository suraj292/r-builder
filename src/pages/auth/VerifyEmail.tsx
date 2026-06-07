import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      verifyToken(token);
    } else {
      setStatus('error');
      setMessage('No verification token found.');
    }
  }, [location]);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get<{ message: string }>(`/v1/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage(response.message || 'Your email has been verified successfully!');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to verify email. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Resume<span className="text-indigo-600">AI</span></span>
          </Link>
        </div>

        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 rounded-3xl sm:px-12 border border-slate-100 animate-slide-up">
          <div className="text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-900">Verifying Email</h2>
                <p className="mt-2 text-slate-500">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="animate-fade-in">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-6 border-4 border-green-100/50">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
                <p className="mt-3 text-slate-500 leading-relaxed">
                  Great news! Your account is now fully activated and ready to use.
                </p>
                <div className="mt-8">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all gap-2 group"
                  >
                    <span>Continue to Login</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="animate-fade-in">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-6 border-4 border-rose-100/50">
                  <XCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Verification Failed</h2>
                <p className="mt-3 text-slate-500 leading-relaxed">
                  {message}
                </p>
                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => navigate('/auth/login')}
                    className="w-full flex items-center justify-center px-6 py-3 border border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all"
                  >
                    Back to Login
                  </button>
                  <p className="text-xs text-slate-400">
                    If the link expired, you can request a new one from the login page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
            <i className="fa-solid fa-lock text-green-500"></i> Secure Verification System
          </p>
        </div>
      </div>
    </div>
  );
}
