export type Locale = 'fr' | 'ar' | 'en';

export const LOCALES: { id: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { id: 'fr', label: 'FR', dir: 'ltr' },
  { id: 'ar', label: 'عربي', dir: 'rtl' },
  { id: 'en', label: 'EN', dir: 'ltr' },
];

type TranslationKeys = {
  // Navbar
  nav_how: string;
  nav_models: string;
  nav_gallery: string;
  nav_contact: string;
  nav_cta: string;

  // Hero
  hero_badge: string;
  hero_line1: string;
  hero_line2: string;
  hero_line3: string;
  hero_sub: string;
  hero_cta: string;
  hero_secondary: string;
  hero_trust1: string;
  hero_trust2: string;
  hero_trust3: string;
  hero_pill1: string;
  hero_pill2: string;
  hero_pill3: string;

  // How it works
  how_label: string;
  how_title: string;
  step1_title: string;
  step1_desc: string;
  step2_title: string;
  step2_desc: string;
  step3_title: string;
  step3_desc: string;

  // Model selector
  model_label: string;
  model_title: string;
  model_sub: string;
  model_all: string;
  model_popular: string;
  model_not_found: string;
  model_contact: string;
  model_sizes: string;

  // Design upload
  upload_label: string;
  upload_title: string;
  upload_drag: string;
  upload_formats: string;
  upload_or: string;
  upload_browse: string;
  upload_describe: string;
  upload_hide_desc: string;
  upload_placeholder: string;
  upload_preview_label: string;
  upload_preview_note: string;
  upload_your_design: string;
  upload_here: string;
  upload_uploaded: string;
  upload_remove: string;

  // Gallery / Products
  gallery_label: string;
  gallery_title: string;
  gallery_sub: string;
  gallery_add_cart: string;
  gallery_view: string;
  gallery_order: string;
  gallery_price: string;
  gallery_from: string;

  // Testimonials
  testimonial_label: string;

  // CTA
  cta_title: string;
  cta_sub: string;
  cta_button: string;

  // Footer
  footer_tagline: string;
  footer_nav: string;
  footer_contact_title: string;
  footer_whatsapp: string;
  footer_country: string;
  footer_copyright: string;
  footer_home: string;
  footer_faq: string;

  // Cart
  cart_title: string;
  cart_empty: string;
  cart_total: string;
  cart_checkout: string;
  cart_remove: string;
  cart_continue: string;

  // Order
  order_title: string;
  order_name: string;
  order_phone: string;
  order_city: string;
  order_address: string;
  order_notes: string;
  order_submit: string;
  order_success: string;
  order_success_msg: string;
  order_close: string;

  // Product modal
  product_add: string;
  product_added: string;
  product_desc: string;
  product_category: string;
};

const translations: Record<Locale, TranslationKeys> = {
  fr: {
    nav_how: 'Comment ça marche',
    nav_models: 'Modèles',
    nav_gallery: 'Galerie',
    nav_contact: 'Contact',
    nav_cta: 'Créer ma coque',

    hero_badge: '✦ 100% PERSONNALISABLE',
    hero_line1: 'Votre Coque,',
    hero_line2: 'Votre Style,',
    hero_line3: 'Votre Art.',
    hero_sub: 'Créez des coques uniques pour votre téléphone. Uploadez votre design ou décrivez-nous votre idée, on s\'occupe du reste.',
    hero_cta: 'Créer ma coque →',
    hero_secondary: 'Voir les exemples',
    hero_trust1: 'Livraison 48h',
    hero_trust2: 'Qualité premium',
    hero_trust3: 'Paiement sécurisé',
    hero_pill1: '🎨 Design uploadé',
    hero_pill2: '📦 Commande confirmée',
    hero_pill3: '⭐ 4.9 / 5',

    how_label: 'Comment ça marche',
    how_title: 'Simple comme 1, 2, 3',
    step1_title: 'Choisissez votre modèle',
    step1_desc: 'Sélectionnez votre marque et modèle parmi 50+ références disponibles.',
    step2_title: 'Uploadez votre design',
    step2_desc: 'Importez votre fichier ou décrivez votre idée, on gère le reste.',
    step3_title: 'Recevez votre coque',
    step3_desc: 'Livraison partout en Algérie sous 48h après validation.',

    model_label: 'Compatibilité',
    model_title: 'Choisissez votre modèle',
    model_sub: 'Plus de 50 modèles disponibles. Trouvez le vôtre en un clic.',
    model_all: 'Tous',
    model_popular: '⭐ Populaire',
    model_not_found: 'Vous ne trouvez pas votre modèle ?',
    model_contact: 'Contactez-nous →',
    model_sizes: 'tailles dispo',

    upload_label: 'Personnalisation',
    upload_title: 'Uploadez votre design',
    upload_drag: 'Glissez votre design ici',
    upload_formats: 'PNG, JPG, PDF, max 20MB',
    upload_or: 'OU',
    upload_browse: 'Parcourir les fichiers',
    upload_describe: 'Vous préférez décrire votre design ?',
    upload_hide_desc: 'Masquer la description',
    upload_placeholder: 'Ex: fond bleu nuit avec des étoiles dorées et mon prénom en blanc...',
    upload_preview_label: 'APERÇU EN TEMPS RÉEL',
    upload_preview_note: 'Le rendu final peut légèrement varier selon l\'impression.',
    upload_your_design: 'Votre Design',
    upload_here: 'Ici',
    upload_uploaded: 'Design uploadé !',
    upload_remove: 'Supprimer',

    gallery_label: 'Nos Créations',
    gallery_title: 'Coques Populaires',
    gallery_sub: 'Découvrez nos designs les plus appréciés, commandez directement ou inspirez-vous.',
    gallery_add_cart: 'Ajouter au panier',
    gallery_view: 'Voir détails',
    gallery_order: 'Commander',
    gallery_price: 'DA',
    gallery_from: 'À partir de',

    testimonial_label: 'Ce qu\'ils disent',

    cta_title: 'Prêt à créer ?',
    cta_sub: 'Preview gratuite en 48h, paiement uniquement après validation',
    cta_button: 'Créer ma coque maintenant →',

    footer_tagline: 'Coques personnalisées, livrées partout en Algérie. Votre design, votre style, votre coque.',
    footer_nav: 'Navigation',
    footer_contact_title: 'Contact',
    footer_whatsapp: 'WhatsApp disponible',
    footer_country: 'Algérie 🇩🇿',
    footer_copyright: '© 2026 PRINTIFY, Tous droits réservés',
    footer_home: 'Accueil',
    footer_faq: 'FAQ',

    cart_title: 'Votre Panier',
    cart_empty: 'Votre panier est vide',
    cart_total: 'Total',
    cart_checkout: 'Passer la commande',
    cart_remove: 'Retirer',
    cart_continue: 'Continuer les achats',

    order_title: 'Finaliser la commande',
    order_name: 'Nom complet',
    order_phone: 'Téléphone',
    order_city: 'Wilaya',
    order_address: 'Adresse de livraison',
    order_notes: 'Notes (optionnel)',
    order_submit: 'Confirmer la commande',
    order_success: 'Commande confirmée ! 🎉',
    order_success_msg: 'Nous vous contacterons dans les 24h pour confirmer votre commande.',
    order_close: 'Fermer',

    product_add: 'Ajouter au panier',
    product_added: '✓ Ajouté',
    product_desc: 'Description',
    product_category: 'Catégorie',
  },

  ar: {
    nav_how: 'كيف يعمل',
    nav_models: 'الموديلات',
    nav_gallery: 'المعرض',
    nav_contact: 'اتصل بنا',
    nav_cta: 'صمم غطائك',

    hero_badge: '✦ قابل للتخصيص 100%',
    hero_line1: 'غطاؤك،',
    hero_line2: 'أسلوبك،',
    hero_line3: 'فنّك.',
    hero_sub: 'صمم أغطية هاتف فريدة. ارفع تصميمك أو صف لنا فكرتك, نحن نتكفل بالباقي.',
    hero_cta: '← صمم غطائك',
    hero_secondary: 'شاهد الأمثلة',
    hero_trust1: 'توصيل 48 ساعة',
    hero_trust2: 'جودة عالية',
    hero_trust3: 'دفع آمن',
    hero_pill1: '🎨 تم رفع التصميم',
    hero_pill2: '📦 تم تأكيد الطلب',
    hero_pill3: '⭐ 4.9 / 5',

    how_label: 'كيف يعمل',
    how_title: 'بسيط كـ 1، 2، 3',
    step1_title: 'اختر موديلك',
    step1_desc: 'اختر علامتك التجارية والموديل من بين 50+ مرجع متوفر.',
    step2_title: 'ارفع تصميمك',
    step2_desc: 'استورد ملفك أو صف فكرتك, نحن نتكفل بالباقي.',
    step3_title: 'استلم غطائك',
    step3_desc: 'توصيل لكل أنحاء الجزائر خلال 48 ساعة بعد التأكيد.',

    model_label: 'التوافق',
    model_title: 'اختر موديلك',
    model_sub: 'أكثر من 50 موديل متوفر. اعثر على هاتفك بنقرة واحدة.',
    model_all: 'الكل',
    model_popular: '⭐ شائع',
    model_not_found: 'لم تجد موديلك؟',
    model_contact: '← اتصل بنا',
    model_sizes: 'مقاسات متوفرة',

    upload_label: 'التخصيص',
    upload_title: 'ارفع تصميمك',
    upload_drag: 'اسحب تصميمك هنا',
    upload_formats: 'PNG, JPG, PDF, حد أقصى 20MB',
    upload_or: 'أو',
    upload_browse: 'تصفح الملفات',
    upload_describe: 'تفضل وصف تصميمك؟',
    upload_hide_desc: 'إخفاء الوصف',
    upload_placeholder: 'مثال: خلفية زرقاء داكنة مع نجوم ذهبية واسمي بالأبيض...',
    upload_preview_label: 'معاينة مباشرة',
    upload_preview_note: 'قد يختلف المنتج النهائي قليلاً حسب الطباعة.',
    upload_your_design: 'تصميمك',
    upload_here: 'هنا',
    upload_uploaded: 'تم رفع التصميم!',
    upload_remove: 'حذف',

    gallery_label: 'إبداعاتنا',
    gallery_title: 'الأغطية الشائعة',
    gallery_sub: 'اكتشف تصاميمنا الأكثر شعبية, اطلب مباشرة أو استلهم.',
    gallery_add_cart: 'أضف للسلة',
    gallery_view: 'عرض التفاصيل',
    gallery_order: 'اطلب الآن',
    gallery_price: 'دج',
    gallery_from: 'ابتداءً من',

    testimonial_label: 'ماذا يقولون',

    cta_title: 'مستعد للإبداع؟',
    cta_sub: 'معاينة مجانية خلال 48 ساعة, الدفع فقط بعد التأكيد',
    cta_button: '← صمم غطائك الآن',

    footer_tagline: 'أغطية مخصصة، توصيل لكل أنحاء الجزائر. تصميمك، أسلوبك، غطاؤك.',
    footer_nav: 'التصفح',
    footer_contact_title: 'اتصل بنا',
    footer_whatsapp: 'واتساب متوفر',
    footer_country: 'الجزائر 🇩🇿',
    footer_copyright: '© 2026 PRINTIFY, جميع الحقوق محفوظة',
    footer_home: 'الرئيسية',
    footer_faq: 'أسئلة شائعة',

    cart_title: 'سلة التسوق',
    cart_empty: 'سلتك فارغة',
    cart_total: 'المجموع',
    cart_checkout: 'إتمام الطلب',
    cart_remove: 'إزالة',
    cart_continue: 'متابعة التسوق',

    order_title: 'إتمام الطلب',
    order_name: 'الاسم الكامل',
    order_phone: 'رقم الهاتف',
    order_city: 'الولاية',
    order_address: 'عنوان التوصيل',
    order_notes: 'ملاحظات (اختياري)',
    order_submit: 'تأكيد الطلب',
    order_success: 'تم تأكيد الطلب! 🎉',
    order_success_msg: 'سنتواصل معك خلال 24 ساعة لتأكيد طلبك.',
    order_close: 'إغلاق',

    product_add: 'أضف للسلة',
    product_added: '✓ تمت الإضافة',
    product_desc: 'الوصف',
    product_category: 'الفئة',
  },

  en: {
    nav_how: 'How it works',
    nav_models: 'Models',
    nav_gallery: 'Gallery',
    nav_contact: 'Contact',
    nav_cta: 'Create my case',

    hero_badge: '✦ 100% CUSTOMIZABLE',
    hero_line1: 'Your Case,',
    hero_line2: 'Your Style,',
    hero_line3: 'Your Art.',
    hero_sub: 'Create unique phone cases. Upload your design or describe your idea, we handle the rest.',
    hero_cta: 'Create my case →',
    hero_secondary: 'See examples',
    hero_trust1: '48h delivery',
    hero_trust2: 'Premium quality',
    hero_trust3: 'Secure payment',
    hero_pill1: '🎨 Design uploaded',
    hero_pill2: '📦 Order confirmed',
    hero_pill3: '⭐ 4.9 / 5',

    how_label: 'How it works',
    how_title: 'Simple as 1, 2, 3',
    step1_title: 'Choose your model',
    step1_desc: 'Select your brand and model from 50+ available references.',
    step2_title: 'Upload your design',
    step2_desc: 'Import your file or describe your idea, we handle the rest.',
    step3_title: 'Receive your case',
    step3_desc: 'Delivery across Algeria within 48h after validation.',

    model_label: 'Compatibility',
    model_title: 'Choose your model',
    model_sub: 'Over 50 models available. Find yours in one click.',
    model_all: 'All',
    model_popular: '⭐ Popular',
    model_not_found: "Can't find your model?",
    model_contact: 'Contact us →',
    model_sizes: 'sizes available',

    upload_label: 'Customization',
    upload_title: 'Upload your design',
    upload_drag: 'Drag your design here',
    upload_formats: 'PNG, JPG, PDF, max 20MB',
    upload_or: 'OR',
    upload_browse: 'Browse files',
    upload_describe: 'Prefer to describe your design?',
    upload_hide_desc: 'Hide description',
    upload_placeholder: 'E.g.: dark blue background with golden stars and my name in white...',
    upload_preview_label: 'LIVE PREVIEW',
    upload_preview_note: 'Final result may slightly vary depending on printing.',
    upload_your_design: 'Your Design',
    upload_here: 'Here',
    upload_uploaded: 'Design uploaded!',
    upload_remove: 'Remove',

    gallery_label: 'Our Creations',
    gallery_title: 'Popular Cases',
    gallery_sub: 'Discover our most popular designs, order directly or get inspired.',
    gallery_add_cart: 'Add to cart',
    gallery_view: 'View details',
    gallery_order: 'Order now',
    gallery_price: 'DA',
    gallery_from: 'From',

    testimonial_label: 'What they say',

    cta_title: 'Ready to create?',
    cta_sub: 'Free preview in 48h, payment only after validation',
    cta_button: 'Create my case now →',

    footer_tagline: 'Custom phone cases, delivered across Algeria. Your design, your style, your case.',
    footer_nav: 'Navigation',
    footer_contact_title: 'Contact',
    footer_whatsapp: 'WhatsApp available',
    footer_country: 'Algeria 🇩🇿',
    footer_copyright: '© 2026 PRINTIFY, All rights reserved',
    footer_home: 'Home',
    footer_faq: 'FAQ',

    cart_title: 'Your Cart',
    cart_empty: 'Your cart is empty',
    cart_total: 'Total',
    cart_checkout: 'Checkout',
    cart_remove: 'Remove',
    cart_continue: 'Continue shopping',

    order_title: 'Complete your order',
    order_name: 'Full name',
    order_phone: 'Phone number',
    order_city: 'Wilaya (State)',
    order_address: 'Delivery address',
    order_notes: 'Notes (optional)',
    order_submit: 'Confirm order',
    order_success: 'Order confirmed! 🎉',
    order_success_msg: 'We will contact you within 24h to confirm your order.',
    order_close: 'Close',

    product_add: 'Add to cart',
    product_added: '✓ Added',
    product_desc: 'Description',
    product_category: 'Category',
  },
};

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale][key];
}

export default translations;
