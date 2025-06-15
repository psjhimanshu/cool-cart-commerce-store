
import Header from "@/components/Header";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ReturnsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Returns Policy</h1>
        <div className="prose max-w-none">
          <p>We want you to be completely satisfied with your purchase. If you are not satisfied, you may return the item(s) for a refund or exchange.</p>
          <h2 className="text-2xl font-bold mt-6 mb-2">Return Period</h2>
          <p>You have 30 calendar days to return an item from the date you received it.</p>
          <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
          <h2 className="text-2xl font-bold mt-6 mb-2">Refunds</h2>
          <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
          <p>If your return is approved, we will initiate a refund to your original method of payment.</p>
           <p>If you have any questions on how to return your item to us, <Link to="/support" className="text-primary hover:underline">contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
