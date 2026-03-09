export interface Brand {
  id: string;
  label: string;
}

export interface PhoneModel {
  id: string;
  name: string;
  brand: Brand;
  subtitle: string;
  popular?: boolean;
}

export interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'personalized' | 'artistic' | 'calligraphy' | 'nature' | 'geometric';
  description: string;
  popular?: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  rating: number;
}
