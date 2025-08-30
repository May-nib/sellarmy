// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabaseClient from '../lib/supabaseClient';

type OrderData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  payment_method: string;
  same_billing_address: boolean;
  notes?: string;
};

type ProductItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: string | null;
  image_url: string | null; 
  seller_id: string | null;
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);
  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: {
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
    },
    payment_method: 'card',
    same_billing_address: true,
  });

  useEffect(() => {
    const loadCartItems = async () => {
      // First check if we have a direct checkout item
      const directCheckout = localStorage.getItem('direct_checkout');
      
      if (directCheckout) {
        try {
          const directItems = JSON.parse(directCheckout);
          setCartItems(directItems);
          return;
        } catch (e) {
          console.error('Error parsing direct checkout:', e);
          localStorage.removeItem('direct_checkout');
        }
      }
      
      // Then check for query parameters (for backward compatibility)
      const searchParams = new URLSearchParams(location.search);
      const productId = searchParams.get('product');
      const quantity = parseInt(searchParams.get('qty') || '1');
      const size = searchParams.get('size');

      if (productId) {
        // Fetch product details
        const fetchProduct = async () => {
          const { data, error } = await supabaseClient
            .from('products')
            .select('*, seller_id')
            .eq('id', productId)
            .single();

          if (error) {
            console.error('Error fetching product:', error);
            setError('Product not found');
            return;
          }

          if (data) {
            setCartItems([{
              productId: data.id,
              name: data.name,
              price: data.price || 0,
              qty: quantity,
              size: size,
              image_url: data.image_url,
              seller_id: data.seller.id || null
            }]);
          }
        };

        await fetchProduct();
      } else {
        // Load from cart
        const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
        
        // If cart items don't have image_url or seller_id, we need to fetch them
        if (cart.length > 0 && (!cart[0].image_url || !cart[0].seller_id)) {
          const fetchCartProducts = async () => {
            const productIds = cart.map((item: any) => item.productId);
            const { data, error } = await supabaseClient
              .from('products')
              .select('id, image_url, seller_id')
              .in('id', productIds);
              
            if (!error && data) {
              // Enrich cart items with additional data
              const enrichedCart = cart.map((item: any) => {
                const productData = data.find(p => p.id === item.productId);
                return {
                  ...item,
                  image_url: productData?.image_url || null,
                  seller_id: productData?.seller_id || null
                };
              });
              
              setCartItems(enrichedCart);
            } else {
              setCartItems(cart);
            }
          };
          
          await fetchCartProducts();
        } else {
          setCartItems(cart);
        }
      }
    };

    loadCartItems();
  }, [location]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('shipping_')) {
      const field = name.replace('shipping_', '');
      setOrderData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: value
        }
      }));
    } else if (name.startsWith('billing_')) {
      const field = name.replace('billing_', '');
      setOrderData(prev => ({
        ...prev,
        billing_address: {
          ...(prev.billing_address || {
            street: '',
            city: '',
            state: '',
            zip_code: '',
            country: ''
          }),
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setOrderData(prev => ({ 
        ...prev, 
        [name]: checked,
        ...(name === 'same_billing_address' && !checked && !prev.billing_address ? {
          billing_address: {
            street: '',
            city: '',
            state: '',
            zip_code: '',
            country: ''
          }
        } : {})
      }));
    } else {
      setOrderData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.floor(Math.random() * 1000).toString(36);
    return `ORD-${timestamp}-${random}`.slice(0, 20);
  };

  // Update the handleSubmit function in CheckoutPage.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Calculate order total
    const totalAmount = calculateTotal();
    
    // For simplicity, using a fixed commission rate (10%)
    const commissionRate = 10;
    const totalCommission = totalAmount * (commissionRate / 100);

    // Try to get the current user, but don't require authentication
    /*let userId = null;
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      userId = user?.id || null;
    } catch (authError) {
      console.log('No authenticated user, proceeding as guest');
      // Continue without a user ID for guest checkout
    }
*/
    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        billing_address: orderData.same_billing_address ? 
          orderData.shipping_address : orderData.billing_address,
        total_amount: totalAmount,
        payment_method: orderData.payment_method,
        commission_rate: commissionRate,
        total_commission: totalCommission,
        notes: orderData.notes,
        status: 'pending',
        payment_status: 'pending'
        // Remove seller_id from orders table as it's not needed here
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items with the product's seller_id (not the buyer's id)
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_price: item.price,
      quantity: item.qty,
      size: item.size,
      image_url: item.image_url || null,
      item_commission: item.price * item.qty * (commissionRate / 100),
      seller_id: item.seller_id // This is the product's seller, not the buyer
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear cart and direct checkout
    localStorage.removeItem('cart_v1');
    localStorage.removeItem('direct_checkout');
    
    // Redirect to success page
    navigate(`/order-confirmation/${order.id}`);
  } catch (err: any) {
    console.error('Checkout error:', err);
    setError(err.message || 'Failed to process order. Please try again.');
  } finally {
    setLoading(false);
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-black font-bold text-center mb-6">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="sticky top-0 z-10 bg-black border-b shadow-sm mb-8" style={{backgroundColor:'#001601ff'}}>
        <h1 className="text-3xl text-white font-bold text-center mb-3 pt-3">Checkout</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-4">
                  <div className="flex items-center">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium text-black">{item.name}</p>
                      {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-medium text-black">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-b pb-3 border-gray-200">
              <div className="flex justify-between text-black text-xl font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>


          {/* Checkout Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-black font-semibold mb-4">Customer Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={orderData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="customer_email"
                  value={orderData.customer_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={orderData.customer_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="shipping_street"
                      value={orderData.shipping_address.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={orderData.shipping_address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={orderData.shipping_address.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="shipping_zip_code"
                      value={orderData.shipping_address.zip_code}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="shipping_country"
                      value={orderData.shipping_address.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="same_billing_address"
                  checked={orderData.same_billing_address}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Billing address same as shipping</label>
              </div>

              {!orderData.same_billing_address && (
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="billing_street"
                        value={orderData.billing_address?.street || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="billing_city"
                        value={orderData.billing_address?.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="billing_state"
                        value={orderData.billing_address?.state || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="billing_zip_code"
                        value={orderData.billing_address?.zip_code || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        name="billing_country"
                        value={orderData.billing_address?.country || ''}
                        placeholder="Enter your country"
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 text-black  rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200"                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  name="payment_method"
                  color="black"
                  value={orderData.payment_method}
                  onChange={handleInputChange}
                  className="w-full text-black px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="cash_on_delivery">Cash on Delivery</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={orderData.notes || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 text-black  rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}