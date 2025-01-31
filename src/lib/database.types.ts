export interface Database {
  public: {
    Tables: {
      user_categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          icon: string | null;
          color: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          icon?: string | null;
          color?: string | null;
          is_default?: boolean;
        };
        Update: {
          name?: string;
          type?: 'income' | 'expense';
          icon?: string | null;
          color?: string | null;
          is_default?: boolean;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          notifications_mobile: boolean;
          notifications_email: boolean;
          notifications_sound: boolean;
          notifications_payment: boolean;
          notifications_security: boolean;
          notifications_promotions: boolean;
          theme: string;
          font_size: string;
          language: string;
          date_format: string;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          notifications_mobile?: boolean;
          notifications_email?: boolean;
          notifications_sound?: boolean;
          notifications_payment?: boolean;
          notifications_security?: boolean;
          notifications_promotions?: boolean;
          theme?: string;
          font_size?: string;
          language?: string;
          date_format?: string;
          currency?: string;
        };
        Update: {
          notifications_mobile?: boolean;
          notifications_email?: boolean;
          notifications_sound?: boolean;
          notifications_payment?: boolean;
          notifications_security?: boolean;
          notifications_promotions?: boolean;
          theme?: string;
          font_size?: string;
          language?: string;
          date_format?: string;
          currency?: string;
        };
      };
      user_security_settings: {
        Row: {
          id: string;
          two_factor_enabled: boolean;
          last_password_change: string | null;
          security_questions: Record<string, any> | null;
          login_history: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          two_factor_enabled?: boolean;
          last_password_change?: string | null;
          security_questions?: Record<string, any> | null;
          login_history?: Record<string, any> | null;
        };
        Update: {
          two_factor_enabled?: boolean;
          last_password_change?: string | null;
          security_questions?: Record<string, any> | null;
          login_history?: Record<string, any> | null;
        };
      };
      user_payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          provider: string;
          last_four: string | null;
          expiry_date: string | null;
          billing_address: Record<string, any> | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          provider: string;
          last_four?: string | null;
          expiry_date?: string | null;
          billing_address?: Record<string, any> | null;
          is_default?: boolean;
        };
        Update: {
          type?: string;
          provider?: string;
          last_four?: string | null;
          expiry_date?: string | null;
          billing_address?: Record<string, any> | null;
          is_default?: boolean;
        };
      };
      user_balances: {
        Row: {
          id: string;
          user_id: string;
          total_balance: number;
          last_earned: number;
          total_bonus: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          total_balance?: number;
          last_earned?: number;
          total_bonus?: number;
        };
        Update: {
          total_balance?: number;
          last_earned?: number;
          total_bonus?: number;
        };
      };
      user_transactions: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          payment_method: string;
          status: 'completed' | 'pending' | 'failed';
          date: string;
          is_recurring: boolean;
          recurring_day: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          amount: number;
          type: 'income' | 'expense';
          category: string;
          payment_method: string;
          status: 'completed' | 'pending' | 'failed';
          date?: string;
          is_recurring?: boolean;
          recurring_day?: number | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          amount?: number;
          type?: 'income' | 'expense';
          category?: string;
          payment_method?: string;
          status?: 'completed' | 'pending' | 'failed';
          date?: string;
          is_recurring?: boolean;
          recurring_day?: number | null;
        };
      };
    };
  };
}