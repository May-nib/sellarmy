// src/components/StoreClientFallback.tsx
'use client';
import { useEffect, useState } from 'react';

import { supabaseClient } from '../lib/supabaseClient';
import ProductCard from './ProductCard';

// Define TypeScript interfaces
interface User {
  id: string;
  full_name: string;
  description?: string | null;
  profile_image?: string | null;
  slug?: string | null;     // <-- optional
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category: string;
  title: string;
}

interface MappingRow {
  product_id: string;
  products: Product | null;
}

export default function StoreClientFallback() {
  //const pathname = usePathname() || '';
  
  const slugFromPath = decodeURIComponent(location.pathname.split('/').pop() || '').trim();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!slugFromPath) {
      setError('No reseller slug in URL');
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        // Fetch user by full_name (case-insensitive)
        const { data: userData, error: userError } = await supabaseClient
          .from('users')
          .select('*')
          .ilike('full_name', slugFromPath)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) {
          setError(`Store not found (no user matched "${slugFromPath}")`);
          setLoading(false);
          return;
        }
        if (!mounted) return;
        setUser(userData as User);

        // Fetch mapping and expanded products
        const { data: mapping, error: mappingError } = await supabaseClient
          .from('reseller_store')
          .select('product_id, products(*)')
          .eq('reseller_id', userData.id);

        if (mappingError) throw mappingError;

        // Parse products with proper typing
        const prods = (mapping as unknown as MappingRow[] || [])
          .filter((r): r is MappingRow & { products: Product } => r.products !== null)
          .map(r => r.products);
        
        if (!mounted) return;
        setProducts(prods);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message);
        setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [slugFromPath]);

  if (loading) return <div className="p-8">Loading store…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">Store not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-6 flex items-center gap-4">
          {user.profile_image ? (
            <img 
              src={user.profile_image} 
              alt={user.full_name} 
              className="w-20 h-20 object-cover rounded-full" 
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {user.full_name?.[0] || 'S'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.full_name}</h1>
            {user.description && <p className="text-sm text-gray-600">{user.description}</p>}
            <p className="text-xs text-gray-400 mt-1">{products.length} items</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {products.length === 0 ? (
          <div className="text-gray-500">No products added yet.</div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}