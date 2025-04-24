import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useGroups } from './GroupsContext';
import { Expense, ExpenseCategory, ExpenseSplit, ExpensesState, SplitType } from '@/types';
import { supabase } from '@/lib/supabase';

interface ExpensesContextType extends ExpensesState {
  fetchExpenses: (groupId?: string) => Promise<void>;
  getExpenseById: (id: string) => Promise<Expense | undefined>;
  createExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Expense>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;
  getGroupExpenses: (groupId: string) => Promise<Expense[]>;
  calculateSplits: (
    amount: number, 
    splitType: SplitType, 
    userIds: string[], 
    customValues?: number[] | number,
    paidById?: string
  ) => ExpenseSplit[];
  settleBetweenUsers: (fromUserId: string, toUserId: string, amount: number, groupId: string) => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType>({
  expenses: [],
  currentExpense: null,
  isLoading: false,
  error: null,
  fetchExpenses: async () => {},
  getExpenseById: async () => undefined,
  createExpense: async () => ({} as Expense),
  updateExpense: async () => ({} as Expense),
  deleteExpense: async () => {},
  getGroupExpenses: async () => [],
  calculateSplits: () => [],
  settleBetweenUsers: async () => {},
});

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { updateMemberBalance } = useGroups();
  const [state, setState] = useState<ExpensesState>({
    expenses: [],
    currentExpense: null,
    isLoading: false,
    error: null,
  });

  // Fetch expenses from Supabase
  const fetchExpenses = async (groupId?: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      let query = supabase
        .from('expenses')
        .select(`
          *,
          paid_by:users!paid_by_id(name, avatar_url),
          splits:expense_splits(*)
        `)
        .order('date', { ascending: false });

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data: expenses, error } = await query;

      if (error) throw error;

      setState(prev => ({
        ...prev,
        expenses: expenses || [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch expenses',
      }));
    }
  };

  // Get expense by ID
  const getExpenseById = async (id: string) => {
    try {
      const { data: expense, error } = await supabase
        .from('expenses')
        .select(`
          *,
          paid_by:users!paid_by_id(name, avatar_url),
          splits:expense_splits(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return expense;
    } catch (error) {
      console.error('Error fetching expense:', error);
      return undefined;
    }
  };

  // Get group expenses
  const getGroupExpenses = async (groupId: string) => {
    try {
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select(`
          *,
          paid_by:users!paid_by_id(name, avatar_url),
          splits:expense_splits(*)
        `)
        .eq('group_id', groupId)
        .order('date', { ascending: false });

      if (error) throw error;
      return expenses || [];
    } catch (error) {
      console.error('Error fetching group expenses:', error);
      return [];
    }
  };

  // Calculate splits
  const calculateSplits = (
    amount: number,
    splitType: SplitType,
    userIds: string[],
    customValues?: number[] | number,
    paidById?: string
  ): ExpenseSplit[] => {
    const splits: ExpenseSplit[] = [];
    
    switch (splitType) {
      case SplitType.EQUAL:
        const equalAmount = parseFloat((amount / userIds.length).toFixed(2));
        let remainingAmount = amount - (equalAmount * userIds.length);
        
        userIds.forEach(userId => {
          let userAmount = equalAmount;
          if (remainingAmount > 0) {
            userAmount += parseFloat(remainingAmount.toFixed(2));
            remainingAmount = 0;
          }
          
          splits.push({
            userId,
            amount: userAmount,
            paid: userId === paidById,
          });
        });
        break;
        
      case SplitType.PERCENTAGE:
        if (!customValues || !Array.isArray(customValues)) {
          throw new Error('Percentage values are required for percentage split');
        }
        
        const totalPercentage = customValues.reduce((sum, percentage) => sum + percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          throw new Error('Percentages must add up to 100');
        }
        
        userIds.forEach((userId, index) => {
          const percentage = customValues[index];
          const userAmount = parseFloat(((percentage / 100) * amount).toFixed(2));
          
          splits.push({
            userId,
            amount: userAmount,
            paid: userId === paidById,
          });
        });
        break;
        
      case SplitType.EXACT:
        if (!customValues || !Array.isArray(customValues)) {
          throw new Error('Exact amounts are required for exact split');
        }
        
        const totalAmount = customValues.reduce((sum, amount) => sum + amount, 0);
        if (Math.abs(totalAmount - amount) > 0.01) {
          throw new Error('Exact amounts must add up to the total');
        }
        
        userIds.forEach((userId, index) => {
          splits.push({
            userId,
            amount: customValues[index],
            paid: userId === paidById,
          });
        });
        break;
        
      case SplitType.SHARES:
        if (!customValues || !Array.isArray(customValues)) {
          throw new Error('Share values are required for shares split');
        }
        
        const totalShares = customValues.reduce((sum, shares) => sum + shares, 0);
        const amountPerShare = amount / totalShares;
        
        userIds.forEach((userId, index) => {
          const shares = customValues[index];
          const userAmount = parseFloat((shares * amountPerShare).toFixed(2));
          
          splits.push({
            userId,
            amount: userAmount,
            paid: userId === paidById,
          });
        });
        break;
    }
    
    return splits;
  };

  // Create expense
  const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Insert expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          group_id: expenseData.groupId,
          title: expenseData.title,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
          paid_by_id: expenseData.paidById,
          split_type: expenseData.splitType,
          notes: expenseData.notes,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Insert splits
      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(
          expenseData.splits.map(split => ({
            expense_id: expense.id,
            user_id: split.userId,
            amount: split.amount,
            paid: split.paid,
          }))
        );

      if (splitsError) throw splitsError;

      // Update member balances
      await Promise.all(expenseData.splits.map(split => 
        updateMemberBalance(
          expenseData.groupId,
          split.userId,
          split.userId === expenseData.paidById ? expenseData.amount : -split.amount
        )
      ));

      // Fetch the created expense with all relations
      const createdExpense = await getExpenseById(expense.id);

      setState(prev => ({
        ...prev,
        expenses: [createdExpense, ...prev.expenses],
        isLoading: false,
      }));

      return createdExpense as Expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create expense',
      }));
      throw error;
    }
  };

  // Update expense
  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: expense, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update splits if provided
      if (updates.splits) {
        const { error: splitsError } = await supabase
          .from('expense_splits')
          .upsert(
            updates.splits.map(split => ({
              expense_id: id,
              user_id: split.userId,
              amount: split.amount,
              paid: split.paid,
            }))
          );

        if (splitsError) throw splitsError;
      }

      // Fetch updated expense with relations
      const updatedExpense = await getExpenseById(id);

      setState(prev => ({
        ...prev,
        expenses: prev.expenses.map(e => e.id === id ? updatedExpense : e),
        currentExpense: prev.currentExpense?.id === id ? updatedExpense : prev.currentExpense,
        isLoading: false,
      }));

      return updatedExpense as Expense;
    } catch (error) {
      console.error('Error updating expense:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update expense',
      }));
      throw error;
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const expense = await getExpenseById(id);
      if (!expense) throw new Error('Expense not found');

      // Delete expense (cascade will handle splits)
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Reverse balance changes
      await Promise.all(expense.splits.map(split => 
        updateMemberBalance(
          expense.groupId,
          split.userId,
          split.userId === expense.paidById ? -expense.amount : split.amount
        )
      ));

      setState(prev => ({
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id),
        currentExpense: prev.currentExpense?.id === id ? null : prev.currentExpense,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete expense',
      }));
      throw error;
    }
  };

  // Settle between users
  const settleBetweenUsers = async (fromUserId: string, toUserId: string, amount: number, groupId: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const settlement = {
        groupId,
        title: `Settlement payment`,
        amount,
        category: ExpenseCategory.OTHER,
        date: new Date().toISOString(),
        paidById: fromUserId,
        splitType: SplitType.EXACT,
        splits: [
          { userId: fromUserId, amount: 0, paid: true },
          { userId: toUserId, amount, paid: false }
        ],
        notes: `Settlement payment from ${fromUserId} to ${toUserId}`,
      };

      await createExpense(settlement);

    } catch (error) {
      console.error('Error creating settlement:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create settlement',
      }));
      throw error;
    }
  };

  // Load expenses on mount if authenticated
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return (
    <ExpensesContext.Provider
      value={{
        ...state,
        fetchExpenses,
        getExpenseById,
        createExpense,
        updateExpense,
        deleteExpense,
        getGroupExpenses,
        calculateSplits,
        settleBetweenUsers,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpensesContext);