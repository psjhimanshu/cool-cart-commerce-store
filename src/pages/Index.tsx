
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  stock: number;
}

const Index = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: "Electronics", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop", count: 0 },
    { id: 2, name: "Clothing", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop", count: 0 },
    { id: 3, name: "Home & Garden", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop", count: 0 },
    { id: 4, name: "Sports", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", count: 0 },
    { id: 5, name: "Books", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop", count: 0 },
    { id: 6, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop", count: 0 }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Email Verification Notice */}
      {user && !user.email_confirmed_at && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="container mx-auto">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please check your email and click the verification link to complete your account setup. 
                  <span className="font-medium"> Note: For development, email verification can be disabled in Supabase settings.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Welcome to ShopEase</h2>
          <p className="text-lg md:text-xl mb-8">Discover amazing products at unbeatable prices</p>
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
      <section id="categories" className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Shop by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardHeader className="text-center">
                  <div className="w-full h-40 md:h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{category.name}</CardTitle>
                  <CardDescription>{products.filter(p => p.category === category.name).length} products</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Featured Products</h3>
          {loading ? (
            <div className="text-center">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.slice(0, 6).map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="w-full h-48 md:h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-base md:text-lg">{product.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => toggleWishlist(product, e)}
                        >
                          <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                      <CardDescription className="text-sm text-gray-500 mb-2">
                        {product.category}
                      </CardDescription>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl md:text-2xl font-bold text-primary">${product.price}</span>
                        <Button 
                          onClick={(e) => handleAddToCart(product.id, e)}
                          className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                          disabled={product.stock === 0}
                          size="sm"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {product.stock} in stock
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 md:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-8">Subscribe to our newsletter for the latest deals and products</p>
          <form 
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for subscribing! (Feature coming soon)");
            }}
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 rounded text-black"
              required
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
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
                <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button className="hover:text-white text-left" onClick={() => handleCategoryClick("Electronics")}>Electronics</button></li>
                <li><button className="hover:text-white text-left" onClick={() => handleCategoryClick("Clothing")}>Clothing</button></li>
                <li><button className="hover:text-white text-left" onClick={() => handleCategoryClick("Home & Garden")}>Home & Garden</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/shipping-info" className="hover:text-white">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-300">
            <p>&copy; 2024 ShopEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
