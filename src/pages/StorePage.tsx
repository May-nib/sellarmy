// src/pages/StorePage.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import supabaseClient from '../lib/supabaseClient';

type User = {
  id: string;
  full_name: string;
  business_name?: string | null;
  about?: string | null;
  avatar_url?: string | null;
  social_links?: string | null;
  slug?: string | null;
};

type Product = {
  id: string;
  name: string;
  title?: string;
  description?: string | null;
  price?: number | null;
  original_price?: number | null;
  image_url?: string | null;
  category?: string | null;
  slug?: string | null;
};

export default function StorePage(): any{
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socialLinks = [
    { type: 'instagram', url: 'https://instagram.com' },
    { type: 'twitter', url: 'https://twitter.com' },
    { type: 'facebook', url: 'https://facebook.com' },
    { type: 'pinterest', url: 'https://pinterest.com' },
  ];

  // Theme colors (do not change logic)
  const primary = '#003303';
  const primaryLight = '#1a6b3f';
  const primaryDark = '#002216';

  useEffect(() => {
    let isMounted = true;

    const loadStore = async () => {
      setLoading(true);
      setError(null);
      setUser(null);
      setProducts([]);

      const rawSlug = (slug || '').trim();
      if (!rawSlug) {
        setError('Store identifier is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch user by slug
        const { data: userData, error: userError } = await supabaseClient
          .from('users')
          .select('id, full_name, business_name, about, avatar_url')
          .ilike('full_name', `%${rawSlug}%`)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) {
          setError(`Store "${rawSlug}" not found`);
          setLoading(false);
          return;
        }

        if (isMounted) setUser(userData);

        // Fetch products
        const { data: mappingData, error: mappingError } = await supabaseClient
          .from('reseller_store')
          .select('product_id, products(*)')
          .eq('reseller_id', userData.id);

        if (mappingError) throw mappingError;

        let productList: Product[] = [];
        if (mappingData && mappingData.length > 0) {
          productList = mappingData
            .filter((item: any) => item.products)
            .map((item: any) => item.products);
        }

        if (isMounted) {
          setProducts(productList);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('StorePage error', err);
          setError(err?.message || 'An unexpected error occurred');
          setLoading(false);
        }
      }
    };

    loadStore();
    return () => { isMounted = false; };
  }, [slug]);

  // small utility styles are injected here so we don't touch logic or your tailwind config
  const styleBlock = `
    :root{ --primary: ${primary}; --primary-light: ${primaryLight}; --primary-dark: ${primaryDark}; }
    .accent-gradient { background: linear-gradient(90deg, var(--primary), var(--primary-light)); }
    .hed{
    background: #003303; 
    }
    .accent-btn { 
      background: #003303; 
      color: #fff; 
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .accent-btn:hover { 
      background: linear-gradient(90deg, var(--primary-dark), var(--primary));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 51, 3, 0.2);
    }
    .secondary-btn {
      background: #f8f9fa;
      color: #333;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .secondary-btn:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    .accent-select:focus { outline: none; box-shadow: 0 0 0 4px rgba(0,51,3,0.12); border-color: var(--primary) !important; }
    .accent-circle { background: linear-gradient(90deg, var(--primary-light), var(--primary)); }
    .icon-accent { color: var(--primary-light); }
    .no-scrollbar::-webkit-scrollbar{display:none}
    .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .profile-shadow {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
    .nav-link {
      position: relative;
      padding-bottom: 8px;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: ${primary};
      transition: width 0.3s ease;
    }
    .nav-link:hover::after,
    .nav-link.active::after {
      width: 100%;
    }
  `;

  // Collections derived from fetched products (UI only)
  const collections = [
    { id: 'editors', title: "Editor's Picks", items: products.slice(0,4) },
    { id: 'trending', title: 'Trending Now', items: products.slice(0,6).reverse() },
    { id: 'new', title: 'Seasonal Picks', items: products.slice(-1) }
  ];

  // UI refs + handlers for collections carousel (pure UI, no data changes)
  const collectionsRef = useRef<HTMLDivElement | null>(null);
  const scrollCollections = (dir: 'left' | 'right') => {
    const el = collectionsRef.current;
    if (!el) return;
    const amount = Math.max(260, el.clientWidth * 0.7);
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }; 

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <style>{styleBlock}</style>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: primary, borderTopColor: 'transparent' }}
            />
            <p className="mt-4 text-gray-600">Loading store...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <style>{styleBlock}</style>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Store</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render store not found
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <style>{styleBlock}</style>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Store Not Found</h2>
            <p className="text-gray-600">We couldn't find the store you're looking for</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <style>{styleBlock}</style>
      
      {/* Premium Store Header with Banner */}
      <header className="relative text-white overflow-hidden" style={{ background: '#001101ff' }}>
        {/* Banner Image */}
        <div className="h-40 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-80 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80" 
            alt="Store Banner" 
            className="w-full h-full object-cover"
          />
          
          {/* Profile Image positioned on top of banner */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
            <div className="profile-shadow rounded-full p-1 bg-white">
              {user.avatar_url ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={user.avatar_url || '/images/avatar-placeholder.png'}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white">
                  {user.full_name?.[0] || 'S'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{user.business_name}</h1>
          {user.about && (
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{user.about}</p>
          )}

          {/* Social links */}
          <div className="flex justify-center space-x-4 mt-6">
            {socialLinks.map((link) => (
              <a
                key={link.type}
                href={link.url}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                aria-label={link.type}
                target="_blank"
                rel="noreferrer"
              >
                {link.type === 'instagram' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                )}
                {link.type === 'twitter' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                )}
                {link.type === 'facebook' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                )}
                {link.type === 'pinterest' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Store Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-10 py-5">
            <a href="#" className="nav-link active text-gray-900 font-medium">
              All Products
            </a>
            <a href="#" className="nav-link text-gray-500 hover:text-gray-700 font-medium">
              Best Sellers
            </a>
            <a href="#" className="nav-link text-gray-500 hover:text-gray-700 font-medium">
              New Arrivals
            </a>
            <a href="#" className="nav-link text-gray-500 hover:text-gray-700 font-medium">
              Collections
            </a>
            <a href="#" className="nav-link text-gray-500 hover:text-gray-700 font-medium">
              On Sale
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="mt-2 text-xl font-bold text-gray-900">No products yet</h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                This store hasn't added any products yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Collections */}
              <div className="mb-16 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Curated Collections</h3>
                    <p className="text-gray-600 mt-1">Handpicked selections for every style</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button aria-label="Scroll left" onClick={() => scrollCollections('left')} className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition">
                      <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button aria-label="Scroll right" onClick={() => scrollCollections('right')} className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition">
                      <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div ref={collectionsRef} className="flex space-x-6 overflow-x-auto no-scrollbar py-4 px-2 snap-x snap-mandatory scroll-smooth">
                    {collections.map((col) => (
                      <div key={col.id} className="snap-start min-w-[300px] md:min-w-[360px] lg:min-w-[420px] bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-[1.02] cursor-pointer group border border-gray-100">
                        <div className="relative h-52 md:h-60 lg:h-72">
                          {col.items && col.items.length > 0 ? (
                            <img src={col.items[0].image_url || '/images/placeholder.png'} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">No image</div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90"></div>

                          <div className="absolute left-6 bottom-6">
                            <h4 className="text-xl font-bold text-white">{col.title}</h4>
                            <p className="text-sm text-white/90 mt-1">{col.items.length} items • curated</p>
                          </div>
                          
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-sm font-medium" style={{ color: primary }}>View All</span>
                          </div>
                        </div>

                        <div className="p-5 bg-white">
                          <div className="flex -space-x-3">
                            {col.items.slice(0,4).map((it) => (
                              <div key={it.id} className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-sm transform hover:scale-110 transition-transform">
                                <img src={it.image_url || '/images/placeholder.png'} alt={it.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {col.items.length > 4 && (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{col.items.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
                    <p className="text-gray-600 mt-2">Handpicked selection of quality products</p>
                  </div>
                  <div className="flex items-center mt-4 md:mt-0">
                    <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                    <div className="relative">
                      <select id="sort" className="accent-select block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-gray-400">
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest Arrivals</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 animate-fade-in"
                      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                    >
                      {/* Product Image */}
                      <div className="relative h-72 overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-t-xl flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        {product.original_price && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            SAVE {Math.round((1 - (product.price || 0) / (product.original_price || 1)) * 100)}%
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity"></div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                            <p className="text-gray-600 text-sm mt-1">{product.category || 'Premium Product'}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              {product.original_price && (
                                <p className="text-sm text-gray-500 line-through mr-2">${product.original_price.toFixed(2)}</p>
                              )}
                              <p className="text-lg font-bold text-gray-900">${(product.price ?? 0).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex space-x-3">
                          <button className="secondary-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Add to Cart
                          </button>
                          <button
                            onClick={() => window.open(`/#/product/${product.id}`, '_blank', 'noopener,noreferrer')}
                            className="accent-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              {/* Promotional Banner */}
              <div className="mt-20 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex flex-col md:flex-row">
                  <div className="p-10 md:w-2/3">
                    <h2 className="text-3xl font-bold mb-4">Join Our Exclusive Membership</h2>
                    <p className="text-gray-300 mb-6 max-w-md">
                      Get early access to new products, special discounts, and personalized recommendations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                        Subscribe
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block md:w-1/3 relative">
                    <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                      alt="Exclusive Membership" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{user.business_name}&apos;s Store</h3>
              <p className="text-gray-400 mb-4">
                Premium products curated with care and attention to detail.
              </p>
              <div className="flex space-x-4">
                {socialLinks.slice(0, 3).map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={link.type}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.type === 'instagram' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Information</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 icon-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+251900010203</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 icon-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@{user.full_name?.toLowerCase().replace(/\s+/g, '') || 'store'}.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 icon-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Addis Ababa, Ethiopia</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {user.full_name}&apos;s Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}