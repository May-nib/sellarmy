// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabaseClient from '../lib/supabaseClient';

type Product = {
  id: string;
  name: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  original_price?: number | null;
  image_url?: string | null;
  category?: string | null;
  slug?: string | null;
  size?: string | null;
  manufactured_date?: string | null;
  material?: string | null;
  stock?: number | null;
  seller_id?: string | null;
};

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  created_at?: string | null;
  user?: { id: string; full_name?: string | null; avatar_url?: string | null } | null;
};

export default function ProductDetailPage(): any {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // local dummy defaults (used when DB returns no data)
  const DUMMY_PRODUCT: Product = {
    id: 'dummy-1',
    name: 'Elegant Leather Sneakers',
    description: 'Classic hand-stitched leather sneakers — comfortable, durable, and stylish for everyday wear.',
    price: 79.99,
    original_price: 99.99,
    image_url: '/images/placeholder.png',
    category: 'Shoes',
    size: 'M',
    manufactured_date: '2024-11-02',
    material: 'Full-grain leather',
    stock: 24,
  };

  const DUMMY_REVIEWS: Review[] = [
    { id: 'r1', rating: 5, comment: 'Amazing quality — exactly as described!', created_at: new Date().toISOString(), user: { id: 'u1', full_name: 'Amina', avatar_url: null } },
    { id: 'r2', rating: 4, comment: 'Very comfortable but ran a bit large for me.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), user: { id: 'u2', full_name: 'Bekele', avatar_url: null } },
    { id: 'r3', rating: 3, comment: 'Nice design but the sole wore out after a month.', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), user: { id: 'u3', full_name: 'Lydia', avatar_url: null } },
  ];

  const DUMMY_SIMILAR: Product[] = [
    { id: 's1', name: 'Casual Runner', price: 59.99, image_url: '/images/placeholder.png', category: 'Shoes' },
    { id: 's2', name: 'Classic Loafer', price: 89.99, image_url: '/images/placeholder.png', category: 'Shoes' },
    { id: 's3', name: 'Sporty Sneaker', price: 69.99, image_url: '/images/placeholder.png', category: 'Shoes' },
    { id: 's4', name: 'High Top Canvas', price: 49.99, image_url: '/images/placeholder.png', category: 'Shoes' },
  ];

  useEffect(() => {
    // If no id provided (rare), show dummy product immediately
    if (!id) {
      setProduct(DUMMY_PRODUCT);
      setReviews(DUMMY_REVIEWS);
      setSimilar(DUMMY_SIMILAR);
      setAvgRating(Math.round((DUMMY_REVIEWS.reduce((s, r) => s + r.rating, 0) / DUMMY_REVIEWS.length) * 10) / 10);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product
        const { data: prodData, error: prodErr } = await supabaseClient
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (prodErr) {
          console.warn('Product fetch failed, using dummy product', prodErr.message || prodErr);
          if (isMounted) setProduct(DUMMY_PRODUCT);
        } else {
          if (isMounted) setProduct(prodData || DUMMY_PRODUCT);
        }

        // Fetch reviews
        const { data: revData, error: revErr } = await supabaseClient
          .from('product_reviews')
          .select(`id, rating, comment, created_at, users ( id, full_name, avatar_url )`)
          .eq('product_id', id)
          .order('created_at', { ascending: false });

        if (revErr || !revData || revData.length === 0) {
          console.warn('No reviews from DB — falling back to dummy');
          if (isMounted) setReviews(DUMMY_REVIEWS);
        } else {
          const mapped: Review[] = (revData || []).map((r: any) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            user: r.users ? { id: r.users.id, full_name: r.users.full_name, avatar_url: r.users.avatar_url } : null,
          }));
          if (isMounted) setReviews(mapped.length ? mapped : DUMMY_REVIEWS);
        }

        // compute avg rating
        const useReviews = (revData && revData.length > 0) ? revData : DUMMY_REVIEWS;
        const avg = useReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) / useReviews.length;
        if (isMounted) setAvgRating(Math.round(avg * 10) / 10);

        // Similar products by category
        const categoryToQuery = (prodData && prodData.category) || DUMMY_PRODUCT.category;
        if (categoryToQuery) {
          const { data: simData, error: simErr } = await supabaseClient
            .from('products')
            .select('*')
            .eq('category', categoryToQuery)
            .neq('id', id)
            .limit(8);

          if (simErr || !simData || simData.length === 0) {
            if (isMounted) setSimilar(DUMMY_SIMILAR);
          } else {
            if (isMounted) setSimilar(simData);
          }
        }
      } catch (err: any) {
        console.error('ProductDetailPage error', err);
        if (isMounted) {
          setError(err?.message || 'Failed to load product');
          // fallback to dummy
          setProduct(DUMMY_PRODUCT);
          setReviews(DUMMY_REVIEWS);
          setSimilar(DUMMY_SIMILAR);
          setAvgRating(Math.round((DUMMY_REVIEWS.reduce((s, r) => s + r.rating, 0) / DUMMY_REVIEWS.length) * 10) / 10);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [id]);

  const primary = '#003303';

// In ProductDetailPage.tsx, update handleAddToCart
const handleAddToCart = () => {
  if (!product) return;
  const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
  cart.push({ 
    productId: product.id, 
    name: product.name, 
    price: product.price, 
    qty: quantity, 
    size: selectedSize,
    image_url: product.image_url,
    seller_id: product.seller_id 
  });
  localStorage.setItem('cart_v1', JSON.stringify(cart));
  alert(`Added ${quantity} × ${product.name}${selectedSize ? ` (Size ${selectedSize})` : ''} to cart`);
};


// In ProductDetailPage.tsx, update handleBuyNow
const handleBuyNow = () => {
  if (!product) return;
  
  // Create a cart item for the checkout with image URL
  const cartItem = {
    productId: product.id,
    name: product.name,
    price: product.price || 0,
    qty: quantity,
    size: selectedSize,
    image_url: product.image_url,
    seller_id: product.seller_id
  };
  
  // Store in localStorage for checkout page to access
  localStorage.setItem('direct_checkout', JSON.stringify([cartItem]));
  
  // Navigate to checkout
  navigate(`/checkout?product=${encodeURIComponent(product.id)}&qty=${quantity}${selectedSize ? `&size=${encodeURIComponent(selectedSize)}` : ''}`);
};

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    // quick local optimistic add (rename to avoid reserved-word errors)
    const newReview: Review = { id: Math.random().toString(36).slice(2, 9), rating: 5, comment: 'Great!', created_at: new Date().toISOString(), user: { id: 'anon', full_name: 'You' } };
    setReviews((s) => [newReview, ...s]);

    // recalc average safely using numeric math
    const totalBefore = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    const totalAfter = totalBefore + newReview.rating;
    const countAfter = reviews.length + 1;
    setAvgRating(Math.round((totalAfter / countAfter) * 10) / 10);

    // You can also attempt to POST to DB here (omitted for brevity)
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
        <p className="mt-4 text-gray-600">Loading product…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
      </div>
    </div>
  );

  // available sizes (example)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center space-x-6">
          <button 
            onClick={() => scrollToSection('description')}
            className="text-sm font-medium hover:text-green-800  bg-white transition-colors"
            style={{ color: primary }}
          >
            Description
          </button>
          <button 
            onClick={() => scrollToSection('reviews')}
            className="text-sm font-medium hover:text-green-800 bg-white transition-colors"
            style={{ color: primary }}
          >
            Reviews
          </button>
          <button 
            onClick={() => scrollToSection('similar')}
            className="text-sm font-medium hover:text-green-800 bg-white transition-colors"
            style={{ color: primary }}
          >
            Similar Products
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
         <h1 className="text-3xl pb-10 font-extrabold text-gray-900">{product.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* LEFT: Image + thumbnails */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm ">
              <img src={product.image_url || '/images/placeholder.png'} alt={product.name} className="w-full h-[420px] object-contain p-8 bg-white" />
            </div>

            {/* small thumbnails */}
            <div className="mt-4 flex items-center gap-3 ">
              {[0, 1, 2].map((i) => (
                <button key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm flex items-center justify-center" onClick={() => { /* could swap main image */ }}>
                  <img src={product.image_url || '/images/placeholder.png'} alt={`${product.name}-thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* product meta small */}
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <div><strong>Material:</strong> {product.material || 'Unknown'}</div>
              <div><strong>Manufactured:</strong> {product.manufactured_date ? new Date(product.manufactured_date).toLocaleDateString() : '—'}</div>
              <div><strong>Stock:</strong> {product.stock ?? '—'}</div>
            </div>
          </div>

          {/* RIGHT: Details */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{product.category || 'Uncategorized'}</p>

            <div className="mt-4 flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-900">${(product.price ?? 0).toFixed(2)}</div>
              {product.original_price && <div className="text-sm text-gray-500 line-through">${product.original_price.toFixed(2)}</div>}

              {avgRating != null && (
                <div className="ml-auto flex items-center gap-2">
                  <div className="text-sm text-gray-700">⭐ {avgRating}</div>
                  <div className="text-sm text-gray-500">· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                </div>
              )}
            </div>

            <div id="description" className="mt-6 text-gray-700  p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="whitespace-pre-line text-gray-700">{product.description || 'No description available.'}</p>
            </div>

            {/* Size & quantity selectors */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-black text-sm font-medium mb-1">Size</label>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 px-3 rounded-md border ${selectedSize === s ? 'border-2' : 'border-gray-200'}`}
                      style={{ borderColor: selectedSize === s ? primary : undefined }}
                      type="button"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-black text-sm font-medium mb-1">Quantity</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 rounded-md border" type="button">-</button>
                  <div className="px-3 py-2  text-black border rounded-md">{quantity}</div>
                  <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 rounded-md border" type="button">+</button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleBuyNow}
                className="py-3 px-6 rounded-lg font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ background: primary, color: '#fff' }}
                type="button"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="py-3 px-6 rounded-lg font-semibold border border-gray-200 shadow-sm"
                style={{ background: '#fff', color: primary }}
                type="button"
              >
                Add to Cart
              </button>
            </div>

            {/* product meta */}
            <div className="mt-6 text-sm text-gray-500">
              <div>SKU: {product.id}</div>
              <div>Manufactured: {product.manufactured_date ? new Date(product.manufactured_date).toLocaleDateString() : '—'}</div>
            </div>
          </div>
        </div>

        {/* Reviews Area */}
        <section id="reviews" className="mt-12">
          <h2 className="text-2xl text-black font-bold mb-4">Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-gray-600">No reviews yet. Be the first to review this product.</div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {r.user?.avatar_url ? (
                          <img src={r.user.avatar_url} alt={r.user.full_name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-gray-600">{r.user?.full_name?.[0] || 'U'}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{r.user?.full_name || 'Anonymous'}</div>
                            <div className="text-sm text-gray-400">{new Date(r.created_at || '').toLocaleString()}</div>
                          </div>
                          <div className="text-sm font-medium">⭐ {r.rating}</div>
                        </div>

                        {r.comment && <div className="mt-2 text-gray-700">{r.comment}</div>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Review form */}
            <aside className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Leave a Review</h3>
              <form onSubmit={submitReview} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Your Rating</label>
                  <select defaultValue={5} onChange={() => {}} className="w-full p-2 border rounded-md">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Comment</label>
                  <textarea placeholder="Share your experience" className="w-full p-2 border rounded-md" rows={4} />
                </div>

                <div>
                  <button type="submit" className="w-full py-2 rounded-md font-semibold" style={{ background: primary, color: '#fff' }}>
                    Post Review
                  </button>
                </div>
              </form>
            </aside>
          </div>
        </section>

        {/* Similar products */}
        <section id="similar" className="mt-16 bg-black/3 p-6 rounded-lg">
          <div className="flex  items-center justify-between mb-6">
            <h3 className="text-2xl text-black font-bold">Similar Products</h3>
            <div className="text-sm text-gray-500">More from {product.category || 'this category'}</div>
          </div>

          {similar.length === 0 ? (
            <div className="text-gray-600 bg-white">No similar products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {similar.map((p) => (
                <div key={p.id} className=" border rounded-lg overflow-hidden shadow-sm  hover:shadow-md transition">
                  <button onClick={() => navigate(`/product/${p.id}`)} className="w-full bg-white text-left" type="button">
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={p.image_url || '/images/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-semibold text-gray-500 truncate">{p.name}</div>
                      <div className="text-sm text-gray-500">${(p.price ?? 0).toFixed(2)}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}