
import Header from "@/components/Header";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ShippingInfoPage = () => {
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
        <h1 className="text-3xl font-bold mb-4">Shipping Information</h1>
        <div className="prose max-w-none">
          <p>We offer various shipping options to meet your needs. Here are the details of our shipping policy.</p>
          <h2 className="text-2xl font-bold mt-6 mb-2">Domestic Shipping</h2>
          <p>All domestic orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <h2 className="text-2xl font-bold mt-6 mb-2">International Shipping</h2>
          <p>We currently do not offer international shipping.</p>
          <h2 className="text-2xl font-bold mt-6 mb-2">Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>
          <p>If you have any questions, please <Link to="/support" className="text-primary hover:underline">contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;
