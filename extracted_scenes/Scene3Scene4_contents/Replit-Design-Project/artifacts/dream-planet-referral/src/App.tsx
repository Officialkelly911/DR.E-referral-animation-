import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import ReferralHome from '@/pages/ReferralHome';
import ReferralLevels from '@/pages/ReferralLevels';
import ReferralLeaderboard from '@/pages/ReferralLeaderboard';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={ReferralHome} />
      <Route path="/levels" component={ReferralLevels} />
      <Route path="/leaderboard" component={ReferralLeaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
