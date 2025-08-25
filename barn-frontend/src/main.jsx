import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './styles/animations.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { MaritimeToastProvider } from './components/shared/MaritimeToast.jsx'

// Create a QueryClient instance optimized for maritime data
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes for real-time marine data
      cacheTime: 1000 * 60 * 10, // 10 minutes cache
      retry: (failureCount, error) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for network/server errors (important for maritime connectivity)
        return failureCount < 3;
      },
      refetchOnWindowFocus: true, // Refetch marine data when user returns
      refetchOnReconnect: true, // Important for maritime operations with intermittent connectivity
    },
    mutations: {
      retry: 1, // Retry mutations once
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MaritimeToastProvider>
          <App />
        </MaritimeToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
