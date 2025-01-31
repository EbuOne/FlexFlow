import React, { useState } from 'react';
import { 
  Bell,
  Wallet,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  Filter,
  MoreVertical,
  ChevronRight,
  Building2,
  Trash2,
  Check,
  X,
  Search
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'reminder' | 'alert' | 'info';
  priority: 'high' | 'medium' | 'low';
  status: 'read' | 'unread';
  date: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function Notifications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Maaş Ödemesi',
      message: 'Mart ayı maaşınız hesabınıza yatırıldı.',
      type: 'payment',
      priority: 'high',
      status: 'unread',
      date: '2024-03-15T09:00:00',
      action: {
        label: 'Görüntüle',
        href: '/history'
      }
    },
    {
      id: '2',
      title: 'Kredi Kartı Ödemesi',
      message: 'Garanti BBVA kredi kartınızın son ödeme tarihi yaklaşıyor.',
      type: 'reminder',
      priority: 'high',
      status: 'unread',
      date: '2024-03-14T15:30:00',
      action: {
        label: 'Ödeme Yap',
        href: '/cards'
      }
    },
    {
      id: '3',
      title: 'Yeni Özellik',
      message: 'Bütçe planlama özelliğimiz artık kullanımınıza hazır!',
      type: 'info',
      priority: 'low',
      status: 'read',
      date: '2024-03-13T11:20:00'
    },
    {
      id: '4',
      title: 'Güvenlik Uyarısı',
      message: 'Hesabınıza farklı bir lokasyondan giriş denemesi tespit edildi.',
      type: 'alert',
      priority: 'high',
      status: 'read',
      date: '2024-03-12T18:45:00',
      action: {
        label: 'İncele',
        href: '/settings/security'
      }
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return { icon: Wallet, color: 'bg-emerald-100 text-emerald-600' };
      case 'reminder':
        return { icon: Clock, color: 'bg-yellow-100 text-yellow-600' };
      case 'alert':
        return { icon: AlertCircle, color: 'bg-red-100 text-red-600' };
      default:
        return { icon: Bell, color: 'bg-blue-100 text-blue-600' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-600';
      case 'medium':
        return 'bg-yellow-50 text-yellow-600';
      case 'low':
        return 'bg-gray-50 text-gray-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} dakika önce`;
    } else if (diffHours < 24) {
      return `${diffHours} saat önce`;
    } else if (diffDays < 7) {
      return `${diffDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id)
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleMarkAsRead = () => {
    setNotifications(notifications.map(notification => 
      selectedNotifications.includes(notification.id)
        ? { ...notification, status: 'read' }
        : notification
    ));
    setSelectedNotifications([]);
  };

  const handleDelete = () => {
    setNotifications(notifications.filter(notification => 
      !selectedNotifications.includes(notification.id)
    ));
    setSelectedNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header ve Filtreler */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Bildirimlerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedNotifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                >
                  <Check className="h-4 w-4" />
                  <span>Okundu Olarak İşaretle</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Sil</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tüm Bildirimler</option>
            <option value="payment">Ödemeler</option>
            <option value="reminder">Hatırlatmalar</option>
            <option value="alert">Uyarılar</option>
            <option value="info">Bilgilendirmeler</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>

      {/* Bildirimler Listesi */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-600">Tümünü Seç</span>
          </label>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => {
            const { icon: Icon, color } = getTypeIcon(notification.type);
            
            return (
              <div 
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  notification.status === 'unread' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-gray-500">{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{formatDate(notification.date)}</div>
                      </div>
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityBadge(notification.priority)}`}>
                      {notification.priority === 'high' ? 'Yüksek' : notification.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </div>

                    {notification.action && (
                      <a
                        href={notification.action.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100"
                      >
                        {notification.action.label}
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-500">Bildirim bulunamadı</div>
        </div>
      )}
    </div>
  );
}