
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    name: string;
    price: number;
    image_url: string;
    description: string;
    stock: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
}

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        products (
          name,
          price,
          image_url,
          description,
          stock
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching wishlist items:', error);
    } else {
      setWishlistItems(data || []);
    }
    setLoading(false);
  };

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please log in to add items to wishlist');
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .insert({ 
        user_id: user.id, 
        product_id: product.id 
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Item already in wishlist');
      } else {
        console.error('Error adding to wishlist:', error);
        toast.error('Failed to add item to wishlist');
      }
    } else {
      toast.success('Item added to wishlist!');
      fetchWishlistItems();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } else {
      toast.success('Item removed from wishlist');
      fetchWishlistItems();
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const clearWishlist = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing wishlist:', error);
    } else {
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [user]);

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    fetchWishlistItems
  };
};
