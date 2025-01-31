import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['user_transactions']['Row'];
type Balance = Database['public']['Tables']['user_balances']['Row'];

interface TransactionsData {
  transactions: Transaction[];
  totalExpense: number;
  totalIncome: number;
  balance: Balance | null;
}

const DEFAULT_DATA: TransactionsData = {
  transactions: [],
  totalExpense: 0,
  totalIncome: 0,
  balance: null
};

export function useTransactions() {
  const [data, setData] = useState<TransactionsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      // Load transactions and balance in parallel
      const [
        { data: transactionsData, error: transactionsError },
        { data: balanceData, error: balanceError }
      ] = await Promise.all([
        supabase
          .from('user_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false }),
        supabase
          .from('user_balances')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      if (transactionsError) throw transactionsError;
      if (balanceError) throw balanceError;

      const totalExpense = transactionsData
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const totalIncome = transactionsData
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setData({
        transactions: transactionsData || [],
        totalExpense,
        totalIncome,
        balance: balanceData
      });
      setError(null);
    } catch (err) {
      console.error('Transactions loading error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setData(DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial load
    if (mounted) {
      loadTransactions();
    }

    // Subscribe to both transactions and balance changes
    const transactionsSubscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_transactions'
        },
        () => {
          if (mounted) {
            loadTransactions();
          }
        }
      )
      .subscribe();

    const balanceSubscription = supabase
      .channel('balance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances'
        },
        () => {
          if (mounted) {
            loadTransactions();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      transactionsSubscription.unsubscribe();
      balanceSubscription.unsubscribe();
    };
  }, []);

  async function addTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      const { data, error } = await supabase
        .from('user_transactions')
        .insert({
          ...transaction,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadTransactions(); // Reload after adding
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const { data, error } = await supabase
        .from('user_transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadTransactions(); // Reload after updating
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function deleteTransaction(id: string) {
    try {
      const { error } = await supabase
        .from('user_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTransactions(); // Reload after deleting
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  async function duplicateTransaction(transaction: Transaction) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      // Remove unique fields and timestamps
      const { id, created_at, updated_at, ...transactionData } = transaction;

      const { data, error } = await supabase
        .from('user_transactions')
        .insert({
          ...transactionData,
          user_id: user.id,
          title: `${transaction.title} (Kopya)`,
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      await loadTransactions(); // Reload after duplicating
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  }

  return {
    ...data,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    duplicateTransaction,
    refresh: loadTransactions // Expose refresh function
  };
}