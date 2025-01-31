import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  CreditCard, 
  Mail, 
  Phone, 
  Shield, 
  Eye, 
  EyeOff,
  ChevronRight,
  Check,
  Moon,
  Sun,
  Volume2,
  BellOff,
  Smartphone,
  Mail as MailIcon,
  Wallet,
  Plus,
  Trash2,
  Loader2,
  Receipt,
  Edit,
  X,
  Circle
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useCategories } from '../hooks/useCategories';
import * as Icons from 'lucide-react';

type SettingsSection = 'profile' | 'notifications' | 'security' | 'appearance' | 'language' | 'payment' | 'categories';

export default function Settings() {
  const {
    profile,
    preferences,
    securitySettings,
    paymentMethods,
    loading: settingsLoading,
    error: settingsError,
    updateProfile,
    updatePreferences,
    updateSecuritySettings,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  } = useSettings();

  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formProfile, setFormProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [formPreferences, setFormPreferences] = useState({
    notifications_mobile: true,
    notifications_email: true,
    notifications_sound: true,
    notifications_payment: true,
    notifications_security: true,
    notifications_promotions: false,
    theme: 'light',
    font_size: 'medium',
    language: 'tr',
    date_format: 'DD/MM/YYYY',
    currency: 'TRY'
  });

  const menuItems = [
    { icon: User, label: 'Profil', value: 'profile' as const },
    { icon: Bell, label: 'Bildirimler', value: 'notifications' as const },
    { icon: Lock, label: 'Güvenlik', value: 'security' as const },
    { icon: Receipt, label: 'Kategoriler', value: 'categories' as const },
    { icon: Palette, label: 'Görünüm', value: 'appearance' as const },
    { icon: Globe, label: 'Dil', value: 'language' as const },
    { icon: CreditCard, label: 'Ödeme', value: 'payment' as const },
  ];

  useEffect(() => {
    if (profile) {
      setFormProfile({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email,
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setFormPreferences(preferences);
    }
  }, [preferences]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await updateProfile(formProfile);
      if (error) throw new Error(error);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Değişiklikler kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await updatePreferences(formPreferences);
      if (error) throw new Error(error);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Değişiklikler kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setSaveError('Mevcut şifrenizi girin');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSaveError('Şifreler eşleşmiyor');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setSaveError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updates: any = {
        two_factor_enabled: securitySettings?.two_factor_enabled || false
      };

      if (currentPassword && newPassword) {
        updates.currentPassword = currentPassword;
        updates.newPassword = newPassword;
      }

      const { error } = await updateSecuritySettings(updates);
      if (error) throw new Error(error);

      setSaveSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Değişiklikler kaydedilemedi');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSaveButton = () => (
    <button
      type="submit"
      disabled={isSaving}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
    </button>
  );

  const renderFeedback = () => (
    <>
      {saveError && (
        <div className="text-sm text-red-600 mt-2">{saveError}</div>
      )}
      {saveSuccess && (
        <div className="text-sm text-emerald-600 mt-2">Değişiklikler başarıyla kaydedildi</div>
      )}
    </>
  );

  const renderProfileSection = () => (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Profil Bilgileri</h2>
        
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profil"
              className="h-20 w-20 rounded-full"
            />
            <button type="button" className="mt-2 text-sm text-emerald-600 hover:text-emerald-700">
              Fotoğrafı değiştir
            </button>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad
              </label>
              <input
                type="text"
                value={formProfile.first_name}
                onChange={(e) => setFormProfile({ ...formProfile, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soyad
              </label>
              <input
                type="text"
                value={formProfile.last_name}
                onChange={(e) => setFormProfile({ ...formProfile, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formProfile.email}
                  onChange={(e) => setFormProfile({ ...formProfile, email: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon
              </label>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formProfile.phone}
                  onChange={(e) => setFormProfile({ ...formProfile, phone: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            İptal
          </button>
          {renderSaveButton()}
        </div>
        {renderFeedback()}
      </div>
    </form>
  );

  const renderNotificationsSection = () => (
    <form onSubmit={handleSavePreferences} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Bildirim Tercihleri</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium">Mobil Bildirimler</div>
                <div className="text-sm text-gray-500">Anlık bildirimler alın</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formPreferences.notifications_mobile}
                onChange={(e) => setFormPreferences({ ...formPreferences, notifications_mobile: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <MailIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium">E-posta Bildirimleri</div>
                <div className="text-sm text-gray-500">Günlük özet e-postaları alın</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formPreferences.notifications_email}
                onChange={(e) => setFormPreferences({ ...formPreferences, notifications_email: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Volume2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-medium">Ses Bildirimleri</div>
                <div className="text-sm text-gray-500">Uygulama içi ses bildirimleri</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formPreferences.notifications_sound}
                onChange={(e) => setFormPreferences({ ...formPreferences, notifications_sound: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            İptal
          </button>
          {renderSaveButton()}
        </div>
        {renderFeedback()}
      </div>
    </form>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Görünüm</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Tema</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormPreferences({ ...formPreferences, theme: 'light' })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  formPreferences.theme === 'light' ? 'border-emerald-500' : 'border-gray-200'
                }`}
              >
                <Sun className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Açık Tema</div>
                  <div className="text-sm text-gray-500">Beyaz arka plan</div>
                </div>
                {formPreferences.theme === 'light' && (
                  <Check className="h-5 w-5 text-emerald-500 ml-auto" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setFormPreferences({ ...formPreferences, theme: 'dark' })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  formPreferences.theme === 'dark' ? 'border-emerald-500' : 'border-gray-200'
                }`}
              >
                <Moon className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Koyu Tema</div>
                  <div className="text-sm text-gray-500">Siyah arka plan</div>
                </div>
                {formPreferences.theme === 'dark' && (
                  <Check className="h-5 w-5 text-emerald-500 ml-auto" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Yazı Boyutu</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Küçük</span>
                <input
                  type="radio"
                  name="fontSize"
                  value="small"
                  checked={formPreferences.font_size === 'small'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, font_size: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Orta</span>
                <input
                  type="radio"
                  name="fontSize"
                  value="medium"
                  checked={formPreferences.font_size === 'medium'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, font_size: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Büyük</span>
                <input
                  type="radio"
                  name="fontSize"
                  value="large"
                  checked={formPreferences.font_size === 'large'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, font_size: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            İptal
          </button>
          {renderSaveButton()}
        </div>
        {renderFeedback()}
      </div>
    </div>
  );

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Dil ve Bölge</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Uygulama Dili</h3>
            <select
              value={formPreferences.language}
              onChange={(e) => setFormPreferences({ ...formPreferences, language: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Tarih Formatı</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">DD/MM/YYYY</span>
                <input
                  type="radio"
                  name="dateFormat"
                  value="DD/MM/YYYY"
                  checked={formPreferences.date_format === 'DD/MM/YYYY'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, date_format: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">MM/DD/YYYY</span>
                <input
                  type="radio"
                  name="dateFormat"
                  value="MM/DD/YYYY"
                  checked={formPreferences.date_format === 'MM/DD/YYYY'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, date_format: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">YYYY/MM/DD</span>
                <input
                  type="radio"
                  name="dateFormat"
                  value="YYYY/MM/DD"
                  checked={formPreferences.date_format === 'YYYY/MM/DD'}
                  onChange={(e) => setFormPreferences({ ...formPreferences, date_format: e.target.value })}
                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Para Birimi</h3>
            <select
              value={formPreferences.currency}
              onChange={(e) => setFormPreferences({ ...formPreferences, currency: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            İptal
          </button>
          {renderSaveButton()}
        </div>
        {renderFeedback()}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Güvenlik</h2>
        
        <div className="space-y-6">
          <form onSubmit={handleSaveSecuritySettings} className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Şifre Değiştir</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Mevcut Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Yeni Şifre (Tekrar)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">İki Faktörlü Doğrulama</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">Google Authenticator</div>
                    <div className="text-sm text-gray-500">Hesabınızı daha güvenli hale getirin</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                >
                  <Check className="h-4 w-4" />
                  Aktif
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                İptal
              </button>
              {renderSaveButton()}
            </div>
            {renderFeedback()}
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Settings Menu */}
      <div className="col-span-1">
        <div className="bg-white rounded-xl border border-gray- gray-200 overflow-hidden">
          {menuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveSection(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                activeSection === item.value
                  ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              } ${menuItems[0].value !== item.value ? 'border-t border-gray-100' : ''}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              <ChevronRight className={`h-4 w-4 ml-auto ${
                activeSection === item.value ? 'text-emerald-600' : 'text-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="col-span-3">
        {settingsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : settingsError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {settingsError}
          </div>
        ) : (
          <>
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'security' && renderSecuritySection()}
            {activeSection === 'appearance' && renderAppearanceSection()}
            {activeSection === 'language' && renderLanguageSection()}
          </>
        )}
      </div>
    </div>
  );
}