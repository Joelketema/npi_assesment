import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
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
function ProviderCard({ provider }: { provider: any }) {
  const { number, basic, addresses, taxonomies } = provider;
  const name = `${basic.first_name || ''} ${basic.last_name || basic.organization_name || ''}`.trim();
  const credentials = basic.credential || 'N/A';
  const specialty = taxonomies?.[0]?.desc || 'General Practice';
  const state = addresses?.[0]?.state || 'Unknown';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
            NPI: {number}
          </span>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 font-medium">{credentials}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
            {state}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {specialty}
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  // Since we want to trigger search on button click, we use useMutation
  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await axios.post(`${API_BASE_URL}/api/search`, { query: searchQuery });
      return response.data;
    },
    onSuccess: (data) => {
      setResults(data);
      setHasSearched(true);
      toast.success(`Found ${data.length} provider(s)`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Search failed';
      if (error.response?.status !== 404) {
        toast.error(message);
      }
      setResults([]);
      setHasSearched(true);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || searchMutation.isPending) return;

    // Validation: If it's numeric, it must be 10 digits
    const isNumeric = /^\d+$/.test(trimmedQuery);
    if (isNumeric && trimmedQuery.length !== 10) {
      toast.error('Invalid NPI format', {
        description: 'NPI numbers must be exactly 10 digits long.',
      });
      return;
    }

    searchMutation.mutate(trimmedQuery);
  };

  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          Find a Provider
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Verify credentials, location, and specialties by NPI number or name.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="NPI number, first name, or last name..."
            className="block w-full pl-11 pr-32 py-4 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
          />
          <div className="absolute inset-y-2 right-2 flex items-center">
            <button
              type="submit"
              disabled={searchMutation.isPending}
              className="h-full px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </form>
        <p className="mt-3 text-xs text-center text-gray-400">
          Tip: NPI numbers are 10 digits long.
        </p>
      </div>

      <div className="space-y-6">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((provider) => (
              <ProviderCard key={provider.number} provider={provider} />
            ))}
          </div>
        ) : hasSearched && !searchMutation.isPending ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or checking the NPI number.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HistoryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/api/history`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load history. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Recent Lookups</h1>
        <span className="text-sm text-gray-500">{data?.length || 0} records found</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Found</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.length > 0 ? (
                data.map((item: any) => {
                  const result = JSON.parse(item.result);
                  const providerName = result.basic 
                    ? `${result.basic.first_name || ''} ${result.basic.last_name || result.basic.organization_name || ''}`.trim()
                    : result.error || 'Unknown';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.query}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {providerName}
                        {result.basic?.credential && (
                          <span className="ml-2 text-gray-400 text-xs">{result.basic.credential}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No history found yet. Start searching to see records here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
