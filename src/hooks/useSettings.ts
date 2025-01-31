import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['user_profiles']['Row'];
type Preferences = Database['public']['Tables']['user_preferences']['Row'];
type SecuritySettings = Database['public']['Tables']['user_security_settings']['Row'];
type PaymentMethod = Database['public']['Tables']['user_payment_methods']['Row'];

export function useSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      try {
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('Kullanıcı girişi yapılmamış');
        }

        const [
          { data: profileData, error: profileError },
          { data: preferencesData, error: preferencesError },
          { data: securityData, error: securityError },
          { data: paymentData, error: paymentError }
        ] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('user_preferences')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('user_security_settings')
            .select('*')
            .eq('id', user.id)
            .single(),
          supabase
            .from('user_payment_methods')
            .select('*')
            .eq('user_id', user.id)
        ]);

        if (profileError || preferencesError || securityError || paymentError) {
          throw new Error('Kullanıcı verileri yüklenemedi');
        }

        if (mounted) {
          setProfile(profileData);
          setPreferences(preferencesData);
          setSecuritySettings(securityData);
          setPaymentMethods(paymentData || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData();
      } else {
        setProfile(null);
        setPreferences(null);
        setSecuritySettings(null);
        setPaymentMethods([]);
      }
    });

    // İlk yükleme
    loadUserData();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function updateProfile(updates: Partial<Profile>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function updatePreferences(updates: Partial<Preferences>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function updateSecuritySettings(updates: Partial<SecuritySettings> & { currentPassword?: string; newPassword?: string }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      // Şifre değişikliği varsa
      if (updates.currentPassword && updates.newPassword) {
        // Önce mevcut şifre ile giriş yaparak doğrulama
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: updates.currentPassword
        });

        if (signInError) {
          throw new Error('Mevcut şifre hatalı');
        }

        // Şifreyi güncelle
        const { error: updatePasswordError } = await supabase.auth.updateUser({
          password: updates.newPassword
        });

        if (updatePasswordError) throw updatePasswordError;

        // Güvenlik ayarlarını güncelle
        const securityUpdates = {
          two_factor_enabled: updates.two_factor_enabled,
          last_password_change: new Date().toISOString()
        };

        const { data, error: updateSettingsError } = await supabase
          .from('user_security_settings')
          .update(securityUpdates)
          .eq('id', user.id)
          .select()
          .single();

        if (updateSettingsError) throw updateSettingsError;

        setSecuritySettings(data);
        return { data, error: null };
      }

      // Sadece diğer güvenlik ayarlarını güncelle
      const { data, error } = await supabase
        .from('user_security_settings')
        .update({
          two_factor_enabled: updates.two_factor_enabled
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setSecuritySettings(data);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function addPaymentMethod(paymentMethod: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      const { data, error } = await supabase
        .from('user_payment_methods')
        .insert({ ...paymentMethod, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setPaymentMethods(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function updatePaymentMethod(id: string, updates: Partial<PaymentMethod>) {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPaymentMethods(prev => prev.map(pm => pm.id === id ? data : pm));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function deletePaymentMethod(id: string) {
    try {
      const { error } = await supabase
        .from('user_payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  return {
    profile,
    preferences,
    securitySettings,
    paymentMethods,
    loading,
    error,
    updateProfile,
    updatePreferences,
    updateSecuritySettings,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  };
}