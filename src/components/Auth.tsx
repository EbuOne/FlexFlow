import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, User, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { signIn, signUp, resetPassword, user } = useAuth();

  useEffect(() => {
    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    if (user) {
      navigate('/');
    }

    const type = searchParams.get('type');
    if (type === 'recovery') {
      setIsForgotPassword(true);
      setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.');
    }
  }, [user, navigate, searchParams]);

  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    
    if (error.message?.includes('Invalid login credentials')) {
      return 'E-posta adresi veya şifre hatalı';
    }
    
    if (error.message?.includes('User already registered')) {
      return 'Bu e-posta adresi zaten kayıtlı';
    }
    
    if (error.message?.includes('Password should be at least 6 characters')) {
      return 'Şifre en az 6 karakter olmalıdır';
    }

    if (error.message?.includes('Email not confirmed')) {
      return 'E-posta adresiniz henüz doğrulanmamış';
    }

    return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  };

  const validateForm = () => {
    if (!email) {
      setError('E-posta adresi gerekli');
      return false;
    }

    if (!isForgotPassword && !password) {
      setError('Şifre gerekli');
      return false;
    }

    if (!isForgotPassword && password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setSuccess('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
      } else {
        console.log('Giriş denemesi:', { email, password });
        const { error } = await (isSignUp ? signUp(email, password) : signIn(email, password));
        if (error) throw error;
        
        // Başarılı giriş/kayıt sonrası ana sayfaya yönlendir
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Form gönderim hatası:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setIsForgotPassword(false);
    setError(null);
    setSuccess(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isForgotPassword 
              ? 'Şifrenizi mi unuttunuz?' 
              : isSignUp 
                ? 'Hesap Oluşturun' 
                : 'Giriş Yapın'
            }
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isForgotPassword 
              ? 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim' 
              : isSignUp 
                ? 'Hemen ücretsiz hesap oluşturun' 
                : 'Hesabınıza giriş yapın'
            }
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-4 text-sm text-emerald-600 bg-emerald-50 rounded-lg">
            <Key className="h-5 w-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="E-posta adresi"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                    placeholder="Şifre"
                  />
                </div>
              </div>
            )}
          </div>

          {!isForgotPassword && !isSignUp && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                Şifrenizi mi unuttunuz?
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isForgotPassword ? (
                    'Şifre Sıfırlama Bağlantısı Gönder'
                  ) : isSignUp ? (
                    'Hesap Oluştur'
                  ) : (
                    'Giriş Yap'
                  )}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {isForgotPassword ? (
            <div className="text-center">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Giriş sayfasına dön
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}