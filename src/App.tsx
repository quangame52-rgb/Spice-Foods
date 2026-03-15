/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Leaf, 
  Utensils, 
  Clock, 
  ShieldCheck, 
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
  CheckCircle2
} from 'lucide-react';
import { PRODUCTS, FEATURES } from './constants';
import { Product } from './types';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <Utensils className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-bold tracking-tighter ${isScrolled ? 'text-red-600' : 'text-white'}`}>
              SPICE FOODS
            </span>
          </div>

          {/* Desktop Menu */}
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
            <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
              Đặt hàng ngay
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={isScrolled ? 'text-gray-700' : 'text-white'}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
  );
};

const Hero = () => {
  return (
    <section id="trang-chủ" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
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
            Nâng Tầm Vị Ngon <br />
            <span className="text-red-500 italic font-serif">Bữa Cơm Gia Đình</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
            Khám phá bộ sưu tập xốt gia vị chuẩn vị truyền thống, giúp bạn chế biến những món ăn ngon đúng điệu chỉ trong vài phút.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center group shadow-xl shadow-red-600/30">
              Xem sản phẩm
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
              Về chúng tôi
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.weight && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-600 shadow-sm">
            {product.weight}
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-red-600 p-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-red-600">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-xs font-bold text-gray-400">5.0</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf': return <Leaf className="w-8 h-8" />;
      case 'Utensils': return <Utensils className="w-8 h-8" />;
      case 'Clock': return <Clock className="w-8 h-8" />;
      case 'ShieldCheck': return <ShieldCheck className="w-8 h-8" />;
      default: return <CheckCircle2 className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao nên chọn Spice Foods?
          </h2>
          <p className="text-gray-500">
            Chúng tôi tự hào mang đến những sản phẩm gia vị chất lượng cao, an toàn và tiện lợi cho mọi gia đình Việt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OrderForm = () => {
  return (
    <section id="liên-hệ" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-[3rem] overflow-hidden shadow-2xl shadow-red-600/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-20 text-white">
              <h2 className="text-4xl font-bold mb-6">Đặt hàng ngay hôm nay!</h2>
              <p className="text-red-100 mb-10 text-lg">
                Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và giao hàng tận nơi cho bạn. Nhận ngay ưu đãi khi mua combo từ 5 sản phẩm.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-red-200">Hotline hỗ trợ 24/7</p>
                    <p className="text-xl font-bold">0123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-red-200">Email liên hệ</p>
                    <p className="text-xl font-bold">contact@spicefoods.vn</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-12 lg:p-20">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    placeholder="Nhập họ tên của bạn"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    type="tel" 
                    placeholder="Nhập số điện thoại"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sản phẩm quan tâm</label>
                  <select className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all">
                    <option>Chọn sản phẩm</option>
                    {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                  Gửi yêu cầu đặt hàng
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <Utensils className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter">SPICE FOODS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Spice Foods - Mang hương vị truyền thống đến mọi gian bếp. Chúng tôi cam kết chất lượng và sự hài lòng của khách hàng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Liên kết nhanh</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Trang chủ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sản phẩm</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Sản phẩm chính</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Xốt Tokpokki</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Xốt Muối Kim Chi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Xốt Thái Trộn Gỏi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bột Phô Mai</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Thông tin liên hệ</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <span>123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <span>contact@spicefoods.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 text-center text-gray-500 text-xs">
          <p>© 2026 Spice Foods. All rights reserved. Designed with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'seasoning', name: 'Xốt Gia Vị' },
    { id: 'dipping', name: 'Xốt Chấm' },
    { id: 'powder', name: 'Bột Gia Vị' },
    { id: 'hotpot', name: 'Xốt Lẩu' },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-600">
      <Navbar />
      <Hero />
      
      {/* Products Section */}
      <section id="sản-phẩm" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Sản Phẩm Nổi Bật</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Khám phá trọn bộ gia vị Spice Foods - Bí quyết cho những món ăn ngon chuẩn vị nhà hàng ngay tại bếp nhà bạn.
            </p>
          </div>

          {/* Category Filter */}
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

          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Features />

      {/* About Section */}
      <section id="về-chúng-tôi" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Cooking" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-black text-red-600">10+</div>
                  <div className="text-sm font-bold text-gray-500 leading-tight">
                    Năm kinh nghiệm <br /> trong ngành thực phẩm
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4 block">Về chúng tôi</span>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Sứ mệnh mang đến <br /> <span className="text-red-600">Hương Vị Hoàn Hảo</span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Spice Foods ra đời với mong muốn giúp mọi người, dù bận rộn đến đâu, vẫn có thể tự tay chuẩn bị những bữa cơm ngon, ấm cúng cho gia đình. Chúng tôi không chỉ bán gia vị, chúng tôi bán sự tiện lợi và niềm vui trong gian bếp.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Nguyên liệu sạch, nguồn gốc rõ ràng',
                  'Công thức chuẩn vị, không chất bảo quản độc hại',
                  'Đóng gói tiện lợi, dễ dàng bảo quản',
                  'Hỗ trợ tư vấn nấu ăn tận tình'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <CheckCircle2 className="text-red-600 w-5 h-5" />
                    <span className="font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all">
                Tìm hiểu thêm
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <OrderForm />
      <Footer />
    </div>
  );
}
