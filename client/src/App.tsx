import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

// Modules
import { checkHealth } from './services/api';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const { isError, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    retry: 3,
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
