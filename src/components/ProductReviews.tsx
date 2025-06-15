
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
}
interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    email: string | null;
    full_name: string | null;
  };
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*, profiles: user_id (email, full_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch reviews");
      setReviews([]);
    } else {
      setReviews(data as Review[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Log in to add a review");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      fetchReviews();
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Product Reviews</h2>
      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500 mb-6">No reviews for this product yet.</div>
      ) : (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">{r.profiles?.full_name ?? r.profiles?.email ?? "User"}</span>
                <span className="text-yellow-500">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
                <span className="text-xs text-gray-400 ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-700">{r.comment}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
          <div>
            <label className="font-medium">Rating:</label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`text-2xl ${rating >= num ? "text-yellow-500" : "text-gray-300"}`}
                  onClick={() => setRating(num)}
                  aria-label={`Rate ${num} star${num > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <Textarea
              value={comment}
              required
              minLength={5}
              maxLength={500}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              rows={3}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      ) : (
        <div className="text-gray-500 mt-2">Please log in to write a review.</div>
      )}
    </div>
  );
}
