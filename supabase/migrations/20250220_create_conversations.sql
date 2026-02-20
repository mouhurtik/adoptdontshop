-- Create conversations table for messaging feature
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  pet_listing_id uuid references public.pet_listings(id) on delete set null,
  participant_ids uuid[] not null,
  last_message text default '',
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.conversations enable row level security;

-- Users can see conversations they're part of
create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = any(participant_ids));

-- Users can create conversations they're part of
create policy "Users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = any(participant_ids));

-- Users can update conversations they're part of (for last_message updates)
create policy "Users can update own conversations"
  on public.conversations for update
  using (auth.uid() = any(participant_ids));

-- Update messages RLS to scope by conversation participants
-- (already has RLS — just ensure sender can insert)
-- The existing messages table already has RLS, but let's make sure
-- the policies are correct for our conversation model.

-- Index for faster lookups
create index if not exists idx_conversations_participants on public.conversations using gin(participant_ids);
create index if not exists idx_conversations_last_message on public.conversations(last_message_at desc);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at);

-- Enable realtime for messages and conversations
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
