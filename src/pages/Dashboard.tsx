import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Receipt, 
  CreditCard, 
  History, 
  Bell, 
  Settings, 
  HelpCircle, 
  Search,
  Sun,
  ChevronDown,
  MoreVertical,
  Copy,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Zap,
  Music2,
  Building2,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDashboard } from '../hooks/useDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const chartData = {
  labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  datasets: [
    {
      label: 'Gelir',
      data: [65000, 59000, 80000, 81000, 56000, 75000, 90000, 85000, 91000, 88000, 95000, 101000],
      borderColor: '#10b981',
      tension: 0.4
    },
    {
      label: 'Gider',
      data: [28000, 32000, 35000, 29000, 30000, 35000, 40000, 38000, 42000, 45000, 48000, 50000],
      borderColor: '#a3e635',
      tension: 0.4
    }
  ]
};

export default function Dashboard() {
  const { 
    balance,
    monthlyIncome,
    monthlyExpense,
    monthlyStats,
    loading,
    error
  } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Financial Overview Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* My Balance */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-gray-900">Bakiyem</h3>
            <select className="text-sm border-none bg-transparent text-gray-500 focus:outline-none">
              <option>Tüm Zamanlar</option>
              <option>Bu Ay</option>
              <option>Geçen Ay</option>
            </select>
          </div>
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Toplam bakiye</div>
            <div className="text-[2.5rem] leading-tight font-medium">
              {formatCurrency(balance?.total_balance || 0)}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="bg-white p-2 rounded-lg">
                <Wallet className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Son kazanılan toplam</div>
              </div>
              <div className="text-sm font-medium text-emerald-500">
                +{formatCurrency(balance?.last_earned || 0)}
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="bg-white p-2 rounded-lg">
                <Zap className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Toplam bonus</div>
              </div>
              <div className="text-sm font-medium text-emerald-500">
                +{formatCurrency(balance?.total_bonus || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* My Income */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-gray-900">Gelirim</h3>
            <div className="text-sm text-gray-500">Temmuz 2024</div>
          </div>
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Toplam gelir</div>
            <div className="text-[2.5rem] leading-tight font-medium mb-4">
              {formatCurrency(monthlyIncome)}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Wallet className="h-4 w-4 text-gray-500" />
                <div className="text-gray-500">Min</div>
                <div className="text-rose-500">-2.4% APR</div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Zap className="h-4 w-4 text-gray-500" />
                <div className="text-gray-500">Kazanılan</div>
                <div className="text-emerald-500">+₺458,00</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-500">Maaş</div>
                <div className="text-lg font-medium">{formatCurrency(monthlyStats.salary)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-lime-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-500">İş</div>
                <div className="text-lg font-medium">{formatCurrency(monthlyStats.business)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-cyan-500 rounded-full"></div>
              <div>
                <div className="text-sm text-gray-500">Yatırım</div>
                <div className="text-lg font-medium">{formatCurrency(monthlyStats.investment)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="mb-6">
            <div className="text-[2.5rem] leading-tight font-medium">
              {formatCurrency(monthlyExpense)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Toplam gider</div>
          </div>
          
          <div className="flex items-center gap-4 text-sm mb-8">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <Wallet className="h-4 w-4 text-gray-500" />
              <div className="text-gray-500">Min</div>
              <div className="text-emerald-500">7.4% APR</div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
              <Zap className="h-4 w-4 text-gray-500" />
              <div className="text-gray-500">Kazanılan</div>
              <div className="text-emerald-500">+₺800,00</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
              <div className="flex gap-1">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-10 w-1.5 rounded-full ${
                      i < 8 ? 'bg-lime-400' : 'bg-lime-100'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-500">Temmuz 2024</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">%75 hedefi ile</span>
                <Zap className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Budget Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Para Akışı</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-500">Gelir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lime-400"></div>
                <span className="text-sm text-gray-500">Gider</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-sm text-gray-500">Boşluk</span>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <option>Aylık</option>
                <option>Haftalık</option>
                <option>Günlük</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Kalan Aylık</h3>
            <button className="text-sm text-emerald-600">Bütçe ayarları →</button>
          </div>
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2">69%</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Copy className="h-4 w-4" />
              <span>Ek Ortalama</span>
              <span className="text-emerald-500">2.4%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>İhtiyaçlar</span>
                <span>89%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[89%] bg-emerald-500 rounded-full"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>₺7.890</span>
                <span>₺9.500</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Yemek</span>
                <span>78%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[78%] bg-lime-400 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Eğitim</span>
                <span>42%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full w-[42%] bg-emerald-300 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium">Harika durumdasın—</div>
            <div className="text-sm text-gray-500">aylık kullanımın hala çok güvenli</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">İşlem Geçmişi</h3>
          <div className="flex items-center gap-2">
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
              <option>Tüm İşlemler</option>
              <option>Gelirler</option>
              <option>Giderler</option>
            </select>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="pb-4">İsim</th>
              <th className="pb-4">Tarih</th>
              <th className="pb-4">İşlem</th>
              <th className="pb-4">Tutar</th>
              <th className="pb-4">Durum</th>
              <th className="pb-4">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <img src="https://www.google.com/favicon.ico" alt="YouTube" className="h-5 w-5" />
                  </div>
                  <span>YouTube</span>
                </div>
              </td>
              <td>2 Ağu 2024 - 11:00</td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Banka Transferi</span>
                </div>
              </td>
              <td>₺850,00</td>
              <td><span className="text-emerald-500">Tamamlandı</span></td>
              <td>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </td>
            </tr>
            <tr className="border-t border-gray-100">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Music2 className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Spotify Premium</span>
                </div>
              </td>
              <td>1 Haz 2024 - 13:58</td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-1.5 rounded-lg">
                    <CreditCardIcon className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Kredi Kartı</span>
                </div>
              </td>
              <td>₺15,00</td>
              <td><span className="text-yellow-500">Beklemede</span></td>
              <td>
                <button className="p-1 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}