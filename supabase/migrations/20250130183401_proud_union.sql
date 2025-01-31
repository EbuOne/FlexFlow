-- Add recurring fields to user_transactions table
ALTER TABLE user_transactions
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS recurring_day integer;

-- Add check constraint for recurring_day
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_transactions_recurring_day_check'
  ) THEN
    ALTER TABLE user_transactions
    ADD CONSTRAINT user_transactions_recurring_day_check 
    CHECK (recurring_day >= 1 AND recurring_day <= 31);
  END IF;
END $$;

-- Update database types
COMMENT ON COLUMN user_transactions.is_recurring IS 'Whether the transaction repeats monthly';
COMMENT ON COLUMN user_transactions.recurring_day IS 'Day of month for recurring transactions (1-31)';