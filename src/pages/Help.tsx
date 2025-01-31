import React, { useState } from 'react';
import { 
  ChevronDown, 
  MessageSquare, 
  Search,
  HelpCircle,
  FileText,
  CreditCard,
  Wallet,
  Shield,
  Send
} from 'lucide-react';

type FAQCategory = 'general' | 'payment' | 'security' | 'account';

interface FAQ {
  question: string;
  answer: string;
  category: FAQCategory;
}

const faqs: FAQ[] = [
  {
    category: 'general',
    question: 'FlexFlow nedir?',
    answer: 'FlexFlow, kişisel finans yönetimini kolaylaştıran bir platformdur. Gelir ve giderlerinizi takip edebilir, bütçe oluşturabilir ve finansal hedeflerinize ulaşmak için araçlar kullanabilirsiniz.'
  },
  {
    category: 'general',
    question: 'FlexFlow\'u nasıl kullanmaya başlayabilirim?',
    answer: 'FlexFlow\'u kullanmaya başlamak için önce bir hesap oluşturmanız gerekir. Ardından banka hesaplarınızı bağlayabilir veya manuel olarak gelir ve giderlerinizi ekleyebilirsiniz.'
  },
  {
    category: 'payment',
    question: 'Hangi ödeme yöntemlerini destekliyorsunuz?',
    answer: 'Visa, Mastercard ve American Express kredi kartlarını, banka havalelerini ve çeşitli dijital cüzdanları destekliyoruz.'
  },
  {
    category: 'payment',
    question: 'İşlem ücretleri nedir?',
    answer: 'Temel hesaplar için işlem ücreti alınmamaktadır. Premium özellikleri kullanmak için aylık abonelik ücreti gerekebilir.'
  },
  {
    category: 'security',
    question: 'Verilerim güvende mi?',
    answer: 'Evet, verileriniz en yüksek güvenlik standartlarıyla korunmaktadır. SSL şifreleme, iki faktörlü kimlik doğrulama ve düzenli güvenlik denetimleri uyguluyoruz.'
  },
  {
    category: 'security',
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısını kullanarak şifre sıfırlama talimatlarını e-posta adresinize gönderebilirsiniz.'
  },
  {
    category: 'account',
    question: 'Hesabımı nasıl silebilirim?',
    answer: 'Hesabınızı silmek için Ayarlar > Hesap > Hesabı Sil yolunu izleyebilirsiniz. Silme işlemi geri alınamaz ve tüm verileriniz kalıcı olarak silinir.'
  },
  {
    category: 'account',
    question: 'Premium özellikleri nasıl aktifleştirebilirim?',
    answer: 'Premium özellikleri aktifleştirmek için Ayarlar > Premium sayfasını ziyaret edebilir ve size uygun planı seçebilirsiniz.'
  }
];

const categoryIcons = {
  general: HelpCircle,
  payment: CreditCard,
  security: Shield,
  account: Wallet
};

const categoryNames = {
  general: 'Genel',
  payment: 'Ödeme',
  security: 'Güvenlik',
  account: 'Hesap'
};

function Help() {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const toggleQuestion = (question: string) => {
    setExpandedQuestions(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada destek talebi gönderme işlemi yapılacak
    console.log('Destek talebi gönderildi:', { ticketSubject, ticketMessage });
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Nasıl yardımcı olabiliriz?</h1>
        <p className="text-gray-500">Sık sorulan sorular ve destek ekibimizle iletişime geçin</p>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Soru veya anahtar kelime arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Tümü
        </button>
        {(Object.keys(categoryNames) as FAQCategory[]).map((category) => {
          const Icon = categoryIcons[category];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {categoryNames[category]}
            </button>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {filteredFaqs.map((faq) => (
          <div key={faq.question} className="p-6">
            <button
              onClick={() => toggleQuestion(faq.question)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                  expandedQuestions.includes(faq.question) ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedQuestions.includes(faq.question) && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Destek Ekibine Ulaşın</h2>
            <p className="text-sm text-gray-500">Aradığınız cevabı bulamadıysanız bize yazın</p>
          </div>
        </div>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konu
            </label>
            <input
              type="text"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="Sorunuzu kısaca özetleyin"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mesaj
            </label>
            <textarea
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Detaylı açıklama yazın..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Send className="h-4 w-4" />
              Gönder
            </button>
            <div className="text-sm text-gray-500">
              Genellikle 24 saat içinde yanıt veriyoruz
            </div>
          </div>
        </form>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-6">
        <a
          href="#"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">Kullanım Kılavuzu</div>
            <div className="text-sm text-gray-500">Detaylı kullanım rehberi</div>
          </div>
        </a>
        
        <a
          href="#"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">Güvenlik İpuçları</div>
            <div className="text-sm text-gray-500">Hesabınızı koruyun</div>
          </div>
        </a>
        
        <a
          href="#"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-500"
        >
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">Ödeme Rehberi</div>
            <div className="text-sm text-gray-500">Ödeme seçenekleri</div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default Help;