import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Receipt, 
  CreditCard, 
  History, 
  Bell, 
  Settings, 
  HelpCircle, 
  Search,
  Sun,
  ChevronDown,
  User,
  LogOut,
  UserCircle,
  CreditCard as CreditCardIcon,
  Shield,
  HelpCircle as HelpCircleIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';

export default function Layout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        if (!authLoading && !user) {
          setRedirecting(true);
          await navigate('/auth');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        if (mounted) {
          setRedirecting(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, authLoading, navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loading = authLoading || profileLoading || redirecting;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        <p className="text-gray-600">
          {redirecting ? 'Yönlendiriliyor...' : 'Yükleniyor...'}
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : 'Kullanıcı';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <LayoutDashboard className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="font-bold text-xl">FlexFlow</span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <nav className="space-y-1">
          <div className="text-sm font-medium text-gray-500 mb-4">MENÜ</div>
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/' 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Gösterge Paneli</span>
          </Link>
          
          <Link 
            to="/analytics" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/analytics'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LineChart className="h-5 w-5" />
            <span>Analitik</span>
            <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">2</span>
          </Link>

          <Link 
            to="/transactions" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/transactions'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Receipt className="h-5 w-5" />
            <span>İşlemler</span>
          </Link>

          <Link 
            to="/cards" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/cards'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Kartlar</span>
          </Link>

          <Link 
            to="/history" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/history'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <History className="h-5 w-5" />
            <span>Geçmiş</span>
            <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">8</span>
          </Link>

          <Link 
            to="/notifications" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/notifications'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="h-5 w-5" />
            <span>Bildirimler</span>
            <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">4</span>
          </Link>
        </nav>

        <div className="mt-8">
          <div className="text-sm font-medium text-gray-500 mb-4">ARAÇLAR</div>
          <Link 
            to="/settings" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/settings'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Ayarlar</span>
          </Link>

          <Link 
            to="/help" 
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
              location.pathname === '/help'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <HelpCircle className="h-5 w-5" />
            <span>Yardım Merkezi</span>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Pro'ya Yükselt! 🔥</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Daha iyi organizasyonla daha yüksek verimlilik</p>
          <button className="mt-3 bg-black text-white text-xs px-3 py-1 rounded-lg">Yükselt</button>
          <a href="#" className="text-xs text-gray-500 ml-3">Daha fazla bilgi</a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname === '/' && 'Gösterge Paneli'}
                {location.pathname === '/settings' && 'Ayarlar'}
                {location.pathname === '/analytics' && 'Analitik'}
                {location.pathname === '/transactions' && 'İşlemler'}
                {location.pathname === '/cards' && 'Kartlar'}
                {location.pathname === '/history' && 'Geçmiş'}
                {location.pathname === '/notifications' && 'Bildirimler'}
                {location.pathname === '/help' && 'Yardım Merkezi'}
              </h1>
              <p className="text-gray-500">
                {location.pathname === '/' && 'Finansal Performansınızı Takip Edin, Değerlendirin ve Geliştirin'}
                {location.pathname === '/settings' && 'Hesap ayarlarınızı ve tercihlerinizi yönetin'}
                {location.pathname === '/analytics' && 'Detaylı finansal analizler ve raporlar'}
                {location.pathname === '/transactions' && 'Tüm finansal işlemlerinizi yönetin'}
                {location.pathname === '/cards' && 'Kredi ve banka kartlarınızı yönetin'}
                {location.pathname === '/history' && 'Tüm finansal işlemlerinizi görüntüleyin'}
                {location.pathname === '/notifications' && 'Önemli güncellemeler ve bildirimler'}
                {location.pathname === '/help' && 'Sık sorulan sorular ve destek'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Sun className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  <div className="bg-gray-100 p-1 rounded-full">
                    <UserCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{fullName}</div>
                    <div className="text-sm text-gray-500">{profile?.email}</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium">{fullName}</div>
                      <div className="text-sm text-gray-500">{profile?.email}</div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profil Bilgileri</span>
                      </Link>
                      <Link
                        to="/cards"
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <CreditCardIcon className="h-4 w-4" />
                        <span>Ödeme Yöntemleri</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Güvenlik Ayarları</span>
                      </Link>
                      <Link
                        to="/help"
                        className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <HelpCircleIcon className="h-4 w-4" />
                        <span>Yardım ve Destek</span>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-2">
                      <button 
                        onClick={signOut}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-gray-50 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}