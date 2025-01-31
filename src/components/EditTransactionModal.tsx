import React, { useState } from 'react';
import { 
  X, 
  Check,
  Building2,
  Wallet,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['user_transactions']['Row'];

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Transaction>) => Promise<{ data: any; error: any; }>;
}

export default function EditTransactionModal({ transaction, onClose, onSubmit }: EditTransactionModalProps) {
  const [title, setTitle] = useState(transaction.title);
  const [description, setDescription] = useState(transaction.description || '');
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [paymentMethod, setPaymentMethod] = useState(transaction.payment_method);
  const [isRecurring, setIsRecurring] = useState(transaction.is_recurring);
  const [recurringDay, setRecurringDay] = useState(transaction.recurring_day?.toString() || '1');
  const [dueDate, setDueDate] = useState(transaction.date.split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Lütfen işlem başlığı girin');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Lütfen geçerli bir tutar girin');
      return;
    }

    setLoading(true);

    try {
      const updates: Partial<Transaction> = {
        title,
        description: description || null,
        amount: Number(amount),
        payment_method: paymentMethod,
        date: dueDate,
        is_recurring: isRecurring,
        recurring_day: isRecurring ? Number(recurringDay) : null
      };

      const { error } = await onSubmit(transaction.id, updates);
      if (error) throw error;

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">İşlemi Düzenle</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşlem Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tutar
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₺</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ödeme Yöntemi
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  paymentMethod === 'bank' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Banka</div>
                  <div className="text-sm text-gray-500">Banka Hesabı</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                  paymentMethod === 'wallet' 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-100 hover:border-emerald-200'
                }`}
              >
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Nakit</div>
                  <div className="text-sm text-gray-500">Nakit Öde</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <label className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium">Her Ay Tekrarla</span>
            </label>

            {isRecurring && (
              <select
                value={recurringDay}
                onChange={(e) => setRecurringDay(e.target.value)}
                className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Her ayın {i + 1}. günü
                  </option>
                ))}
              </select>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              {loading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}