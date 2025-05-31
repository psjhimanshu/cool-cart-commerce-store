
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  stock: number;
}

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (searchTerm: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            Search Results for "{query}"
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {products.length} result{products.length !== 1 ? 's' : ''}
            </p>
            
            {products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-600">No products found</h3>
                <p className="text-gray-500 mt-2">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="p-0">
                        <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <img 
                            src={product.image_url} 
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
                            onClick={(e) => toggleWishlist(product, e)}
                          >
                            <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary">${product.price}</span>
                          <Button 
                            onClick={(e) => handleAddToCart(product.id, e)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
