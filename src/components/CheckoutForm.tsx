
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutForm = ({ onSuccess, onCancel }: CheckoutFormProps) => {
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingAddress.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          total_amount: totalPrice,
          status: 'pending',
          payment_method: paymentMethod,
          shipping_address: shippingAddress
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();
      
      toast.success(`Order placed successfully! ${paymentMethod === 'cod' ? 'Pay on delivery.' : ''}`);
      onSuccess();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    }
    setIsProcessing(false);
  };

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <Button onClick={onCancel} className="mt-4">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.products.image_url} 
                    alt={item.products.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.products.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.products.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={shippingAddress.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={shippingAddress.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={shippingAddress.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete address"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on Delivery (COD)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online">Online Payment (Coming Soon)</Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === 'cod' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Cash on Delivery:</strong> Pay when your order is delivered to your doorstep. 
                Additional charges may apply based on your location.
              </p>
            </div>
          )}
          
          {paymentMethod === 'online' && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                Online payment options will be available soon. For now, please use Cash on Delivery.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePlaceOrder}
          disabled={isProcessing || paymentMethod === 'online'}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? 'Processing...' : `Place Order (${paymentMethod.toUpperCase()})`}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutForm;
