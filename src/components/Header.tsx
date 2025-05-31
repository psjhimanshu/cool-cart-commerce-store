
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

const Header = ({ searchQuery, setSearchQuery, onSearch }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const categories = [
    "Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty"
  ];

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
          <div className="hidden md:flex items-center space-x-2">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Categories</MenubarTrigger>
                <MenubarContent>
                  {categories.map((category) => (
                    <MenubarItem key={category} asChild>
                      <Link to={`/category/${encodeURIComponent(category)}`}>
                        {category}
                      </Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
              
              {user ? (
                <MenubarMenu>
                  <MenubarTrigger>
                    <User className="h-4 w-4 mr-1" />
                    Account
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem disabled>
                      {user.email}
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </MenubarItem>
                    <MenubarItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <MenubarMenu>
                  <MenubarTrigger>
                    <LogIn className="h-4 w-4 mr-1" />
                    Account
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem asChild>
                      <Link to="/login">Login</Link>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Link to="/signup">Sign Up</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              )}
            </Menubar>

            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
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
