import type { PhoneModel, Product, TestimonialItem, Brand } from '@/types';

export const BRANDS: Brand[] = [
  { id: 'all', label: 'Tous' },
  { id: 'iphone', label: 'iPhone' },
  { id: 'samsung', label: 'Samsung' },
  { id: 'huawei', label: 'Huawei' },
  { id: 'xiaomi', label: 'Xiaomi' },
  { id: 'oppo', label: 'Oppo' },
];

export const PHONE_MODELS: PhoneModel[] = [
  { id: '1', name: 'iPhone 15 Pro', brand: BRANDS[1], subtitle: '4 tailles dispo', popular: true },
  { id: '2', name: 'iPhone 14', brand: BRANDS[1], subtitle: '3 tailles dispo' },
  { id: '3', name: 'iPhone 13', brand: BRANDS[1], subtitle: '3 tailles dispo' },
  { id: '4', name: 'iPhone 15 Pro Max', brand: BRANDS[1], subtitle: '2 tailles dispo', popular: true },
  { id: '5', name: 'Samsung S24 Ultra', brand: BRANDS[2], subtitle: '2 tailles dispo', popular: true },
  { id: '6', name: 'Samsung A54', brand: BRANDS[2], subtitle: '2 tailles dispo' },
  { id: '7', name: 'Samsung S23 FE', brand: BRANDS[2], subtitle: '2 tailles dispo' },
  { id: '8', name: 'Samsung A34', brand: BRANDS[2], subtitle: '2 tailles dispo' },
  { id: '9', name: 'Huawei P60 Pro', brand: BRANDS[3], subtitle: '2 tailles dispo' },
  { id: '10', name: 'Huawei Nova 12', brand: BRANDS[3], subtitle: '2 tailles dispo' },
  { id: '11', name: 'Xiaomi 14', brand: BRANDS[4], subtitle: '2 tailles dispo' },
  { id: '12', name: 'Xiaomi Redmi Note 13', brand: BRANDS[4], subtitle: '3 tailles dispo' },
  { id: '13', name: 'Oppo Reno 11', brand: BRANDS[5], subtitle: '2 tailles dispo' },
  { id: '14', name: 'Oppo Find X7', brand: BRANDS[5], subtitle: '2 tailles dispo', popular: true },
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

