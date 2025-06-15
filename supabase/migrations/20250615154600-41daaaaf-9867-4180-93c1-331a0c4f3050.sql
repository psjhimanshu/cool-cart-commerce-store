
-- Create a table for product reviews
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to select reviews for all products (publicly visible)
CREATE POLICY "Allow select for all" ON public.product_reviews FOR SELECT USING (true);

-- Allow users to insert their own review (must be logged in)
CREATE POLICY "Users can insert their reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews ONLY
CREATE POLICY "Users can update their reviews" ON public.product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own reviews ONLY
CREATE POLICY "Users can delete their reviews" ON public.product_reviews FOR DELETE USING (auth.uid() = user_id);
