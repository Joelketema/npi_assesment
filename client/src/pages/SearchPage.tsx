import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { searchProviders } from '../services/api';
import { ProviderCard } from '../components/ProviderCard';

export function SearchPage() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const searchMutation = useMutation({
    mutationFn: searchProviders,
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

      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-420px)] pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
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
