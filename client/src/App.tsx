import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import React, { useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

// Components
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Search', path: '/' },
    { name: 'History', path: '/history' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">ProviderCheck</span>
            </div>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

// Pages
function SearchPage() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Healthcare Provider Lookup
        </h1>
        <p className="mt-3 text-xl text-gray-500">
          Verify credentials, location, and specialties using the NPPES Registry.
        </p>
      </div>
      {/* Search Input will go here */}
    </div>
  );
}

function HistoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recent Lookups</h1>
      <p className="text-gray-500 italic">History dashboard coming soon...</p>
    </div>
  );
}

// Main App
function App() {
  const { isError, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error('Backend Offline', {
        description: 'Check your server connection.',
        duration: Infinity,
      });
    }
  }, [isError]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Initializing system...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
