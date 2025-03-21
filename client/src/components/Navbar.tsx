import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { useUser } from '@/context/UserContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { username } = useUser();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!username) return null;

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/questions">
                <a className="text-xl font-bold text-primary">StackTalk</a>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link href="/questions">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === '/questions' ? 'text-primary' : 'text-textSecondary'
                } hover:bg-primary hover:bg-opacity-10 transition`}>
                  All Questions
                </a>
              </Link>
              <Link href="/my-questions">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === '/my-questions' ? 'text-primary' : 'text-textSecondary'
                } hover:bg-primary hover:bg-opacity-10 transition`}>
                  My Questions
                </a>
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center">
              <span className="text-sm font-medium text-textSecondary mr-2">{username}</span>
              <button className="inline-flex items-center justify-center p-2 rounded-full bg-background text-primary hover:bg-primary hover:bg-opacity-10 transition">
                <span className="material-icons">person</span>
              </button>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              type="button" 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-primary hover:bg-opacity-10 focus:outline-none"
            >
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/questions">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === '/questions' ? 'text-primary' : 'text-textSecondary'
              } hover:bg-primary hover:bg-opacity-10`}>
                All Questions
              </a>
            </Link>
            <Link href="/my-questions">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === '/my-questions' ? 'text-primary' : 'text-textSecondary'
              } hover:bg-primary hover:bg-opacity-10`}>
                My Questions
              </a>
            </Link>
            <div className="flex items-center px-3 py-2">
              <span className="text-sm font-medium text-textSecondary">{username}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
