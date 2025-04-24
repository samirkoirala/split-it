// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Group types
export interface Group {
  id: string;
  name: string;
  category?: string;
  description?: string;
  members: GroupMember[];
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  balance: number;
}

export interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
}

// Expense types
export enum SplitType {
  EQUAL = 'equal',
  PERCENTAGE = 'percentage',
  EXACT = 'exact',
  SHARES = 'shares',
}

export enum ExpenseCategory {
  FOOD = 'food',
  RENT = 'rent',
  UTILITIES = 'utilities',
  ENTERTAINMENT = 'entertainment',
  TRANSPORTATION = 'transportation',
  SHOPPING = 'shopping',
  TRAVEL = 'travel',
  HEALTH = 'health',
  OTHER = 'other',
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  paid: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  paidById: string;
  splitType: SplitType;
  splits: ExpenseSplit[];
  notes?: string;
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesState {
  expenses: Expense[];
  currentExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
}

// Settlement types
export interface Settlement {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
  notes?: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Activity types
export interface Activity {
  id: string;
  type: 'expense_created' | 'expense_updated' | 'settlement_created' | 'group_created' | 'member_added';
  groupId: string;
  userId: string;
  targetId?: string; // ID of the expense, settlement, etc.
  message: string;
  createdAt: string;
}