-- Add conversation_id column for grouping messages into conversations
ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id UUID;

-- Backfill existing messages: all current messages become one legacy conversation
DO $$
DECLARE
  legacy_id UUID := gen_random_uuid();
BEGIN
  UPDATE messages SET conversation_id = legacy_id WHERE conversation_id IS NULL;
END $$;

-- Add index for faster lookup by conversation_id
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
