
import { ShoppingCart, User, Search, Heart, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [cartItems, setCartItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 1, name: "Electronics", image: "/placeholder.svg", count: 25 },
    { id: 2, name: "Clothing", image: "/placeholder.svg", count: 40 },
    { id: 3, name: "Home & Garden", image: "/placeholder.svg", count: 35 },
    { id: 4, name: "Sports", image: "/placeholder.svg", count: 20 },
    { id: 5, name: "Books", image: "/placeholder.svg", count: 15 },
    { id: 6, name: "Beauty", image: "/placeholder.svg", count: 30 }
  ];

  const featuredProducts = [
    { id: 1, name: "Wireless Headphones", price: 99.99, image: "/placeholder.svg", category: "Electronics" },
    { id: 2, name: "Summer Dress", price: 49.99, image: "/placeholder.svg", category: "Clothing" },
    { id: 3, name: "Coffee Maker", price: 129.99, image: "/placeholder.svg", category: "Home & Garden" },
    { id: 4, name: "Running Shoes", price: 79.99, image: "/placeholder.svg", category: "Sports" },
    { id: 5, name: "Skincare Set", price: 59.99, image: "/placeholder.svg", category: "Beauty" },
    { id: 6, name: "Best Seller Novel", price: 14.99, image: "/placeholder.svg", category: "Books" }
  ];

  const addToCart = (productName: string) => {
    setCartItems(prev => prev + 1);
    alert(`${productName} added to cart!`);
  };

  const handleCategoryClick = (categoryName: string) => {
    alert(`Browsing ${categoryName} category - this will be connected to a products page`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery} - this will be connected to search functionality`);
    }
  };

  const toggleWishlist = (productName: string) => {
    alert(`${productName} added to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">ShopEase</h1>
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => alert("Wishlist functionality - coming soon!")}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => alert("Cart functionality - coming soon!")}>
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to ShopEase</h2>
          <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Shop by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardHeader className="text-center">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                  <CardDescription>{category.count} products</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleWishlist(product.name)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-sm text-gray-500 mb-4">
                    {product.category}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    <Button 
                      onClick={() => addToCart(product.name)} 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-8">Subscribe to our newsletter for the latest deals and products</p>
          <form 
            className="flex max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Newsletter subscription - this will be connected to backend!");
            }}
          >
            <Input placeholder="Enter your email" className="bg-white text-black" />
            <Button type="submit" className="ml-2 bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">ShopEase</h4>
              <p className="text-gray-300">Your one-stop shop for amazing products at great prices.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/admin" className="hover:text-white">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white" onClick={() => handleCategoryClick("Electronics")}>Electronics</a></li>
                <li><a href="#" className="hover:text-white" onClick={() => handleCategoryClick("Clothing")}>Clothing</a></li>
                <li><a href="#" className="hover:text-white" onClick={() => handleCategoryClick("Home & Garden")}>Home & Garden</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 ShopEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
