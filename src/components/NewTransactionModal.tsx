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
  ArrowDownRight,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['user_transactions']['Row'];

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
  currentBalance: number;
}

export default function NewTransactionModal({ isOpen, onClose, onSubmit, currentBalance }: NewTransactionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('general');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('1');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const validateStep = (step: number) => {
    setError(null);

    switch (step) {
      case 1: // İşlem Türü
        return true;
      case 2: // Başlık ve Tutar
        if (!title.trim()) {
          setError('Lütfen işlem başlığı girin');
          return false;
        }
        if (!amount || Number(amount) <= 0) {
          setError('Lütfen geçerli bir tutar girin');
          return false;
        }
        if (type === 'expense' && Number(amount) > currentBalance) {
          setError('Yetersiz bakiye');
          return false;
        }
        return true;
      case 3: // Kategori ve Ödeme Yöntemi
        return true;
      case 4: // Tarih ve Tekrar
        return true;
      case 5: // Onay
        return isConfirmed; // Kullanıcı onay kutusunu işaretlemeli
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (!isConfirmed) {
      setError('Lütfen işlemi onaylayın');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transaction = {
        title,
        description: description || null,
        amount: Number(amount),
        type,
        category,
        payment_method: paymentMethod,
        status: 'completed' as const,
        date: dueDate,
        is_recurring: isRecurring,
        recurring_day: isRecurring ? Number(recurringDay) : null
      };

      await onSubmit(transaction);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === currentStep
              ? 'bg-emerald-600 text-white'
              : step < currentStep
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-emerald-100' : 'bg-gray-100'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return '1. Adım: İşlem Türü';
      case 2:
        return '2. Adım: Başlık ve Tutar';
      case 3:
        return '3. Adım: Kategori ve Ödeme';
      case 4:
        return '4. Adım: Tarih ve Tekrar';
      case 5:
        return '5. Adım: İşlem Onayı';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                type === 'expense' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-100 hover:border-red-200'
              }`}
            >
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Gider</div>
                <div className="text-sm text-gray-500">Para Çıkışı</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                type === 'income' 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-100 hover:border-emerald-200'
              }`}
            >
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">Gelir</div>
                <div className="text-sm text-gray-500">Para Girişi</div>
              </div>
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
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
              <div className="mt-1 text-sm text-gray-500">
                Mevcut bakiye: {formatCurrency(currentBalance)}
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="general">Genel</option>
                <option value="food">Yemek</option>
                <option value="transport">Ulaşım</option>
                <option value="shopping">Alışveriş</option>
                <option value="bills">Faturalar</option>
                <option value="entertainment">Eğlence</option>
                <option value="health">Sağlık</option>
                <option value="education">Eğitim</option>
              </select>
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
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
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">İşlem Türü</span>
                <span className={`font-medium ${
                  type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {type === 'income' ? 'Gelir' : 'Gider'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Başlık</span>
                <span className="font-medium">{title}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tutar</span>
                <span className="font-medium">{formatCurrency(Number(amount))}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Kategori</span>
                <span className="font-medium">{category}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Ödeme Yöntemi</span>
                <span className="font-medium">
                  {paymentMethod === 'bank' ? 'Banka Hesabı' : 'Nakit'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tarih</span>
                <span className="font-medium">
                  {new Date(dueDate).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {isRecurring && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Tekrar</span>
                  <span className="font-medium">
                    Her ayın {recurringDay}. günü
                  </span>
                </div>
              )}

              {description && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="block text-sm text-gray-500 mb-1">Açıklama</span>
                  <span className="text-gray-700">{description}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">
                  İşlemi onayladıktan sonra {type === 'income' ? 'bakiyenize eklenecek' : 'bakiyenizden düşülecek'}tir.
                </span>
              </div>
            </div>

            {/* Manual confirmation checkbox */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm font-medium">
                Yukarıdaki bilgileri kontrol ettim ve işlemi onaylıyorum
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{renderStepTitle()}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2 text-gray-600 hover:text-gray-800 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              Geri
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <span>İleri</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>İşlemi Onayla</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}