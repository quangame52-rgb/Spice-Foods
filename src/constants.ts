import { Product, Feature } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'tokpokki',
    name: 'Sốt Tokpokki Truyền Thống',
    description: 'Chuẩn vị Hàn Quốc, cay ngọt tự nhiên, dễ dàng chế biến tại nhà.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '120g'
  },
  {
    id: 'kimchi',
    name: 'Xốt Muối Kim Chi Hàn Quốc',
    description: '100% nguyên liệu tươi, giúp bạn muối kim chi ngon đúng điệu.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '180g'
  },
  {
    id: 'thai-sauce',
    name: 'Xốt Thái Ướp Chân Gà',
    description: 'Chuẩn hương vị Thái, trọn yêu thương. Dùng cho chân gà sả tắc, trộn gỏi.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '85g'
  },
  {
    id: 'cheese-powder',
    name: 'Bột Phô Mai Vị Truyền Thống',
    description: 'Thơm ngon, béo ngậy, dùng cho khoai tây chiên, gà rán.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1528750955925-53f5892bc32c?auto=format&fit=crop&q=80&w=800',
    category: 'powder',
    weight: '85g'
  },
  {
    id: 'bbq-sauce',
    name: 'Xốt Chấm Đồ Nướng BBQ',
    description: 'Japan recipe, vị đậm đà, tăng thêm hương vị cho các món nướng.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800',
    category: 'dipping'
  },
  {
    id: 'thit-kho-tau',
    name: 'Xốt Gia Vị Thịt Kho Tàu',
    description: 'Chiết xuất từ củ quả tươi, ướp ngon chuẩn vị không cần nêm nếm.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '80g'
  },
  {
    id: 'bo-kho',
    name: 'Xốt Gia Vị Bò Kho Xốt Vang',
    description: 'Hương vị đậm đà, màu sắc hấp dẫn, chuẩn vị nhà hàng.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '80g'
  },
  {
    id: 'ca-kho-rieng',
    name: 'Xốt Ướp Cá Kho Riềng',
    description: 'Vị truyền thống, thơm mùi riềng tươi, cá kho đậm đà đưa cơm.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '80g'
  },
  {
    id: 'rang-me',
    name: 'Xốt Rang Me Đậm Đà',
    description: 'Vị chua ngọt hài hòa, dùng cho các món hải sản rang me.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=800',
    category: 'dipping'
  },
  {
    id: 'muoi-ot-xanh',
    name: 'Muối Ớt Xanh Chấm Hải Sản',
    description: 'Cay nồng, thơm mùi ớt xiêm rừng, đặc sản chấm hải sản.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1544333346-133ad7697bc1?auto=format&fit=crop&q=80&w=800',
    category: 'dipping'
  },
  {
    id: 'lau-thai',
    name: 'Xốt Lẩu Thái Tomyum',
    description: 'Tươi ngon tự nhiên, vị chua cay đặc trưng của lẩu Thái.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    category: 'hotpot',
    weight: '80g'
  },
  {
    id: 'lau-ga',
    name: 'Xốt Lẩu Gà Nước Dùng Hoàn Chỉnh',
    description: 'Vị thanh ngọt, thơm mùi thảo mộc, tiện lợi cho bữa lẩu gia đình.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&q=80&w=800',
    category: 'hotpot',
    weight: '80g'
  },
  {
    id: 'thit-nuong-sa',
    name: 'Xốt Gia Vị Thịt Nướng Sả',
    description: 'Thơm mùi sả tươi, giúp món nướng vàng đều, đậm vị.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    category: 'seasoning',
    weight: '80g'
  }
];

export const FEATURES: Feature[] = [
  {
    title: '100% Nguyên Liệu Tươi',
    description: 'Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất từ nông trại.',
    icon: 'Leaf'
  },
  {
    title: 'Chuẩn Vị Truyền Thống',
    description: 'Công thức độc quyền mang đến hương vị đậm đà, chuẩn vị mẹ nấu.',
    icon: 'Utensils'
  },
  {
    title: 'Tiện Lợi & Nhanh Chóng',
    description: 'Tiết kiệm thời gian chế biến mà vẫn có bữa cơm ngon đúng điệu.',
    icon: 'Clock'
  },
  {
    title: 'An Toàn Thực Phẩm',
    description: 'Quy trình sản xuất khép kín, đạt tiêu chuẩn vệ sinh an toàn thực phẩm.',
    icon: 'ShieldCheck'
  }
];
