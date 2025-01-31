/*
  # Gösterge Paneli Tabloları

  1. Yeni Tablolar
    - `user_balances`: Kullanıcı bakiyeleri
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_balance` (numeric)
      - `last_earned` (numeric)
      - `total_bonus` (numeric)
      - `updated_at` (timestamptz)
      
    - `user_incomes`: Kullanıcı gelirleri
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `amount` (numeric)
      - `category` (text)
      - `date` (timestamptz)
      - `description` (text)
      
    - `user_expenses`: Kullanıcı giderleri
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `amount` (numeric)
      - `category` (text)
      - `date` (timestamptz)
      - `description` (text)
      
    - `user_transactions`: İşlem geçmişi
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `amount` (numeric)
      - `type` (text)
      - `category` (text)
      - `payment_method` (text)
      - `status` (text)
      - `date` (timestamptz)

  2. Güvenlik
    - Tüm tablolarda RLS aktif
    - Her tablo için CRUD politikaları
*/

-- User Balances Table
CREATE TABLE IF NOT EXISTS user_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_balance numeric DEFAULT 0,
  last_earned numeric DEFAULT 0,
  total_bonus numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own balance"
  ON user_balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balance"
  ON user_balances FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balance"
  ON user_balances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Incomes Table
CREATE TABLE IF NOT EXISTS user_incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  date timestamptz DEFAULT now(),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_incomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own incomes"
  ON user_incomes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own incomes"
  ON user_incomes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incomes"
  ON user_incomes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own incomes"
  ON user_incomes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Expenses Table
CREATE TABLE IF NOT EXISTS user_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount numeric NOT NULL,
  category text NOT NULL,
  date timestamptz DEFAULT now(),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON user_expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON user_expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON user_expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON user_expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Transactions Table
CREATE TABLE IF NOT EXISTS user_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON user_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON user_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON user_transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON user_transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update Triggers
CREATE OR REPLACE FUNCTION update_user_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Income eklendiyse
  IF TG_OP = 'INSERT' AND NEW.type = 'income' THEN
    UPDATE user_balances
    SET total_balance = total_balance + NEW.amount,
        last_earned = NEW.amount,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  -- Income silindiyse
  ELSIF TG_OP = 'DELETE' AND OLD.type = 'income' THEN
    UPDATE user_balances
    SET total_balance = total_balance - OLD.amount,
        updated_at = now()
    WHERE user_id = OLD.user_id;
  -- Expense eklendiyse
  ELSIF TG_OP = 'INSERT' AND NEW.type = 'expense' THEN
    UPDATE user_balances
    SET total_balance = total_balance - NEW.amount,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  -- Expense silindiyse
  ELSIF TG_OP = 'DELETE' AND OLD.type = 'expense' THEN
    UPDATE user_balances
    SET total_balance = total_balance + OLD.amount,
        updated_at = now()
    WHERE user_id = OLD.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_after_transaction
  AFTER INSERT OR DELETE ON user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balances();

-- Create initial balance for new users
CREATE OR REPLACE FUNCTION create_initial_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_balances (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_initial_balance();