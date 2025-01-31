import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['user_categories']['Row'];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }

      const { data, error: categoriesError } = await supabase
        .from('user_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (categoriesError) throw categoriesError;

      setCategories(data || []);
    } catch (err) {
      console.error('Categories loading error:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      loadCategories();
    }

    const subscription = supabase
      .channel('category_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_categories'
        },
        () => {
          if (mounted) {
            loadCategories();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const addCategory = async (category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Kullanıcı girişi yapılmamış');

      const { data, error } = await supabase
        .from('user_categories')
        .insert({
          ...category,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('user_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Bir hata oluştu' };
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh: loadCategories
  };
}