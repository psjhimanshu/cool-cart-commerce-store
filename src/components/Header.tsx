import { useState } from "react";
import { ShoppingCart, User, Search, Heart, LogIn, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const categories = [
  "Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty"
];

const Header = ({ searchQuery, setSearchQuery, onSearch }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/">
              <h1 className="text-xl md:text-2xl font-bold text-primary">ShopEase</h1>
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Categories Dropdown */}
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <div className="flex flex-col items-center cursor-pointer group select-none">
                    <Menu className="h-5 w-5 group-hover:text-primary" />
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-primary">Categories</span>
                  </div>
                </MenubarTrigger>
                <MenubarContent className="z-[100] bg-white border rounded shadow-lg w-48">
                  {categories.map((category) => (
                    <MenubarItem
                      key={category}
                      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                      className="cursor-pointer"
                    >
                      {category}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Customer Service Dropdown */}
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <div className="flex flex-col items-center cursor-pointer group select-none">
                    <span className="text-xs mt-1 text-gray-600 group-hover:text-primary">
                      Customer Service
                    </span>
                  </div>
                </MenubarTrigger>
                <MenubarContent className="z-[100] bg-white border rounded shadow-lg w-56">
                  <MenubarItem asChild>
                    <Link to="/support" className="w-full">Contact Us</Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/returns" className="w-full">Returns Policy</Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/shipping-info" className="w-full">Shipping Information</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Account */}
            <div className="relative">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <div className="flex flex-col items-center cursor-pointer group select-none">
                      <User className="h-5 w-5 group-hover:text-primary" />
                      <span className="text-xs mt-1 text-gray-600 group-hover:text-primary">Account</span>
                    </div>
                  </MenubarTrigger>
                  <MenubarContent>
                    {user ? (
                      <>
                        <MenubarItem disabled>{user.email}</MenubarItem>
                        <MenubarItem asChild>
                          <Link to="/admin">Admin Panel</Link>
                        </MenubarItem>
                        <MenubarItem onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </MenubarItem>
                      </>
                    ) : (
                      <>
                        <MenubarItem asChild>
                          <Link to="/login">Login</Link>
                        </MenubarItem>
                        <MenubarItem asChild>
                          <Link to="/signup">Sign Up</Link>
                        </MenubarItem>
                      </>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
            {/* Wishlist */}
            <Link to="/wishlist">
              <div className="flex flex-col items-center cursor-pointer group select-none">
                <Heart className="h-5 w-5 group-hover:text-primary" />
                <span className="text-xs mt-1 text-gray-600 group-hover:text-primary">Wishlist</span>
              </div>
            </Link>
            {/* Cart */}
            <Link to="/cart" className="relative">
              <div className="flex flex-col items-center cursor-pointer group select-none">
                <ShoppingCart className="h-5 w-5 group-hover:text-primary" />
                <span className="text-xs mt-1 text-gray-600 group-hover:text-primary">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <form onSubmit={onSearch} className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 border-t pt-4">
            <div className="flex flex-col space-y-2">
              {/* Categories */}
              <div className="pb-2 border-b">
                <h3 className="font-medium text-sm text-gray-500 mb-2">Categories</h3>
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`/category/${encodeURIComponent(category)}`}
                    className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>

              {/* Customer Service Section */}
              <div className="pb-2 border-b">
                <h3 className="font-medium text-sm text-gray-500 mb-2">Customer Service</h3>
                <Link
                  to="/support"
                  className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  to="/returns"
                  className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Returns Policy
                </Link>
                <Link
                  to="/shipping-info"
                  className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shipping Information
                </Link>
              </div>

              {/* Account */}
              <div className="pb-2 border-b">
                {user ? (
                  <>
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                    <Link
                      to="/admin"
                      className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left py-2 text-sm hover:bg-gray-50 rounded px-2"
                    >
                      <LogOut className="h-4 w-4 mr-2 inline" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2 inline" />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-2 text-sm hover:bg-gray-50 rounded px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-4 pt-2">
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
