import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import CartSlideOver from "../cart/CartSlideOver";

export default function ScrollAwareHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { items } = useCart();
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 shadow-sm ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="px-4 h-16 flex items-center justify-between">
            {/* Left: Logo */}
            <Link to="/" className="text-xl font-bold text-primary">
              TRYB3-CHAW
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <Link
                to={user ? "/profile" : "/auth/login"}
                className="flex items-center gap-2"
              >
                <UserIcon className="w-6 h-6" />
                <span className="text-sm hidden sm:block">
                  {user ? user.name : "Sign In"}
                </span>
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingBagIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${
              isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className={`fixed right-0 top-16 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4 space-y-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <Link
                  to="/restaurants"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              {/* User Section */}
              {user && (
                <div className="border-t border-gray-100 pt-4 space-y-1">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-16 flex items-center justify-between gap-4">
              <Link to="/" className="text-2xl font-bold text-primary shrink-0">
                TRYB3-CHAW
              </Link>

              <div className="flex-1 hidden max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search restaurants or dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-primary text-sm"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <nav className="flex items-center gap-6">
                <Link
                  to="/restaurants"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Restaurants
                </Link>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:text-primary transition-colors"
                >
                  <ShoppingBagIcon className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <Link
                  to={user ? "/profile" : "/auth/login"}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                  <span className="text-sm">
                    {user ? user.name : "Sign In"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Slide Over */}
      <CartSlideOver open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
