import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // if a query fails, ReactQuery will try 3 more times
                // NOTE: this is the default value
      cacheTime: 300_000, // if a query has no observers (which means that no component is using that query), then that query is considered inactive.
                // NOTE: this value is in milliseconds, so this is 5 minutes; thus, an inactive query will be removed from the cache after 5 minutes
                // NOTE: this is the default value
      staleTime: 0, // 0 means that the moment we get a piece of data, it is treated as old (or stale), so the next time we need the same piece of data, ReactQuery will refetch fresh data from the backend
                // NOTE: this value is in milliseconds
                // NOTE: this is the default value
                // NOTE: ReactQuery will automatically refresh stale data under the following three situations:
                //   - when the network is reconnected
                //   - when a component is mounted
                //   - when the window is refocused
      refetchOnWindowFocus: true, // will refetched when the window is refocused
                                  // NOTE: this is the default value
      refetchOnMount: true,       // will refetched when a component is first mounted
                                  // NOTE: this is the default value
      refetchOnReconnect: true,   // will refetched when the network is reconnected
                                  // NOTE: this is the default value
    }
  }
});

// The process ReactQuery goes through when refetching when data is stale
//  1) ReactQuery will attempt to refetch new data from the backend, while
//       at the same time returning the data from the cache to the application
//       (allowing to show the user the cache data while getting the latest
//       data in the background)
//  2) Once ReactQuery has the updated data, it will update the cache and notifies
//       the component that new data is available and the component will be
//       rerendered with the updated data

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
