
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import CheckoutForm from '@/components/CheckoutForm';

export const Cart = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Please log in to view your cart</p>
        </CardContent>
      </Card>
    );
  }

  if (showCheckout) {
    return (
      <CheckoutForm 
        onSuccess={handleCheckoutSuccess}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping Cart ({cartItems.length} items)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg">
              <img 
                src={item.products.image_url} 
                alt={item.products.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.products.name}</h4>
                <p className="text-lg font-bold">${item.products.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
            </div>
            <Button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
