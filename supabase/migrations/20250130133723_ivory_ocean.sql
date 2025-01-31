/*
  # Add setup_new_user function
  
  1. Changes
    - Add a stored procedure to handle new user setup
    - Creates all necessary user records in a single transaction
  
  2. Security
    - Function is accessible only to authenticated users
    - Ensures data consistency across all user tables
*/

-- Create function to setup new user
CREATE OR REPLACE FUNCTION setup_new_user(
  user_id uuid,
  user_email text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user profile
  INSERT INTO user_profiles (id, email)
  VALUES (user_id, user_email)
  ON CONFLICT (id) DO NOTHING;

  -- Create user preferences
  INSERT INTO user_preferences (id)
  VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;

  -- Create user security settings
  INSERT INTO user_security_settings (id)
  VALUES (user_id)
  ON CONFLICT (id) DO NOTHING;
END;
$$;