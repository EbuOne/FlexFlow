/*
  # Add INSERT policies for user tables
  
  1. Changes
    - Add INSERT policies for user_profiles table
    - Add INSERT policies for user_preferences table
    - Add INSERT policies for user_security_settings table
  
  2. Security
    - Only authenticated users can insert their own data
    - User ID must match the authenticated user's ID
*/

-- Add INSERT policy for user_profiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile"
            ON user_profiles
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Add INSERT policy for user_preferences
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_preferences' 
        AND policyname = 'Users can insert own preferences'
    ) THEN
        CREATE POLICY "Users can insert own preferences"
            ON user_preferences
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Add INSERT policy for user_security_settings
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_security_settings' 
        AND policyname = 'Users can insert own security settings'
    ) THEN
        CREATE POLICY "Users can insert own security settings"
            ON user_security_settings
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = id);
    END IF;
END $$;