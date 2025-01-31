import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  Target,
  Wallet,
  CreditCard,
  Building2,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Plane,
  Music2,
  Smartphone
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const categories = {
  shopping: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', label: 'Alışveriş' },
  food: { icon: Coffee, color: 'bg-amber-100 text-amber-600', label: 'Yemek' },
  transport: { icon: Car, color: 'bg-emerald-100 text-emerald-600', label: 'Ulaşım' },
  bills: { icon: Home, color: 'bg-red-100 text-red-600', label: 'Faturalar' },
  travel: { icon: Plane, color: 'bg-purple-100 text-purple-600', label: 'Seyahat' },
  entertainment: { icon: Music2, color: 'bg-pink-100 text-pink-600', label: 'Eğlence' },
  tech: { icon: Smartphone, color: 'bg-indigo-100 text-indigo-600', label: 'Teknoloji' }
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  // Gelir-Gider Trendi
  const trendData = {
    labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    datasets: [
      {
        label: 'Gelir',
        data: [65000, 59000, 80000, 81000, 56000, 75000, 90000, 85000, 91000, 88000, 95000, 101000],
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Gider',
        data: [28000, 32000, 35000, 29000, 30000, 35000, 40000, 38000, 42000, 45000, 48000, 50000],
        borderColor: '#f43f5e',
        backgroundColor: '#f43f5e33',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Kategori Bazlı Harcamalar
  const categoryData = {
    labels: Object.values(categories).map(cat => cat.label),
    datasets: [{
      data: [8500, 6200, 4500, 7800, 3200, 5400, 4100],
      backgroundColor: [
        '#3b82f6',
        '#f59e0b',
        '#10b981',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#6366f1'
      ]
    }]
  };

  // Aylık Harcama Dağılımı
  const monthlySpendingData = {
    labels: ['1-7', '8-14', '15-21', '22-31'],
    datasets: [
      {
        label: 'Haftalık Harcama',
        data: [12500, 15800, 13200, 14500],
        backgroundColor: '#10b981'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: '#f3f4f6'
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '75%'
  };

  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">vs geçen ay</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">₺101.250</div>
            <div className="text-sm text-gray-500">Toplam Gelir</div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>12.5%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">vs geçen ay</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">₺45.800</div>
            <div className="text-sm text-gray-500">Toplam Gider</div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>8.2%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">vs geçen ay</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">₺55.450</div>
            <div className="text-sm text-gray-500">Net Tasarruf</div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>15.8%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Hedef: ₺60.000</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold">92.4%</div>
            <div className="text-sm text-gray-500">Tasarruf Hedefi</div>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[92.4%] bg-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gelir-Gider Trendi */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold">Gelir-Gider Trendi</h3>
              <p className="text-sm text-gray-500">Son 12 ay</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="week">Bu Hafta</option>
                <option value="month">Bu Ay</option>
                <option value="year">Bu Yıl</option>
              </select>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                <Download className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="h-80">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold">Kategori Dağılımı</h3>
              <p className="text-sm text-gray-500">Harcama kategorileri</p>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <Filter className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="h-80 relative">
            <Doughnut data={categoryData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-semibold">₺45.8K</div>
                <div className="text-sm text-gray-500">Toplam Harcama</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategori Detayları ve Haftalık Harcama */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Kategori Detayları</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {Object.entries(categories).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {Object.entries(categories).map(([key, { icon: Icon, color, label }]) => (
              <div key={key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{label}</div>
                      <div className="text-sm text-gray-500">23 işlem</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₺8,500</div>
                      <div className="text-sm text-gray-500">Toplam</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold">Haftalık Harcama</h3>
              <p className="text-sm text-gray-500">Mart 2024</p>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <div className="h-80">
            <Bar data={monthlySpendingData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Ödeme Yöntemleri */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold mb-6">Ödeme Yöntemleri</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-purple-100 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="font-medium">Kredi Kartı</div>
              <div className="text-sm text-gray-500">₺25,800</div>
            </div>
            <div className="ml-auto text-sm text-purple-600">56.3%</div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Banka</div>
              <div className="text-sm text-gray-500">₺15,400</div>
            </div>
            <div className="ml-auto text-sm text-blue-600">33.6%</div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-medium">Nakit</div>
              <div className="text-sm text-gray-500">₺4,600</div>
            </div>
            <div className="ml-auto text-sm text-emerald-600">10.1%</div>
          </div>
        </div>
      </div>
    </div>
  );
}