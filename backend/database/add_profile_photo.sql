-- Migration: Add profile_photo column to customers and staff
ALTER TABLE customers ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255) DEFAULT NULL;
ALTER TABLE staff     ADD COLUMN IF NOT EXISTS profile_photo VARCHAR(255) DEFAULT NULL;
