-- Fix user_balances table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_balances_user_id_key'
  ) THEN
    ALTER TABLE user_balances
    ADD CONSTRAINT user_balances_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Create or replace function to ensure user balance exists
CREATE OR REPLACE FUNCTION ensure_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_balances (user_id, total_balance, last_earned, total_bonus)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auth users to ensure balance exists
DROP TRIGGER IF EXISTS create_user_balance ON auth.users;
CREATE TRIGGER create_user_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_balance();

-- Function to initialize user balance if not exists
CREATE OR REPLACE FUNCTION initialize_user_balance(p_user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO user_balances (user_id, total_balance, last_earned, total_bonus)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Initialize balances for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM initialize_user_balance(user_record.id);
  END LOOP;
END $$;