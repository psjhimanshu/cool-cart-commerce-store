
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

const WishlistPage = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: string) => {
    addToCart(productId);
    removeFromWishlist(productId);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8">Add some items to your wishlist to see them here</p>
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <img 
                        src={item.products.image_url} 
                        alt={item.products.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{item.products.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.products.description}
                    </CardDescription>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-primary">${item.products.price}</span>
                      <span className="text-sm text-gray-500">{item.products.stock} in stock</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleMoveToCart(item.product_id)}
                        className="flex-1"
                        disabled={item.products.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.products.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
