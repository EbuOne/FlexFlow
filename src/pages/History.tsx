import React, { useState } from 'react';
import { 
  Search,
  Filter,
  ArrowUpDown,
  Download,
  MoreVertical,
  Building2,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Music2,
  ShoppingBag,
  Coffee,
  Plane,
  Car,
  Home,
  Smartphone
} from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: 'bank' | 'credit' | 'wallet';
  status: 'completed' | 'pending' | 'failed';
  icon?: React.ReactNode;
}

const categories = {
  shopping: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
  food: { icon: Coffee, color: 'bg-amber-100 text-amber-600' },
  travel: { icon: Plane, color: 'bg-purple-100 text-purple-600' },
  transport: { icon: Car, color: 'bg-emerald-100 text-emerald-600' },
  bills: { icon: Home, color: 'bg-red-100 text-red-600' },
  entertainment: { icon: Music2, color: 'bg-pink-100 text-pink-600' },
  tech: { icon: Smartphone, color: 'bg-indigo-100 text-indigo-600' }
};

const paymentIcons = {
  bank: { icon: Building2, color: 'bg-blue-100 text-blue-600' },
  credit: { icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
  wallet: { icon: Wallet, color: 'bg-emerald-100 text-emerald-600' }
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Market Alışverişi',
      description: 'Haftalık market alışverişi',
      amount: 856.50,
      type: 'expense',
      category: 'shopping',
      date: '2024-03-10T14:30:00',
      paymentMethod: 'credit',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Maaş Ödemesi',
      description: 'Mart ayı maaş ödemesi',
      amount: 25000,
      type: 'income',
      category: 'salary',
      date: '2024-03-01T09:00:00',
      paymentMethod: 'bank',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Spotify Premium',
      description: 'Aylık abonelik',
      amount: 49.99,
      type: 'expense',
      category: 'entertainment',
      date: '2024-03-08T10:15:00',
      paymentMethod: 'credit',
      status: 'completed'
    },
    {
      id: '4',
      title: 'Elektrik Faturası',
      description: 'Mart ayı elektrik faturası',
      amount: 450.75,
      type: 'expense',
      category: 'bills',
      date: '2024-03-15T16:45:00',
      paymentMethod: 'bank',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Taksi Ödemesi',
      description: 'İş görüşmesi ulaşım',
      amount: 180.00,
      type: 'expense',
      category: 'transport',
      date: '2024-03-12T11:20:00',
      paymentMethod: 'wallet',
      status: 'completed'
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-500 bg-emerald-50';
      case 'pending':
        return 'text-yellow-500 bg-yellow-50';
      case 'failed':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Beklemede';
      case 'failed':
        return 'Başarısız';
      default:
        return status;
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
      
      if (selectedDateRange === 'today') {
        const today = new Date().toISOString().split('T')[0];
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
        return matchesSearch && matchesCategory && matchesStatus && today === transactionDate;
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">İşlem Geçmişi</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Download className="h-4 w-4" />
              <span>Dışa Aktar</span>
            </button>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>{sortOrder === 'asc' ? 'Eskiden Yeniye' : 'Yeniden Eskiye'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="İşlem ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="shopping">Alışveriş</option>
            <option value="food">Yemek</option>
            <option value="travel">Seyahat</option>
            <option value="transport">Ulaşım</option>
            <option value="bills">Faturalar</option>
            <option value="entertainment">Eğlence</option>
            <option value="tech">Teknoloji</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Beklemede</option>
            <option value="failed">Başarısız</option>
          </select>

          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="today">Bugün</option>
            <option value="week">Bu Hafta</option>
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredTransactions.map((transaction) => {
          const CategoryIcon = categories[transaction.category as keyof typeof categories]?.icon || ShoppingBag;
          const PaymentIcon = paymentIcons[transaction.paymentMethod].icon;
          const categoryColor = categories[transaction.category as keyof typeof categories]?.color || 'bg-gray-100 text-gray-600';
          const paymentColor = paymentIcons[transaction.paymentMethod].color;

          return (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${categoryColor}`}>
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">{transaction.title}</div>
                    <div className="text-sm text-gray-500">{transaction.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-lg font-medium ${
                      transaction.type === 'income' ? 'text-emerald-500' : 'text-gray-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${paymentColor}`}>
                      <PaymentIcon className="h-5 w-5" />
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusText(transaction.status)}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-500">İşlem bulunamadı</div>
        </div>
      )}
    </div>
  );
}