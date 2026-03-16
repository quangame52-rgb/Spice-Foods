import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Product, SiteSettings } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

// Pages
import Admin from './pages/Admin';
import Login from './pages/Login';

// Components
import { 
  Utensils, 
  ChevronRight, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram,
  Menu,
  X,
  ShoppingCart,
  CheckCircle2,
  Leaf,
  Clock,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FEATURES } from './constants';
import { getDirectImageUrl } from './utils';

// --- Protected Route Component ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAdmin, setIsLocalAdmin] = useState(false);

  useEffect(() => {
    const localAuth = localStorage.getItem('admin_auth') === 'true';
    setIsLocalAdmin(localAuth);

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Đang kiểm tra quyền...</div>;
  
  // Allow if either Firebase user is logged in OR local admin session exists
  if (!user && !isLocalAdmin) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

// --- Landing Page Component ---
const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch site settings
    const settingsRef = doc(db, 'site_settings', 'main');
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(docSnap.data() as SiteSettings);
      } else {
        // Default settings if not configured
        setSiteSettings({
          aboutUs: 'Khám phá trọn bộ gia vị Spice Foods - Bí quyết cho những món ăn ngon chuẩn vị nhà hàng ngay tại bếp nhà bạn.',
          contactPhone: '0123 456 789',
          contactEmail: 'contact@spicefoods.vn',
          contactAddress: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
          heroTitle: 'Nâng Tầm Vị Ngon Bữa Cơm Gia Đình',
          heroSubtitle: 'Khám phá bộ sưu tập xốt gia vị chuẩn vị truyền thống, giúp bạn chế biến những món ăn ngon đúng điệu chỉ trong vài phút.',
          logo: '',
          storyTitle: 'Mang Hương Vị Truyền Thống Đến Mọi Gian Bếp',
          storyContent: 'Spice Foods ra đời với sứ mệnh mang đến những giải pháp gia vị hoàn chỉnh, giúp việc nấu nướng trở nên dễ dàng và thú vị hơn bao giờ hết. Chúng tôi tin rằng mỗi bữa cơm gia đình đều xứng đáng có được hương vị thơm ngon nhất.\n\nVới quy trình sản xuất hiện đại và sự tuyển chọn kỹ lưỡng từ những nguyên liệu tự nhiên, các sản phẩm của Spice Foods luôn đảm bảo chất lượng và an toàn vệ sinh thực phẩm cho người tiêu dùng.',
          storyImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000',
          storyImages: [],
          storyVideoUrl: '',
          storyMediaType: 'image',
          updatedAt: new Date().toISOString()
        });
      }
    }, (error) => {
      console.error("Error listening to site settings:", error);
    });

    // Fetch products from Firestore
    const q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'));
    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setProducts([]);
      } else {
        const prods = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(prods);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to products:", error);
      setLoading(false);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeSettings();
      unsubscribeProducts();
    };
  }, []);

  // Function to seed initial data if empty
  const seedData = async () => {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      for (const p of INITIAL_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...p,
          updatedAt: new Date().toISOString()
        });
      }
    }
  };

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'seasoning', name: 'Xốt Gia Vị' },
    { id: 'dipping', name: 'Xốt Chấm' },
    { id: 'powder', name: 'Bột Gia Vị' },
    { id: 'hotpot', name: 'Xốt Lẩu' },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Clock': return <Clock className="w-8 h-8" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
      default: return <CheckCircle2 className="w-8 h-8" />;
    }
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    // Google Drive
    const gdMatch = url.match(/(?:drive\.google\.com\/file\/d\/|id=)([\w-]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    
    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) !== null;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-600">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {siteSettings?.logo ? (
                  <img 
                    src={getDirectImageUrl(siteSettings.logo)} 
                    alt="Spice Foods Logo" 
                    className="h-10 md:h-12 w-auto object-contain max-w-[150px] block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                      if (fallback) (fallback as HTMLElement).style.display = 'flex';
                    }}
                  />
                ) : null}
                
                <div 
                  className={`logo-fallback w-10 h-10 bg-red-600 rounded-full flex items-center justify-center ${siteSettings?.logo ? 'hidden' : 'flex'}`}
                >
                  <Utensils className="text-white w-6 h-6" />
                </div>
              </div>

              <span className={`text-2xl font-bold tracking-tighter ${isScrolled ? 'text-red-600' : 'text-white'}`}>
                SPICE FOODS
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Trang chủ', 'Sản phẩm', 'Về chúng tôi', 'Liên hệ'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
                >
                  {item}
                </a>
              ))}
              <Link to="/login" className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-gray-400 hover:text-red-600' : 'text-white/50 hover:text-white'}`}>
                <Settings className="w-5 h-5" />
              </Link>
              <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                Đặt hàng ngay
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-4">
               <Link to="/login" className={isScrolled ? 'text-gray-700' : 'text-white'}>
                <Settings className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={isScrolled ? 'text-gray-700' : 'text-white'}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {['Trang chủ', 'Sản phẩm', 'Về chúng tôi', 'Liên hệ'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4">
                  <button className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
                    Đặt hàng ngay
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section id="trang-chủ" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 bg-red-600 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              Gia Vị Hoàn Chỉnh - Spice Foods
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              {siteSettings?.heroTitle || 'Nâng Tầm Vị Ngon'} <br />
              <span className="text-red-500 italic font-serif">Bữa Cơm Gia Đình</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
              {siteSettings?.heroSubtitle || 'Khám phá bộ sưu tập xốt gia vị chuẩn vị truyền thống, giúp bạn chế biến những món ăn ngon đúng điệu chỉ trong vài phút.'}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#sản-phẩm" className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center group shadow-xl shadow-red-600/30">
                Xem sản phẩm
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#về-chúng-tôi" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all text-center">
                Về chúng tôi
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="sản-phẩm" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Khám phá trọn bộ gia vị Spice Foods - Bí quyết cho những món ăn ngon chuẩn vị nhà hàng ngay tại bếp nhà bạn.
            </p>
            {products.length === 0 && !loading && (
              <button 
                onClick={seedData}
                className="mt-8 text-red-600 font-bold hover:underline"
              >
                Nhấn để tải dữ liệu mẫu ban đầu
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={getDirectImageUrl(product.image)} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer" 
                      />
                      {product.weight && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-600 shadow-sm">{product.weight}</div>}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-red-600 transition-colors">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-red-600">{product.price.toLocaleString('vi-VN')}đ</span>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-xs font-bold text-gray-400">5.0</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Us */}
      <section id="về-chúng-tôi" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative w-full">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-50 rounded-full -z-10"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-red-100 rounded-full -z-10"></div>
              
              <div className="relative z-10 w-full rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100 aspect-video lg:aspect-[4/3]">
                {siteSettings?.storyMediaType === 'video' && siteSettings.storyVideoUrl ? (
                  isDirectVideo(siteSettings.storyVideoUrl) ? (
                    <video 
                      src={siteSettings.storyVideoUrl}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    ></video>
                  ) : (
                    <iframe 
                      src={getEmbedUrl(siteSettings.storyVideoUrl)}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )
                ) : siteSettings?.storyMediaType === 'gallery' && siteSettings.storyImages && siteSettings.storyImages.length > 0 ? (
                  <div className="w-full h-full relative group">
                    <div className="flex w-full h-full overflow-hidden">
                      {siteSettings.storyImages.map((img, idx) => (
                        <motion.img 
                          key={idx}
                          src={getDirectImageUrl(img)}
                          className="w-full h-full object-cover flex-shrink-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    {/* Simple Gallery Overlay/Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                      {siteSettings.storyImages.map((_, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full bg-white/50"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <img 
                    src={getDirectImageUrl(siteSettings?.storyImage || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000")} 
                    alt="About Spice Foods" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4 block">Câu chuyện của chúng tôi</span>
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                {siteSettings?.storyTitle || 'Mang Hương Vị Truyền Thống Đến Mọi Gian Bếp'}
              </h2>
              <div className="text-gray-600 space-y-6 text-lg leading-relaxed">
                {siteSettings?.storyContent ? (
                  <div className="whitespace-pre-wrap">{siteSettings.storyContent}</div>
                ) : (
                  <>
                    <p>
                      Spice Foods ra đời với sứ mệnh mang đến những giải pháp gia vị hoàn chỉnh, giúp việc nấu nướng trở nên dễ dàng và thú vị hơn bao giờ hết. Chúng tôi tin rằng mỗi bữa cơm gia đình đều xứng đáng có được hương vị thơm ngon nhất.
                    </p>
                    <p>
                      Với quy trình sản xuất hiện đại và sự tuyển chọn kỹ lưỡng từ những nguyên liệu tự nhiên, các sản phẩm của Spice Foods luôn đảm bảo chất lượng và an toàn vệ sinh thực phẩm cho người tiêu dùng.
                    </p>
                  </>
                )}
              </div>
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-1">10+</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Năm kinh nghiệm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-1">50+</div>
                  <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Sản phẩm đa dạng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Tại sao nên chọn Spice Foods?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">{getIcon(feature.icon)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Contact */}
      <section id="liên-hệ" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-600 rounded-[3rem] p-12 lg:p-20 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Đặt hàng ngay hôm nay!</h2>
                <p className="text-red-100 mb-10 text-lg max-w-xl">
                  Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất về các sản phẩm gia vị Spice Foods.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-red-200 text-sm">Hotline</div>
                      <div className="font-bold text-xl">{siteSettings?.contactPhone || '0123 456 789'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-red-200 text-sm">Email</div>
                      <div className="font-bold text-xl">{siteSettings?.contactEmail || 'contact@spicefoods.vn'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-red-200 text-sm">Địa chỉ</div>
                      <div className="font-bold text-xl">{siteSettings?.contactAddress || 'TP. Hồ Chí Minh, Việt Nam'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-8 text-gray-900">
                <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Họ và tên</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none transition-all" placeholder="Nhập tên của bạn" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Số điện thoại</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none transition-all" placeholder="Nhập số điện thoại" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Nội dung</label>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none transition-all h-32" placeholder="Bạn cần tư vấn gì?"></textarea>
                  </div>
                  <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                    Gửi yêu cầu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {siteSettings?.logo ? (
                <img 
                  src={getDirectImageUrl(siteSettings.logo)} 
                  alt="Spice Foods Logo" 
                  className="h-8 w-auto object-contain max-w-[100px] block"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.footer-logo-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`footer-logo-fallback w-8 h-8 bg-red-600 rounded-full flex items-center justify-center ${siteSettings?.logo ? 'hidden' : 'flex'}`}>
                <Utensils className="text-white w-5 h-5" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-red-600">
              SPICE FOODS
            </span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 Spice Foods. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-red-600 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-red-600 transition-colors"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
