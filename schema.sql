-- Dimasa AI: Community Translation & Validation Database Schema
-- Run this in your Supabase SQL Editor or PostgreSQL instance

CREATE TABLE IF NOT EXISTS community_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english TEXT NOT NULL,
    ai_draft TEXT,
    dimasa_correction TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Community Contributor',
    explanation TEXT,
    upvotes INT NOT NULL DEFAULT 1,
    downvotes INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' or 'verified' (when upvotes >= 3)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable public read and insert permissions for community crowdsourcing
ALTER TABLE community_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
ON community_feed FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public insert"
ON community_feed FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update for votes"
ON community_feed FOR UPDATE
TO anon, authenticated
USING (true);
