import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import NewTransactionModal from '../components/NewTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import ViewTransactionModal from '../components/ViewTransactionModal';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  MoreVertical,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Check,
  X,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Copy,
  AlertCircle
} from 'lucide-react';

interface ActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function ActionMenu({ isOpen, onClose, onView, onEdit, onDelete, onDuplicate }: ActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-10"
    >
      <button
        onClick={onView}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Eye className="h-4 w-4" />
        <span>Görüntüle</span>
      </button>
      <button
        onClick={onEdit}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Edit className="h-4 w-4" />
        <span>Düzenle</span>
      </button>
      <button
        onClick={onDuplicate}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Copy className="h-4 w-4" />
        <span>Çoğalt</span>
      </button>
      <div className="border-t border-gray-100 my-2"></div>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Sil</span>
      </button>
    </div>
  );
}

export default function Transactions() {
  const [searchParams] = useSearchParams();
  const transactionType = searchParams.get('type') || 'all';
  const { 
    transactions, 
    totalExpense, 
    totalIncome, 
    balance,
    loading, 
    error, 
    addTransaction,
    deleteTransaction,
    duplicateTransaction,
    updateTransaction
  } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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

  const handleAddTransaction = async (transaction: any) => {
    const { error } = await addTransaction(transaction);
    if (error) throw new Error(error);
  };

  const handleMenuClick = (transactionId: string, transaction: any) => {
    setActiveMenu(activeMenu === transactionId ? null : transactionId);
    setSelectedTransaction(transaction);
  };

  const handleViewTransaction = () => {
    setViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditTransaction = () => {
    setEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleDuplicateTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      setActionError(null);
      setActionSuccess(null);
      const { data, error } = await duplicateTransaction(selectedTransaction);
      
      if (error) throw new Error(error);
      
      setActionSuccess('İşlem başarıyla çoğaltıldı');
      setActiveMenu(null);
    } catch (err) {
      setActionError('İşlem çoğaltılırken bir hata oluştu');
      console.error('Error duplicating transaction:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      setActionError(null);
      setActionSuccess(null);
      const { error } = await deleteTransaction(selectedTransaction.id);
      
      if (error) throw error;
      
      setActionSuccess('İşlem başarıyla silindi');
      setDeleteConfirmOpen(false);
      setActiveMenu(null);
    } catch (err) {
      setActionError('İşlem silinirken bir hata oluştu');
      console.error('Error deleting transaction:', err);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    setActiveMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Banka Hesabı</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">
              {formatCurrency(balance?.total_balance || 0)}
            </div>
            <div className="text-sm text-gray-500">Mevcut bakiye</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Toplam Gider</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">{formatCurrency(totalExpense)}</div>
            <div className="text-sm text-gray-500">Toplam giderler</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <ArrowUpRight className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Toplam Gelir</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">{formatCurrency(totalIncome)}</div>
            <div className="text-sm text-gray-500">Toplam gelirler</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">İşlemler</h2>
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
            <button 
              onClick={() => setIsNewTransactionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              <span>Yeni İşlem</span>
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
            <option value="bank">Banka Hesabı</option>
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
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
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Henüz işlem bulunmuyor
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
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
                    <div className={`p-2 rounded-lg ${
                      transaction.payment_method === 'bank' 
                        ? 'bg-blue-100 text-blue-600'
                        : transaction.payment_method === 'credit' 
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {transaction.payment_method === 'bank' ? (
                        <Building2 className="h-5 w-5" />
                      ) : transaction.payment_method === 'credit' ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <Wallet className="h-5 w-5" />
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {transaction.status === 'completed' ? 'Tamamlandı' : 
                       transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => handleMenuClick(transaction.id, transaction)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>
                      <ActionMenu
                        isOpen={activeMenu === transaction.id}
                        onClose={() => setActiveMenu(null)}
                        onView={handleViewTransaction}
                        onEdit={handleEditTransaction}
                        onDuplicate={handleDuplicateTransaction}
                        onDelete={handleDeleteClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Success Message */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-lg">
          <Check className="h-4 w-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Message */}
      {actionError && (
        <div className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">İşlemi Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {viewModalOpen && selectedTransaction && (
        <ViewTransactionModal
          transaction={selectedTransaction}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {/* Edit Transaction Modal */}
      {editModalOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => setEditModalOpen(false)}
          onSubmit={updateTransaction}
        />
      )}

      {/* New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
        onSubmit={handleAddTransaction}
        currentBalance={balance?.total_balance || 0}
      />
    </div>
  );
}