import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Balance = Database['public']['Tables']['user_balances']['Row'];
type Income = Database['public']['Tables']['user_incomes']['Row'];
type Expense = Database['public']['Tables']['user_expenses']['Row'];
type Transaction = Database['public']['Tables']['user_transactions']['Row'];

interface DashboardData {
  balance: Balance | null;
  incomes: Income[];
  expenses: Expense[];
  transactions: Transaction[];
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyStats: {
    salary: number;
    business: number;
    investment: number;
  };
}

const DEFAULT_DATA: DashboardData = {
  balance: null,
  incomes: [],
  expenses: [],
  transactions: [],
  monthlyIncome: 0,
  monthlyExpense: 0,
  monthlyStats: {
    salary: 0,
    business: 0,
    investment: 0
  }
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) throw new Error('Kullanıcı girişi yapılmamış');

        // Load all data in parallel
        const [
          { data: balanceData, error: balanceError },
          { data: incomesData, error: incomesError },
          { data: expensesData, error: expensesError },
          { data: transactionsData, error: transactionsError }
        ] = await Promise.all([
          supabase
            .from('user_balances')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('user_incomes')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false }),
          supabase
            .from('user_expenses')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false }),
          supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(10)
        ]);

        if (balanceError) throw balanceError;
        if (incomesError) throw incomesError;
        if (expensesError) throw expensesError;
        if (transactionsError) throw transactionsError;

        // Calculate monthly statistics
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyIncomes = incomesData?.filter(income => 
          new Date(income.date) >= startOfMonth
        ) || [];
        
        const monthlyExpenses = expensesData?.filter(expense => 
          new Date(expense.date) >= startOfMonth
        ) || [];

        const monthlyIncome = monthlyIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
        const monthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

        // Calculate income by category
        const monthlyStats = {
          salary: monthlyIncomes
            .filter(income => income.category === 'salary')
            .reduce((sum, income) => sum + Number(income.amount), 0),
          business: monthlyIncomes
            .filter(income => income.category === 'business')
            .reduce((sum, income) => sum + Number(income.amount), 0),
          investment: monthlyIncomes
            .filter(income => income.category === 'investment')
            .reduce((sum, income) => sum + Number(income.amount), 0)
        };

        if (mounted) {
          setData({
            balance: balanceData || null,
            incomes: incomesData || [],
            expenses: expensesData || [],
            transactions: transactionsData || [],
            monthlyIncome,
            monthlyExpense,
            monthlyStats
          });
          setError(null);
        }
      } catch (err) {
        console.error('Dashboard data loading error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Veri yüklenirken bir hata oluştu');
          setData(DEFAULT_DATA);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    // Subscribe to real-time updates
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
            loadDashboardData();
          }
        }
      )
      .subscribe();

    const transactionSubscription = supabase
      .channel('transaction_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_transactions'
        },
        () => {
          if (mounted) {
            loadDashboardData();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      balanceSubscription.unsubscribe();
      transactionSubscription.unsubscribe();
    };
  }, []);

  return {
    ...data,
    loading,
    error
  };
}