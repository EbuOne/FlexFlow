-- User Categories Table
CREATE TABLE IF NOT EXISTS user_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  icon text,
  color text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON user_categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON user_categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON user_categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON user_categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default categories
CREATE OR REPLACE FUNCTION create_default_categories(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Income Categories
  INSERT INTO user_categories (user_id, name, type, icon, color, is_default)
  VALUES
    (p_user_id, 'Maaş', 'income', 'Wallet', 'emerald', true),
    (p_user_id, 'Yatırım', 'income', 'TrendingUp', 'blue', true),
    (p_user_id, 'Freelance', 'income', 'Laptop', 'purple', true),
    (p_user_id, 'Hediye', 'income', 'Gift', 'pink', true);

  -- Expense Categories
  INSERT INTO user_categories (user_id, name, type, icon, color, is_default)
  VALUES
    (p_user_id, 'Market', 'expense', 'ShoppingCart', 'red', true),
    (p_user_id, 'Yemek', 'expense', 'UtensilsCrossed', 'orange', true),
    (p_user_id, 'Ulaşım', 'expense', 'Car', 'yellow', true),
    (p_user_id, 'Faturalar', 'expense', 'Receipt', 'indigo', true),
    (p_user_id, 'Eğlence', 'expense', 'Music', 'pink', true),
    (p_user_id, 'Sağlık', 'expense', 'Heart', 'red', true),
    (p_user_id, 'Eğitim', 'expense', 'GraduationCap', 'blue', true),
    (p_user_id, 'Alışveriş', 'expense', 'ShoppingBag', 'purple', true);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to add default categories for new users
CREATE OR REPLACE FUNCTION add_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION add_default_categories();

-- Add default categories for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM create_default_categories(user_record.id);
  END LOOP;
END $$;