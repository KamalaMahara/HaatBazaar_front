import { useEffect, useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCartItems } from '../../../../store/cartSlice';
import logo from "../../../../assets/logo.png";



const Navbar = () => {
  const reduxToken = useAppSelector((store) => store.auth.user.token);
  const { items } = useAppSelector((store) => store.cart)
  const localStorageToken = localStorage.getItem("tokenHoYo");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const dispatch = useAppDispatch()

  useEffect(() => {
    setIsLoggedIn(!!reduxToken || !!localStorageToken);
    if (isLoggedIn) {
      dispatch(fetchCartItems())
    }
  }, [reduxToken, localStorageToken]);

  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' }
  ];

  return (
    <nav className="bg-[#111827] text-[#F9FAFB] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">

            <span className="text-2xl font-bold tracking-tight">
              <img src={logo} alt="Project Logo" className="h-22 w-auto object-contain" />

            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#F59E0B] transition-colors duration-200 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-gray-800 text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] w-48 lg:w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-[#F59E0B]" />
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3 pl-6">
              {isLoggedIn ? (
                <>
                  {/* Cart with border on the right */}
                  <div className="flex items-center space-x-4 border-r border-amber-700 pr-4 mr-6">
                    <div className="relative cursor-pointer hover:text-[#F59E0B] transition-colors">
                      <Link to='/my-cart'>
                        <ShoppingCart className="h-6 w-6" />
                        <span className="absolute -top-2 -right-2 bg-[#F59E0B] text-[#111827] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {items.length > 0 ? items.length : 0}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Logout button */}
                  <Link to='/logout'>
                    <button className="text-sm font-medium hover:text-[#F59E0B]">Logout</button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <button className="bg-[#F59E0B] text-[#111827] px-4 py-2 rounded-md text-sm font-bold hover:bg-opacity-90 transition-all">
                      Register
                    </button>
                  </Link>
                  <Link to='/login'>
                    <button className="text-sm font-medium hover:text-[#F59E0B]">Login</button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Search className="h-6 w-6 text-gray-400" />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#111827] border-t border-gray-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="block px-3 py-4 text-base font-medium border-b border-gray-800">
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-4">
            <button className="w-full text-center py-3 font-medium">Login</button>
            <button className="w-full bg-[#F59E0B] text-[#111827] py-3 rounded-md font-bold">Register</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;