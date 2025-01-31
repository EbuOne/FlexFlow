import React from 'react';
import { X, Building2, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['user_transactions']['Row'];

interface ViewTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function ViewTransactionModal({ transaction, onClose }: ViewTransactionModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">İşlem Detayları</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Transaction Icon and Type */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              transaction.type === 'income' 
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpRight className="h-6 w-6" />
              ) : (
                <ArrowDownRight className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="font-medium">{transaction.title}</div>
              <div className="text-sm text-gray-500">
                {transaction.type === 'income' ? 'Gelir' : 'Gider'}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-500">Tutar</div>
              <div className="font-medium">{formatCurrency(transaction.amount)}</div>

              <div className="text-sm text-gray-500">Tarih</div>
              <div className="font-medium">{formatDate(transaction.date)}</div>

              <div className="text-sm text-gray-500">Ödeme Yöntemi</div>
              <div className="flex items-center gap-2">
                {transaction.payment_method === 'bank' ? (
                  <>
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span>Banka Hesabı</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <span>Nakit</span>
                  </>
                )}
              </div>

              <div className="text-sm text-gray-500">Durum</div>
              <div className={`inline-flex px-2 py-1 rounded-lg text-sm ${
                transaction.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-600'
                  : transaction.status === 'pending'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {transaction.status === 'completed' ? 'Tamamlandı' :
                 transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
              </div>
            </div>

            {transaction.description && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Açıklama</div>
                  <p className="text-gray-700">{transaction.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Recurring Information */}
          {transaction.is_recurring && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600">
                  Her ayın {transaction.recurring_day}. günü tekrarlanıyor
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}