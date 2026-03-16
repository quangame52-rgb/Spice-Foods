import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Product, SiteSettings } from '../types';
import { 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Package, 
  Settings as SettingsIcon, 
  Info, 
  Phone as PhoneIcon, 
  Utensils,
  Play,
  Image as ImageIcon,
  Images as ImagesIcon,
  Video as VideoIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getDirectImageUrl } from '../utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const navigate = useNavigate();

  // Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
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

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'seasoning',
    weight: '',
    image: ''
  });

  useEffect(() => {
    // Fetch Products
    const qProds = query(collection(db, 'products'), orderBy('name'));
    const unsubProds = onSnapshot(qProds, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Admin: Error listening to products:", error);
      setLoading(false);
    });

    // Fetch Settings
    const unsubSettings = onSnapshot(doc(db, 'site_settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(docSnap.data() as SiteSettings);
      }
    }, (error) => {
      console.error("Admin: Error listening to settings:", error);
    });

    return () => {
      unsubProds();
      unsubSettings();
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('admin_auth');
    await signOut(auth);
    navigate('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Lỗi upload ảnh!");
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `site/logo_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setSiteSettings(prev => ({ ...prev, logo: url }));
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Lỗi upload logo!");
    } finally {
      setUploading(false);
    }
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `site/story_${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setSiteSettings(prev => ({ ...prev, storyImage: url }));
    } catch (error) {
      console.error("Story image upload error:", error);
      alert("Lỗi upload ảnh câu chuyện!");
    } finally {
      setUploading(false);
    }
  };

  const handleStoryGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `site/gallery_${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newUrls.push(url);
      }
      setSiteSettings(prev => ({ 
        ...prev, 
        storyImages: [...(prev.storyImages || []), ...newUrls] 
      }));
    } catch (error) {
      console.error("Gallery upload error:", error);
      alert("Lỗi upload ảnh thư viện!");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setSiteSettings(prev => ({
      ...prev,
      storyImages: prev.storyImages?.filter((_, i) => i !== index)
    }));
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    const gdMatch = url.match(/(?:drive\.google\.com\/file\/d\/|id=)([\w-]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;
    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) !== null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'products', isEditing), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
        setIsEditing(null);
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      }
      setFormData({ name: '', description: '', price: 0, category: 'seasoning', weight: '', image: '' });
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Lỗi lưu sản phẩm!");
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (!auth.currentUser) {
      console.error("Save settings failed: No authenticated user");
      alert("Bạn cần đăng nhập (Google hoặc Mật khẩu) để có quyền lưu thay đổi vào cơ sở dữ liệu.");
      return;
    }

    setSavingSettings(true);
    console.log("Saving settings...", siteSettings);

    try {
      await setDoc(doc(db, 'site_settings', 'main'), {
        ...siteSettings,
        updatedAt: new Date().toISOString()
      });
      console.log("Settings saved successfully");
      alert("Đã lưu cài đặt thành công!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      if (error.code === 'permission-denied') {
        alert("Lỗi: Bạn không có quyền ghi dữ liệu. Vui lòng đảm bảo bạn đã đăng nhập bằng tài khoản Google admin (quangame52@gmail.com).");
      } else {
        alert("Lỗi lưu cài đặt: " + error.message);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setIsEditing(product.id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Spice Foods Admin</h1>
          </div>
          
          <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Sản phẩm
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Cài đặt trang
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>

        {activeTab === 'products' ? (
          <>
            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-lg font-bold mb-6 flex items-center">
                {isEditing ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm *</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none h-24"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Giá (VNĐ) *</label>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Trọng lượng</label>
                      <input 
                        type="text" 
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                        placeholder="VD: 120g"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục *</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as any})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                      required
                    >
                      <option value="seasoning">Xốt Gia Vị</option>
                      <option value="dipping">Xốt Chấm</option>
                      <option value="powder">Bột Gia Vị</option>
                      <option value="hotpot">Xốt Lẩu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hình ảnh *</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                        {formData.image ? (
                          <img 
                            src={getDirectImageUrl(formData.image)} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Upload className="text-gray-400 w-8 h-8" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden" 
                          id="image-upload"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors"
                        >
                          Chọn ảnh tải lên
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Định dạng: JPG, PNG. Tối đa 5MB.</p>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="Hoặc nhập URL ảnh"
                      className="w-full px-4 py-2 mt-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}
                    </button>
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditing(null);
                          setFormData({ name: '', description: '', price: 0, category: 'seasoning', weight: '', image: '' });
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold">Danh sách sản phẩm ({products.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Sản phẩm</th>
                      <th className="px-6 py-4 font-bold">Danh mục</th>
                      <th className="px-6 py-4 font-bold">Giá</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={getDirectImageUrl(product.image)} 
                              className="w-12 h-12 rounded-lg object-cover" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.weight || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full uppercase">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {product.price.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id!)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold mb-8 flex items-center">
              <SettingsIcon className="w-6 h-6 mr-2 text-red-600" />
              Cài đặt thông tin trang web
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Brand & Hero Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Thương hiệu & Hero
                  </h3>
                  
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Logo thương hiệu</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                        {siteSettings.logo ? (
                          <img 
                            src={getDirectImageUrl(siteSettings.logo)} 
                            alt="Logo Preview" 
                            className="w-full h-full object-contain p-2" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.logo-preview-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`logo-preview-fallback w-full h-full items-center justify-center ${siteSettings.logo ? 'hidden' : 'flex'}`}>
                          <Utensils className="text-gray-300 w-8 h-8" />
                        </div>
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden" 
                          id="logo-upload"
                        />
                        <label 
                          htmlFor="logo-upload"
                          className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors text-sm"
                        >
                          Thay đổi Logo
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSaveSettings()}
                          disabled={savingSettings || uploading}
                          className="ml-2 inline-block px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                        >
                          {savingSettings ? 'Đang lưu...' : 'Lưu Logo'}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">PNG/SVG khuyên dùng</p>
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-[10px] text-blue-600 font-bold leading-tight">
                            LƯU Ý GOOGLE DRIVE: Bạn phải chia sẻ tệp ở chế độ "Bất kỳ ai có đường liên kết đều có thể xem" thì logo mới hiện được.
                          </p>
                        </div>
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={siteSettings.logo || ''}
                      onChange={e => setSiteSettings({...siteSettings, logo: e.target.value})}
                      placeholder="Hoặc nhập URL logo"
                      className="w-full px-4 py-2 mt-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề chính</label>
                    <input 
                      type="text" 
                      value={siteSettings.heroTitle}
                      onChange={e => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề phụ</label>
                    <textarea 
                      value={siteSettings.heroSubtitle}
                      onChange={e => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none h-24"
                    />
                  </div>
                </div>

                {/* Contact Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Thông tin liên hệ
                  </h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      type="text" 
                      value={siteSettings.contactPhone}
                      onChange={e => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={siteSettings.contactEmail}
                      onChange={e => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ</label>
                    <input 
                      type="text" 
                      value={siteSettings.contactAddress}
                      onChange={e => setSiteSettings({...siteSettings, contactAddress: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About Us */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Về chúng tôi (Footer)</h3>
                <textarea 
                  value={siteSettings.aboutUs}
                  onChange={e => setSiteSettings({...siteSettings, aboutUs: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none h-24"
                  placeholder="Giới thiệu ngắn về công ty ở chân trang..."
                />
              </div>

              {/* Our Story Section */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Phần: Câu chuyện của chúng tôi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề phần</label>
                      <input 
                        type="text" 
                        value={siteSettings.storyTitle || ''}
                        onChange={e => setSiteSettings({...siteSettings, storyTitle: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none"
                        placeholder="VD: Mang Hương Vị Truyền Thống..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung câu chuyện</label>
                      <textarea 
                        value={siteSettings.storyContent || ''}
                        onChange={e => setSiteSettings({...siteSettings, storyContent: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none h-48"
                        placeholder="Kể về hành trình của Spice Foods..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Loại nội dung hiển thị</label>
                      <div className="flex space-x-2">
                        {[
                          { id: 'image', icon: <ImageIcon className="w-4 h-4 mr-2" />, label: '1 Ảnh' },
                          { id: 'gallery', icon: <ImagesIcon className="w-4 h-4 mr-2" />, label: 'Nhiều ảnh' },
                          { id: 'video', icon: <VideoIcon className="w-4 h-4 mr-2" />, label: 'Video' }
                        ].map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSiteSettings({...siteSettings, storyMediaType: type.id as any})}
                            className={`flex-1 flex items-center justify-center py-2 rounded-xl text-xs font-bold border transition-all ${
                              siteSettings.storyMediaType === type.id 
                                ? 'bg-red-600 border-red-600 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {type.icon}
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {siteSettings.storyMediaType === 'image' && (
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh minh họa</label>
                        <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                          {siteSettings.storyImage ? (
                            <img 
                              src={getDirectImageUrl(siteSettings.storyImage)} 
                              alt="Story Preview" 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Upload className="text-gray-400 w-12 h-12" />
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleStoryImageUpload}
                            className="hidden" 
                            id="story-image-upload"
                          />
                          <label 
                            htmlFor="story-image-upload"
                            className="flex-1 text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition-colors"
                          >
                            Tải ảnh mới
                          </label>
                          <input 
                            type="text" 
                            value={siteSettings.storyImage || ''}
                            onChange={e => setSiteSettings({...siteSettings, storyImage: e.target.value})}
                            placeholder="Hoặc nhập URL ảnh"
                            className="flex-[2] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {siteSettings.storyMediaType === 'gallery' && (
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Thư viện ảnh</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(siteSettings.storyImages || []).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                              <img src={getDirectImageUrl(img)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button 
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                            <Plus className="w-6 h-6 text-gray-300" />
                            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Thêm ảnh</span>
                            <input type="file" multiple accept="image/*" onChange={handleStoryGalleryUpload} className="hidden" />
                          </label>
                        </div>
                        {uploading && <p className="text-xs text-red-600 animate-pulse font-bold">Đang tải ảnh lên...</p>}
                      </div>
                    )}

                    {siteSettings.storyMediaType === 'video' && (
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Video minh họa (Xem trước)</label>
                        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                          {siteSettings.storyVideoUrl ? (
                            isDirectVideo(siteSettings.storyVideoUrl) ? (
                              <video 
                                src={siteSettings.storyVideoUrl}
                                className="w-full h-full object-cover"
                                controls
                              ></video>
                            ) : (
                              <iframe 
                                src={getEmbedUrl(siteSettings.storyVideoUrl)}
                                className="w-full h-full border-0"
                                allowFullScreen
                              ></iframe>
                            )
                          ) : (
                            <VideoIcon className="text-gray-700 w-16 h-16" />
                          )}
                        </div>
                        <div>
                          <input 
                            type="text" 
                            value={siteSettings.storyVideoUrl || ''}
                            onChange={e => setSiteSettings({...siteSettings, storyVideoUrl: e.target.value})}
                            placeholder="Nhập URL Video (YouTube, Vimeo, Google Drive, hoặc link .mp4)"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/20 outline-none text-sm"
                          />
                          <p className="text-[10px] text-gray-400 mt-2 italic">
                            Hỗ trợ: YouTube, Vimeo, Google Drive (link chia sẻ), hoặc link video trực tiếp (.mp4, .mov). <br/>
                            <span className="text-red-500 font-bold">Lưu ý lỗi 403 (Google Drive):</span> <br/>
                            1. Bạn phải chọn <span className="underline">"Bất kỳ ai có đường liên kết"</span>. <br/>
                            2. Quyền phải là <span className="underline">"Người xem"</span>. <br/>
                            3. Nếu vẫn lỗi, hãy thử mở link video trong tab ẩn danh, nếu tab ẩn danh không xem được thì trang web cũng không xem được.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={savingSettings || uploading}
                  className="bg-red-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center disabled:opacity-50"
                >
                  {savingSettings ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {savingSettings ? 'Đang lưu cài đặt...' : 'Lưu tất cả cài đặt'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
