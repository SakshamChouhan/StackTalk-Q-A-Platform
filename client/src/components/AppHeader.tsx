import { Link } from "wouter";
import { useUser } from "@/context/UserContext";

export function AppHeader() {
  const { user, isLoggedIn, logout } = useUser();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2h10zm0 2H7v14h10V5zm-7 4h4a1 1 0 110 2h-4a1 1 0 110-2zm0 4h4a1 1 0 110 2h-4a1 1 0 110-2z"></path>
              </svg>
              <Link href={isLoggedIn ? "/questions" : "/"}>
                <a className="ml-2 text-lg font-semibold text-gray-900 cursor-pointer">StackTalk</a>
              </Link>
            </div>
            {isLoggedIn && (
              <nav className="ml-6 hidden md:flex space-x-8">
                <Link href="/questions">
                  <a className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                    All Questions
                  </a>
                </Link>
                <Link href="/ask">
                  <a className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                    Ask Question
                  </a>
                </Link>
                <Link href="/my-questions">
                  <a className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                    My Questions
                  </a>
                </Link>
              </nav>
            )}
          </div>
          {isLoggedIn && (
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <div className="flex items-center">
                  <div className="mr-3 text-sm font-medium text-gray-700">
                    <span>Logged in as </span>
                    <span className="font-semibold text-blue-600">{user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
