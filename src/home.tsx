import React from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const primary = "#003303"; // base theme
  const primaryLight = "#1a6b3f"; // lighter variant
  const primaryDark = "#002216"; // darker variant

const products = [
  { id: 1, name: "Best Running Shoe", price: "$69.99", img: "/images/shoe.jpg" },
  { id: 2, name: "Signature Perfume",     price: "$59.99", img: "/images/perfume.jpg" },
  { id: 3, name: "Everyday Shoe",      price: "$24.99", img: "/images/tshirt.jpg" },
  { id: 4, name: "Whey Protein Powder",   price: "$34.99", img: "/images/protein.jpg" }
];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(120deg,#071029 0%, #1a1733 50%, #103817ff 100%)", color: "white" }}>
      {/* Inline CSS for primary theme utilities (keeps things simple without touching tailwind config) */}
      <style>{`
        :root {
          --primary: ${primary};
          --primary-light: ${primaryLight};
          --primary-dark: ${primaryDark};
        }

        .btn-primary {
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          box-shadow: 0 10px 25px rgba(0, 51, 3, 0.15);
        }
        .btn-primary:hover { 
          background: linear-gradient(90deg, var(--primary-dark), var(--primary));
        }

        .accent-gradient {
          background: linear-gradient(90deg, var(--primary-light), var(--primary));
        }

        .chip-accent { background: linear-gradient(90deg, var(--primary), var(--primary-light)); }

        .product-badge { background: rgba(0,0,0,0.35); backdrop-filter: blur(6px); }

        /* subtle border using primary tint */
        .primary-border { border: 1px solid rgba(0,51,3,0.18); }

        .icon-circle { background: linear-gradient(90deg, var(--primary), var(--primary-light)); }

      `}</style>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
            <span className="font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ background: `-webkit-linear-gradient(90deg, ${primaryLight}, ${primary})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Sellarmy
          </h1>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#how-it-works" className="hover:opacity-90 text-white transition">How It Works</a>
          <a href="#benefits" className="hover:opacity-90 text-white transition">Benefits</a>
          <a href="#testimonials" className="hover:opacity-90 text-white transition">Success Stories</a>
        </div>
        <div>
          <Link 
            to="/store/reseller" 
            className="text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            <span className="btn-primary px-4 py-2 rounded-full">Create Your Shop</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Turn Your Influence Into <span style={{ background: `-webkit-linear-gradient(90deg, ${primaryLight}, ${primary})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>Income</span>
            <br />With Zero Risk
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-lg"> 
            Create your own online shop in minutes. No inventory, no upfront costs - just pure profit.
            Perfect for influencers, content creators, and anyone with a social following.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="btn-primary text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Your Shop Now
            </button>

            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-full transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <div className="flex items-center p-3 rounded-xl chip-accent">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: `${primary}` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Zero Risk</p>
                <p className="text-sm">No inventory required</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(6px)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ background: `${primaryLight}` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">5-Minute Setup</p>
                <p className="text-sm">Get started instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full mix-blend-soft-light blur-3xl opacity-30" style={{ background: `radial-gradient(circle at 20% 20%, ${primaryLight}, ${primary})` }}></div>

            <div className="relative product-badge rounded-3xl p-8 transform rotate-3 shadow-2xl primary-border">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
                    <span className="font-bold text-xl">S</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">@yourbrand</h3>
                    <p className="text-sm text-purple-200">Your Personal Shop</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item.id} className="rounded-xl p-4 primary-border" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    <img src={item.img} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h4 className="font-bold">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold" style={{ color: primaryLight }}>{item.price}</span>
                      <button className="text-white text-xs px-2 py-1 rounded" style={{ background: `linear-gradient(90deg, ${primary}, ${primaryLight})` }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}></div>
                  <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(90deg, #0b6b53, ${primaryLight})` }}></div>
                  <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(90deg, #0a8a66, #12b283)` }}></div>
                </div>
                <div className="text-sm text-purple-200">
                  <p>500+ shops created</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16" style={{ background: 'linear-gradient(180deg, rgba(26,19,51,0.25), rgba(7,16,41,0.25))' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Sellarmy Works</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">Creating your shop is easier than posting on Instagram</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Create Your Shop", 
                description: "Set up your personalized storefront in minutes with your branding",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              },
              { 
                title: "Curate Products", 
                description: "Select from thousands of products to feature in your store",
                icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              },
              { 
                title: "Earn Commissions", 
                description: "Get paid for every sale - we handle fulfillment and shipping",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            ].map((step, index) => (
              <div key={index} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,0,0,0.25)' }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 icon-circle" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-purple-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Zero-Risk Advantage</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">Why thousands of creators choose Sellarmy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  title: "No Inventory Needed",
                  description: "Never worry about storing products or managing stock. We handle everything for you."
                },
                {
                  title: "No Upfront Costs",
                  description: "Start completely free. Only pay when you make sales with our low commission rates."
                },
                {
                  title: "Instant Payouts",
                  description: "Get paid directly to your bank account as soon as you make a sale."
                },
                {
                  title: "Built-In Audience",
                  description: "Leverage our marketplace to get discovered by new customers."
                }
              ].map((benefit, index) => (
                <div key={index} className="flex">
                  <div className="mr-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-purple-200">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full mix-blend-soft-light blur-3xl opacity-20" style={{ background: `radial-gradient(circle at 20% 20%, #0b6b53, ${primaryLight})` }}></div>
              <div className="relative rounded-3xl p-8 shadow-2xl" style={{ background: 'linear-gradient(180deg,#271634, #3a1736)' }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Risk-Free Ecommerce</h3>
                  <p className="text-purple-200">Start earning with zero financial risk</p>
                </div>

                <div className="space-y-4">
                  {[
                    "No product sourcing",
                    "No inventory management",
                    "No shipping hassles",
                    "No upfront payments",
                    "No technical setup"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${primaryLight}` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link 
                    to="/store/reseller" 
                    className="inline-block text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    style={{ background: `linear-gradient(90deg, ${primary}, ${primaryLight})` }}
                  >
                    Start Earning Today
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-24" style={{ background: 'linear-gradient(180deg, rgba(7,16,41,0.25), rgba(26,19,51,0.25))' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creator Success Stories</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">See how influencers are making money with Sellarmy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Fashion Influencer",
                followers: "120K followers",
                quote: "I made $3,200 in my first month with zero effort. It's like magic!",
                avatar: `linear-gradient(90deg, ${primaryLight}, ${primary})`
              },
              {
                name: "Maya Rodriguez",
                role: "Beauty Content Creator",
                followers: "85K followers",
                quote: "My followers love shopping my recommendations without leaving Instagram.",
                avatar: `linear-gradient(90deg, #0b6b53, #0f815f)`
              },
              {
                name: "Jordan Smith",
                role: "Fitness Coach",
                followers: "45K followers",
                quote: "I finally have a real income stream from my passion without any risk.",
                avatar: `linear-gradient(90deg, #0a8a66, #0e6f58)`
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,0,0,0.2)' }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full" style={{ background: testimonial.avatar }}></div>
                  <div className="ml-4">
                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                    <p className="text-purple-200">{testimonial.role} • {testimonial.followers}</p>
                  </div>
                </div>
                <p className="text-lg italic">"{testimonial.quote}"</p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: primaryLight }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Zero-Risk Business?</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-10">
            Join thousands of creators who are already making money with their personalized Sellarmy shop
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/store/reseller" 
              className="text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              style={{ background: `linear-gradient(90deg, ${primary}, ${primaryLight})` }}
            >
              Create Your Free Shop
            </Link>

            <button className="bg-white text-indigo-900 font-semibold py-4 px-8 rounded-full transition flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Demo
            </button>
          </div>

          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Instagram", "TikTok", "YouTube", "Twitter"].map((platform, index) => (
              <div key={index} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-6 h-6 rounded-full" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}></div>
                  </div>
                  <span className="font-bold">{platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(90deg, ${primaryLight}, ${primary})` }}>
                <span className="font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ background: `-webkit-linear-gradient(90deg, ${primaryLight}, ${primary})`, WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Sellarmy
              </h1>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="hover:opacity-90 transition">Twitter</a>
              <a href="#" className="hover:opacity-90 transition">Instagram</a>
              <a href="#" className="hover:opacity-90 transition">Facebook</a>
            </div>
          </div>

          <div className="mt-12 pt-8 text-center text-purple-200">
            <p>© {new Date().getFullYear()} Sellarmy. The zero-risk ecommerce platform for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
