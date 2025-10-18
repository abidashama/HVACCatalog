import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import PressureSwitchDetailPage from "@/pages/PressureSwitchDetailPage";
import ValveDetailPage from "@/pages/ValveDetailPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/product/:slug" component={ProductDetailPage} />
      <Route path="/pressure-switches/:subcategoryId" component={PressureSwitchDetailPage} />
      <Route path="/valves/:categoryId" component={ValveDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="industrial-hvac-theme">
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;