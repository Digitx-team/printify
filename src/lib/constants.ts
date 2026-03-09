import type { PhoneModel, Product, TestimonialItem, Brand } from '@/types';

export const BRANDS: Brand[] = [
  { id: 'all', label: 'Tous' },
  { id: 'samsung', label: 'Samsung' },
  { id: 'iphone', label: 'iPhone' },
  { id: 'xiaomi', label: 'Xiaomi / Redmi' },
  { id: 'oppo', label: 'Oppo' },
  { id: 'huawei', label: 'Huawei' },
  { id: 'realme', label: 'Realme' },
  { id: 'infinix', label: 'Infinix' },
  { id: 'tecno', label: 'Tecno' },
  { id: 'honor', label: 'Honor' },
];

export const PHONE_MODELS: PhoneModel[] = [
  // Samsung — most popular in Algeria
  { id: 's1', name: 'Samsung Galaxy A15', brand: BRANDS[1], popular: true },
  { id: 's2', name: 'Samsung Galaxy A25', brand: BRANDS[1], popular: true },
  { id: 's3', name: 'Samsung Galaxy A35', brand: BRANDS[1], popular: true },
  { id: 's4', name: 'Samsung Galaxy A55', brand: BRANDS[1], popular: true },
  { id: 's5', name: 'Samsung Galaxy A05s', brand: BRANDS[1] },
  { id: 's6', name: 'Samsung Galaxy A14', brand: BRANDS[1] },
  { id: 's7', name: 'Samsung Galaxy A34', brand: BRANDS[1] },
  { id: 's8', name: 'Samsung Galaxy A54', brand: BRANDS[1] },
  { id: 's9', name: 'Samsung Galaxy S24', brand: BRANDS[1], popular: true },
  { id: 's10', name: 'Samsung Galaxy S24 Ultra', brand: BRANDS[1], popular: true },
  { id: 's11', name: 'Samsung Galaxy S23 FE', brand: BRANDS[1] },
  { id: 's12', name: 'Samsung Galaxy S23 Ultra', brand: BRANDS[1] },
  { id: 's13', name: 'Samsung Galaxy M14', brand: BRANDS[1] },
  { id: 's14', name: 'Samsung Galaxy M34', brand: BRANDS[1] },

  // iPhone
  { id: 'i1', name: 'iPhone 16 Pro Max', brand: BRANDS[2], popular: true },
  { id: 'i2', name: 'iPhone 16 Pro', brand: BRANDS[2], popular: true },
  { id: 'i3', name: 'iPhone 16', brand: BRANDS[2] },
  { id: 'i4', name: 'iPhone 15 Pro Max', brand: BRANDS[2], popular: true },
  { id: 'i5', name: 'iPhone 15 Pro', brand: BRANDS[2] },
  { id: 'i6', name: 'iPhone 15', brand: BRANDS[2] },
  { id: 'i7', name: 'iPhone 14 Pro Max', brand: BRANDS[2] },
  { id: 'i8', name: 'iPhone 14', brand: BRANDS[2] },
  { id: 'i9', name: 'iPhone 13', brand: BRANDS[2] },
  { id: 'i10', name: 'iPhone 12', brand: BRANDS[2] },
  { id: 'i11', name: 'iPhone 11', brand: BRANDS[2] },

  // Xiaomi / Redmi / POCO
  { id: 'x1', name: 'Redmi Note 13 Pro', brand: BRANDS[3], popular: true },
  { id: 'x2', name: 'Redmi Note 13', brand: BRANDS[3], popular: true },
  { id: 'x3', name: 'Redmi Note 12', brand: BRANDS[3] },
  { id: 'x4', name: 'Redmi 13C', brand: BRANDS[3], popular: true },
  { id: 'x5', name: 'Redmi A3', brand: BRANDS[3] },
  { id: 'x6', name: 'POCO X6 Pro', brand: BRANDS[3] },
  { id: 'x7', name: 'POCO M6 Pro', brand: BRANDS[3] },
  { id: 'x8', name: 'Xiaomi 14', brand: BRANDS[3] },
  { id: 'x9', name: 'Xiaomi 13T Pro', brand: BRANDS[3] },

  // Oppo
  { id: 'o1', name: 'Oppo A18', brand: BRANDS[4], popular: true },
  { id: 'o2', name: 'Oppo A38', brand: BRANDS[4], popular: true },
  { id: 'o3', name: 'Oppo A58', brand: BRANDS[4] },
  { id: 'o4', name: 'Oppo A78', brand: BRANDS[4] },
  { id: 'o5', name: 'Oppo Reno 11', brand: BRANDS[4] },
  { id: 'o6', name: 'Oppo Reno 10', brand: BRANDS[4] },

  // Huawei
  { id: 'h1', name: 'Huawei Nova 12', brand: BRANDS[5], popular: true },
  { id: 'h2', name: 'Huawei Nova 11i', brand: BRANDS[5] },
  { id: 'h3', name: 'Huawei P60 Pro', brand: BRANDS[5] },
  { id: 'h4', name: 'Huawei Y61', brand: BRANDS[5] },
  { id: 'h5', name: 'Huawei Nova Y90', brand: BRANDS[5] },

  // Realme
  { id: 'r1', name: 'Realme C67', brand: BRANDS[6], popular: true },
  { id: 'r2', name: 'Realme C55', brand: BRANDS[6] },
  { id: 'r3', name: 'Realme 12 Pro', brand: BRANDS[6] },
  { id: 'r4', name: 'Realme 11', brand: BRANDS[6] },
  { id: 'r5', name: 'Realme Note 50', brand: BRANDS[6] },

  // Infinix
  { id: 'inf1', name: 'Infinix Hot 40i', brand: BRANDS[7], popular: true },
  { id: 'inf2', name: 'Infinix Hot 30', brand: BRANDS[7] },
  { id: 'inf3', name: 'Infinix Smart 8', brand: BRANDS[7] },
  { id: 'inf4', name: 'Infinix Note 30', brand: BRANDS[7] },
  { id: 'inf5', name: 'Infinix Zero 30', brand: BRANDS[7] },

  // Tecno
  { id: 't1', name: 'Tecno Spark 20 Pro', brand: BRANDS[8], popular: true },
  { id: 't2', name: 'Tecno Spark 20', brand: BRANDS[8] },
  { id: 't3', name: 'Tecno Pop 8', brand: BRANDS[8] },
  { id: 't4', name: 'Tecno Camon 20', brand: BRANDS[8] },
  { id: 't5', name: 'Tecno Pova 5', brand: BRANDS[8] },

  // Honor
  { id: 'hon1', name: 'Honor X8b', brand: BRANDS[9], popular: true },
  { id: 'hon2', name: 'Honor X7b', brand: BRANDS[9] },
  { id: 'hon3', name: 'Honor 90', brand: BRANDS[9] },
  { id: 'hon4', name: 'Honor Magic 6 Pro', brand: BRANDS[9] },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Amirah أميرة',
    price: 2500,
    image: '/products/case-amirah.png',
    category: 'calligraphy',
    description: 'Coque élégante avec calligraphie arabe et illustration artistique sur fond crème.',
    popular: true,
  },
  {
    id: 'p2',
    name: 'Gazelle منى',
    price: 2800,
    image: '/products/case-deer.png',
    category: 'nature',
    description: 'Design nature avec gazelle et calligraphie arabe. Tons chauds et organiques.',
    popular: true,
  },
  {
    id: 'p3',
    name: 'Shaikha شيخة',
    price: 2500,
    image: '/products/case-shaikha.png',
    category: 'personalized',
    description: 'Coque personnalisée avec photo et nom. Décorations étoiles et rubans.',
  },
  {
    id: 'p4',
    name: 'Floral Rose',
    price: 2200,
    image: '/products/case-floral.png',
    category: 'artistic',
    description: 'Design floral en tons rose et or. Calligraphie arabe élégante.',
    popular: true,
  },
  {
    id: 'p5',
    name: 'Galaxy نجوم',
    price: 2800,
    image: '/products/case-galaxy.png',
    category: 'artistic',
    description: 'Design cosmique bleu et violet avec étoiles dorées et calligraphie en or.',
  },
  {
    id: 'p6',
    name: 'Géométrique هندسي',
    price: 2200,
    image: '/products/case-geometric.png',
    category: 'geometric',
    description: 'Motifs géométriques en tons terre. Style minimaliste et moderne.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  { id: '1', quote: "Résultat bluffant, exactement comme je l'imaginais.", author: 'Sarah M.', rating: 5 },
  { id: '2', quote: 'Livraison rapide et qualité parfaite. Je recommande !', author: 'Karim B.', rating: 5 },
  { id: '3', quote: "Super service, l'équipe est très réactive.", author: 'Amira S.', rating: 5 },
];

export const NAV_LINKS = [
  { key: 'nav_how' as const, href: '#how-it-works' },
  { key: 'nav_models' as const, href: '#models' },
  { key: 'nav_gallery' as const, href: '#gallery' },
  { key: 'nav_contact' as const, href: '#contact' },
];

export const FOOTER_LINKS_KEYS = [
  { key: 'footer_home' as const, href: '#' },
  { key: 'nav_how' as const, href: '#how-it-works' },
  { key: 'nav_models' as const, href: '#models' },
  { key: 'nav_gallery' as const, href: '#gallery' },
  { key: 'footer_faq' as const, href: '#faq' },
  { key: 'nav_contact' as const, href: '#contact' },
];

export const ALGERIAN_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
  'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane',
];

export const WILAYAS = ALGERIAN_WILAYAS;

