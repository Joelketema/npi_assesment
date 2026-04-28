import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getHistory } from '../services/api';

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [sortOrder, setSortOrder] = useState('desc');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', debouncedSearchTerm, sortOrder],
    queryFn: () => getHistory(debouncedSearchTerm, sortOrder),
  });

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load history. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recent Lookups</h1>
          <p className="text-sm text-gray-500">Track and filter your search history.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by NPI or Name..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col max-h-[calc(100vh-280px)]">
        <div className="overflow-auto relative flex-1">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0">
            <thead className="bg-gray-50 sticky top-0 z-20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Query</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Provider Found</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Timestamp</th>
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
              ) : !isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No records found matching your criteria.
                  </td>
                </tr>
              ) : (
                <tr>
                   <td colSpan={3} className="px-6 py-12 text-center text-transparent">
                    Loading...
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
