// src/pages/StorePage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabaseClient from '../lib/supabaseClient';

type User = {
  id: string;
  full_name: string;
  description?: string | null;
  profile_image?: string | null;
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
          .select('id, full_name')
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

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
      {/* Premium Store Header */}
      <header className="relative bg-gradient-to-b from-gray-900 to-black text-white py-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mix-blend-soft-light blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-full mix-blend-soft-light blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 border-4 border-white/20 rounded-full p-1">
              {user.profile_image ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={user.profile_image}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-5xl font-bold text-white border-4 border-white">
                  {user.full_name?.[0] || 'S'}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">{user.full_name}</h1>

              {user.description && (
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">{user.description}</p>
              )}

              {/* Social links */}
              <div className="mt-6 flex justify-center space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
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
          </div>
        </div>
      </header>

      {/* Store Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-3">
            <a href="#" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-amber-500 text-sm font-medium">
              All Products
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
              Best Sellers
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
              New Arrivals
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
              Collections
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Products Grid */}
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
                  <p className="text-gray-600 mt-2">Handpicked selection of quality products</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
                  <div className="relative">
                    <select id="sort" className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500">
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
                {products.map((product) => (
                  <div key={product.id} className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Product Image */}
                    <div className="relative h-60 overflow-hidden">
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
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{product.category || 'Premium Product'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${(product.price ?? 0).toFixed(2)}</p>
                          {product.original_price && (
                            <p className="text-sm text-gray-500 line-through">${product.original_price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-3">
                        <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-900 transition duration-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </button>
                        <button className="bg-amber-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-600 transition duration-300 flex items-center justify-center">
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
            </>
          )}

          {/* Newsletter */}
          <div className="mt-24 bg-gradient-to-r from-gray-800 to-black text-white rounded-2xl overflow-hidden p-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Subscribe to receive updates, access to exclusive deals, and be the first to know about new arrivals.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{user.full_name}&apos;s Store</h3>
              <p className="text-gray-400">
                Premium products curated with care and attention to detail.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-3 mt-0.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@{user.full_name?.toLowerCase().replace(/\s+/g, '') || 'store'}.com</span>
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