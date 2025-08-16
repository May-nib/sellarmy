import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="font-bold text-xl">S</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            Sellarmy
          </h1>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#how-it-works" className="hover:text-amber-300 transition">How It Works</a>
          <a href="#benefits" className="hover:text-amber-300 transition">Benefits</a>
          <a href="#testimonials" className="hover:text-amber-300 transition">Success Stories</a>
        </div>
        <div>
          <Link 
            to="/store/reseller" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
          >
            Create Your Shop
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Turn Your Influence Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">Income</span> 
            <br />With Zero Risk
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-lg">
            Create your own online shop in minutes. No inventory, no upfront costs - just pure profit.
            Perfect for influencers, content creators, and anyone with a social following.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30 flex items-center justify-center">
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
            <div className="flex items-center bg-white/10 backdrop-blur-lg p-3 rounded-xl">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Zero Risk</p>
                <p className="text-sm">No inventory required</p>
              </div>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-lg p-3 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
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
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mix-blend-soft-light blur-3xl opacity-30"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-lg border border-white/10 rounded-3xl p-8 transform rotate-3 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-xl">S</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">@yourbrand</h3>
                    <p className="text-sm text-purple-200">Your Personal Shop</p>
                  </div>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
                    <div className="bg-gray-700 rounded-lg w-full h-32 mb-3"></div>
                    <h4 className="font-bold">Product {item}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-amber-400 font-bold">$49.99</span>
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
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
      <div id="how-it-works" className="py-16 bg-gradient-to-b from-purple-900/50 to-indigo-900/50">
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
              <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10 transform transition hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
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
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
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
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mix-blend-soft-light blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-purple-800 to-pink-800 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4">
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
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
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
                    className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30"
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
      <div id="testimonials" className="py-24 bg-gradient-to-b from-indigo-900/50 to-purple-900/50">
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
                avatar: "bg-gradient-to-r from-amber-400 to-orange-500"
              },
              {
                name: "Maya Rodriguez",
                role: "Beauty Content Creator",
                followers: "85K followers",
                quote: "My followers love shopping my recommendations without leaving Instagram.",
                avatar: "bg-gradient-to-r from-pink-500 to-rose-500"
              },
              {
                name: "Jordan Smith",
                role: "Fitness Coach",
                followers: "45K followers",
                quote: "I finally have a real income stream from my passion without any risk.",
                avatar: "bg-gradient-to-r from-blue-500 to-indigo-500"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${testimonial.avatar}`}></div>
                  <div className="ml-4">
                    <h3 className="font-bold text-xl">{testimonial.name}</h3>
                    <p className="text-purple-200">{testimonial.role} • {testimonial.followers}</p>
                  </div>
                </div>
                <p className="text-lg italic">"{testimonial.quote}"</p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-amber-500/30 flex items-center justify-center"
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
              <div key={index} className="bg-white/10 backdrop-blur-lg p-4 rounded-xl">
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                  </div>
                  <span className="font-bold">{platform}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="font-bold text-xl">S</span>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                Sellarmy
              </h1>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="hover:text-amber-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-amber-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="hover:text-amber-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-purple-200">
            <p>© {new Date().getFullYear()} Sellarmy. The zero-risk ecommerce platform for creators.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}