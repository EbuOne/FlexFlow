/*
  # Settings Schema

  1. New Tables
    - `user_profiles`
      - User profile information including name, email, phone
    - `user_preferences`
      - User preferences for notifications, appearance, language
    - `user_payment_methods`
      - Payment methods and billing information
    - `user_security_settings`
      - Security settings like 2FA status
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text,
  last_name text,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  notifications_mobile boolean DEFAULT true,
  notifications_email boolean DEFAULT true,
  notifications_sound boolean DEFAULT true,
  notifications_payment boolean DEFAULT true,
  notifications_security boolean DEFAULT true,
  notifications_promotions boolean DEFAULT false,
  theme text DEFAULT 'light',
  font_size text DEFAULT 'medium',
  language text DEFAULT 'tr',
  date_format text DEFAULT 'DD/MM/YYYY',
  currency text DEFAULT 'TRY',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User Security Settings Table
CREATE TABLE IF NOT EXISTS user_security_settings (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  two_factor_enabled boolean DEFAULT false,
  last_password_change timestamptz,
  security_questions jsonb,
  login_history jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security settings"
  ON user_security_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own security settings"
  ON user_security_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User Payment Methods Table
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type text NOT NULL,
  provider text NOT NULL,
  last_four text,
  expiry_date text,
  billing_address jsonb,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment methods"
  ON user_payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON user_payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON user_payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON user_payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_payment_methods_updated_at
  BEFORE UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();