import React, { useState } from 'react';
import { 
  CreditCard,
  Plus,
  MoreVertical,
  ChevronRight,
  Wallet,
  AlertCircle,
  X,
  Check,
  CreditCard as CreditCardIcon,
  Building2,
  ArrowRight
} from 'lucide-react';

interface CreditCard {
  id: string;
  name: string;
  bank: string;
  number: string;
  limit: number;
  balance: number;
  dueDate: string;
  color: string;
}

interface PaymentModal {
  isOpen: boolean;
  cardId: string | null;
}

export default function Cards() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentModal>({
    isOpen: false,
    cardId: null
  });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: '1',
      name: 'Platinum',
      bank: 'Garanti BBVA',
      number: '4532 •••• •••• 7852',
      limit: 50000,
      balance: 12350,
      dueDate: '2024-03-15',
      color: 'bg-gradient-to-r from-violet-500 to-purple-500'
    },
    {
      id: '2',
      name: 'Miles & Smiles',
      bank: 'Türkiye İş Bankası',
      number: '5426 •••• •••• 3256',
      limit: 35000,
      balance: 8420,
      dueDate: '2024-03-20',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    }
  ]);

  const [newCard, setNewCard] = useState({
    name: '',
    bank: '',
    number: '',
    limit: '',
    balance: '',
    dueDate: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const calculateUsagePercentage = (balance: number, limit: number) => {
    return (balance / limit) * 100;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const card: CreditCard = {
      id: Date.now().toString(),
      name: newCard.name,
      bank: newCard.bank,
      number: newCard.number.replace(/(\d{4})/g, '$1 ').replace(/(?<=.{4}) \d/g, '•'),
      limit: Number(newCard.limit),
      balance: Number(newCard.balance),
      dueDate: newCard.dueDate,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    };
    setCards([...cards, card]);
    setShowAddCard(false);
    setNewCard({
      name: '',
      bank: '',
      number: '',
      limit: '',
      balance: '',
      dueDate: ''
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (paymentModal.cardId && amount > 0) {
      setCards(cards.map(card => {
        if (card.id === paymentModal.cardId) {
          return {
            ...card,
            balance: Math.max(0, card.balance - amount)
          };
        }
        return card;
      }));
      setPaymentModal({ isOpen: false, cardId: null });
      setPaymentAmount('');
      setPaymentMethod('bank');
    }
  };

  const getSelectedCard = () => {
    return cards.find(card => card.id === paymentModal.cardId);
  };

  return (
    <div className="space-y-6">
      {/* Cards Overview */}
      <div className="grid grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className={`relative rounded-xl overflow-hidden ${card.color}`}>
            <div className="absolute top-4 right-4">
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="p-6 text-white">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-6 w-6" />
                <span className="font-medium">{card.bank}</span>
              </div>
              <div className="mb-6 font-mono">{card.number}</div>
              <div className="text-lg font-medium mb-1">{card.name}</div>
              <div className="text-sm text-white/80">Son Ödeme: {new Date(card.dueDate).toLocaleDateString('tr-TR')}</div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowAddCard(true)}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 group transition-colors"
        >
          <div className="p-3 rounded-full bg-gray-100 group-hover:bg-emerald-100">
            <Plus className="h-6 w-6 text-gray-500 group-hover:text-emerald-600" />
          </div>
          <div className="text-gray-500 group-hover:text-emerald-600">Yeni Kart Ekle</div>
        </button>
      </div>

      {/* Card Details */}
      <div className="grid grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-medium">{card.bank}</h3>
                <div className="text-sm text-gray-500">{card.name}</div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Limit Kullanımı</span>
                  <span className={getUsageColor(calculateUsagePercentage(card.balance, card.limit))}>
                    {calculateUsagePercentage(card.balance, card.limit).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getUsageColor(calculateUsagePercentage(card.balance, card.limit)).replace('text', 'bg')}`}
                    style={{ width: `${calculateUsagePercentage(card.balance, card.limit)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Kart Limiti</div>
                  <div className="font-medium">{formatCurrency(card.limit)}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Güncel Borç</div>
                  <div className="font-medium">{formatCurrency(card.balance)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Kullanılabilir Limit</div>
                    <div className="font-medium">{formatCurrency(card.limit - card.balance)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setPaymentModal({ isOpen: true, cardId: card.id })}
                  className="px-4 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                >
                  Ödeme Yap
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Yeni Kart Ekle</h2>
              <button 
                onClick={() => setShowAddCard(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Adı
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Platinum, Miles & Smiles, vb."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banka
                </label>
                <input
                  type="text"
                  value={newCard.bank}
                  onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Banka adı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Limiti
                  </label>
                  <input
                    type="number"
                    value={newCard.limit}
                    onChange={(e) => setNewCard({ ...newCard, limit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Güncel Borç
                  </label>
                  <input
                    type="number"
                    value={newCard.balance}
                    onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Son Ödeme Tarihi
                </label>
                <input
                  type="date"
                  value={newCard.dueDate}
                  onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Kart Ödemesi</h2>
              <button 
                onClick={() => setPaymentModal({ isOpen: false, cardId: null })}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-lg">
                  <CreditCardIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{getSelectedCard()?.bank}</div>
                  <div className="text-sm text-gray-500">{getSelectedCard()?.name}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm text-gray-500">Güncel Borç</div>
                  <div className="font-medium">{formatCurrency(getSelectedCard()?.balance || 0)}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ödeme Tutarı
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                  required
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
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      paymentMethod === 'bank' ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Banka Hesabı</div>
                      <div className="text-sm text-gray-500">Hesaptan Öde</div>
                    </div>
                    {paymentMethod === 'bank' && (
                      <Check className="h-5 w-5 text-emerald-500 ml-auto" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                      paymentMethod === 'card' ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCardIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Başka Kart</div>
                      <div className="text-sm text-gray-500">Kartla Öde</div>
                    </div>
                    {paymentMethod === 'card' && (
                      <Check className="h-5 w-5 text-emerald-500 ml-auto" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ isOpen: false, cardId: null })}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <ArrowRight className="h-4 w-4" />
                  Ödemeyi Tamamla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}