-- ============================================================
-- Sankalp Events — Supabase Database Setup
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/chexwvtcldqtiosgdaiz/sql
-- ============================================================

-- Create the registration table
CREATE TABLE IF NOT EXISTS registration (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username   TEXT NOT NULL UNIQUE,
  gmail      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,           -- bcrypt hashed, NEVER plain text
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast login lookups
CREATE INDEX IF NOT EXISTS idx_registration_username ON registration(username);
CREATE INDEX IF NOT EXISTS idx_registration_gmail    ON registration(gmail);

-- Row Level Security (RLS) — Restrict direct client access.
-- All access goes through the backend API which uses the service role key.
ALTER TABLE registration ENABLE ROW LEVEL SECURITY;

-- Allow the backend (anon key) to insert new users
CREATE POLICY "Allow insert for registration"
  ON registration FOR INSERT
  WITH CHECK (true);

-- Allow the backend to read users (for login check)
CREATE POLICY "Allow select for login"
  ON registration FOR SELECT
  USING (true);

-- ============================================================
-- IMPORTANT: The password column stores BCRYPT hashes only.
-- Plain text passwords are NEVER stored.
-- ============================================================
