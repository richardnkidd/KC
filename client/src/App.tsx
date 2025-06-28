import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SWRConfig } from 'swr';
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// SWR fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SWRConfig 
          value={{
            fetcher,
            onError: (error) => {
              console.error('SWR Error:', error);
            },
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
          }}
        >
          <TooltipProvider>
            {/* Removed the dark class wrapper */}
            <Toaster />
            <Router />
          </TooltipProvider>
        </SWRConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;