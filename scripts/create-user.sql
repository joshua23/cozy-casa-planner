-- SQL script to create a user in Supabase Auth
-- Run this in your Supabase SQL Editor

-- Create the user account
-- Note: You'll need to use the Supabase Dashboard or Admin API to create auth users
-- This SQL script is for documentation purposes

-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to Authentication > Users
-- 4. Click "Invite user" or "Add user"
-- 5. Enter the following details:
--    Email: tongkai@qusvip.cn
--    Password: 12345678
--    Auto Confirm Email: Yes (check this box)

-- Alternative: Use the Supabase Management API
-- POST https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/admin/users
-- Headers:
--   apikey: [your-service-role-key]
--   Authorization: Bearer [your-service-role-key]
--   Content-Type: application/json
-- Body:
-- {
--   "email": "tongkai@qusvip.cn",
--   "password": "12345678",
--   "email_confirm": true,
--   "user_metadata": {
--     "full_name": "Tong Kai",
--     "username": "tongkai"
--   }
-- }

-- After creating the user via Dashboard or API, you can optionally set roles:
-- INSERT INTO user_roles (user_id, role_id)
-- SELECT
--   (SELECT id FROM auth.users WHERE email = 'tongkai@qusvip.cn'),
--   (SELECT id FROM roles WHERE name = 'admin')
-- WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'tongkai@qusvip.cn');