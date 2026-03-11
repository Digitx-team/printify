import { getCachedProducts } from '@/lib/server-api';
import StoreClient from './StoreClient';

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function StorePage() {
  const products = await getCachedProducts();
  return <StoreClient initialProducts={products} />;
}
