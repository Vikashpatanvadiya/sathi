import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import DiaryList from "@/pages/DiaryList";
import EntryEditor from "@/pages/EntryEditor";
import Goals from "@/pages/Goals";
import GoalDetails from "@/pages/GoalDetails";
import Todos from "@/pages/Todos";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/diary" component={DiaryList} />
      <Route path="/diary/:id" component={EntryEditor} />
      <Route path="/goals" component={Goals} />
      <Route path="/goals/:id" component={GoalDetails} />
      <Route path="/todos" component={Todos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
