/*
  # Initial Schema Setup for Split-it App

  1. Tables
    - users
      - Basic user information and authentication
    - groups
      - Groups for shared expenses
    - group_members
      - Group membership and balances
    - expenses
      - Expense records
    - expense_splits
      - How expenses are split between users
    - settlements
      - Payment settlements between users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  balance decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount decimal NOT NULL,
  category text NOT NULL,
  date timestamptz NOT NULL,
  paid_by_id uuid REFERENCES users(id) ON DELETE CASCADE,
  split_type text NOT NULL,
  notes text,
  receipt_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expense_splits table
CREATE TABLE IF NOT EXISTS expense_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(expense_id, user_id)
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  from_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  to_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can read groups they are members of
CREATE POLICY "Users can read groups they belong to" ON groups
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id
      AND user_id = auth.uid()
    )
  );

-- Users can read group members for their groups
CREATE POLICY "Users can read group members" ON group_members
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

-- Users can read expenses in their groups
CREATE POLICY "Users can read expenses in their groups" ON expenses
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = expenses.group_id
      AND user_id = auth.uid()
    )
  );

-- Users can read expense splits in their groups
CREATE POLICY "Users can read expense splits" ON expense_splits
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      JOIN group_members gm ON e.group_id = gm.group_id
      WHERE e.id = expense_splits.expense_id
      AND gm.user_id = auth.uid()
    )
  );

-- Users can read settlements they are involved in
CREATE POLICY "Users can read settlements" ON settlements
  FOR SELECT TO authenticated
  USING (
    auth.uid() = from_user_id OR auth.uid() = to_user_id
  );

-- Insert dummy data
INSERT INTO users (id, email, name, avatar_url) VALUES
  ('d0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 'alex@example.com', 'Alex Johnson', 'https://randomuser.me/api/portraits/men/32.jpg'),
  ('e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 'sarah@example.com', 'Sarah Miller', 'https://randomuser.me/api/portraits/women/44.jpg'),
  ('f2f0e3b4-5d5g-6h7c-c0c2-1e1f2g3h4567', 'james@example.com', 'James Wilson', 'https://randomuser.me/api/portraits/men/46.jpg');

INSERT INTO groups (id, name, description, category, cover_image) VALUES
  ('a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'Apartment', 'Shared apartment expenses', 'Home', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'),
  ('b2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7', 'Summer Trip', 'Beach vacation expenses', 'Travel', 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg'),
  ('c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8', 'Friday Dinner', 'Weekly dinner expenses', 'Food & Drink', 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg');

-- Add members to groups
INSERT INTO group_members (group_id, user_id, balance) VALUES
  ('a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 150),
  ('a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', -80),
  ('a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'f2f0e3b4-5d5g-6h7c-c0c2-1e1f2g3h4567', -70),
  ('b2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', -200),
  ('b2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 200),
  ('c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 0),
  ('c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 45),
  ('c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8', 'f2f0e3b4-5d5g-6h7c-c0c2-1e1f2g3h4567', -45);

-- Add some expenses
INSERT INTO expenses (id, group_id, title, amount, category, date, paid_by_id, split_type, notes) VALUES
  ('d4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9', 'a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'Rent - April', 1500, 'RENT', '2023-04-01T10:00:00Z', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 'EQUAL', 'Monthly rent payment'),
  ('e5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0', 'a1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'Groceries', 120, 'FOOD', '2023-04-10T16:30:00Z', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 'EQUAL', 'Weekly groceries'),
  ('f6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1', 'b2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7', 'Hotel Room', 400, 'TRAVEL', '2023-06-01T14:00:00Z', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 'EQUAL', 'Two nights at Mountain View Hotel');

-- Add expense splits
INSERT INTO expense_splits (expense_id, user_id, amount, paid) VALUES
  ('d4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 500, true),
  ('d4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 500, true),
  ('d4d5e6f7-g8h9-i0j1-k2l3-m4n5o6p7q8r9', 'f2f0e3b4-5d5g-6h7c-c0c2-1e1f2g3h4567', 500, false),
  ('e5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 40, false),
  ('e5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 40, true),
  ('e5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0', 'f2f0e3b4-5d5g-6h7c-c0c2-1e1f2g3h4567', 40, false),
  ('f6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1', 'd0d8c19c-3b3e-4f5a-a8a0-9c9d0c2f1234', 200, false),
  ('f6f7g8h9-i0j1-k2l3-m4n5-o6p7q8r9s0t1', 'e1e9d2a3-4c4f-5g6b-b9b1-0d0e1f2g3456', 200, true);