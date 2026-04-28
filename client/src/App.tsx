import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Toaster, toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const { isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error('Server unavailable', {
        description: 'Could not connect to the backend server. Please ensure it is running.',
        duration: Infinity,
      });
    }
  }, [isError]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Provider Verification
        </h1>
        <p className="text-gray-500 mb-6">
          NPPES NPI Registry Lookup Tool
        </p>

        {isError ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <p className="font-medium">Backend Offline</p>
            <p className="text-sm opacity-90">Please start the server to continue.</p>
          </div>
        ) : (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
            <p className="font-medium">System Ready</p>
            <p className="text-sm opacity-90">Backend is connected and healthy.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
