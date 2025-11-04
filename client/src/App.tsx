import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import PressureSwitchDetailPage from "@/pages/PressureSwitchDetailPage";
import ValveDetailPage from "@/pages/ValveDetailPage";
import PressureTransmitterDetailPage from "@/pages/PressureTransmitterDetailPage";
import HeatExchangerDetailPage from "@/pages/HeatExchangerDetailPage";
import AxeonValveDetailPage from "@/pages/AxeonValveDetailPage";
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
      <Route path="/heat-exchangers/bphe" component={HeatExchangerDetailPage} />
      <Route path="/axeon-valves/:productId" component={AxeonValveDetailPage} />
      <Route path="/pressure-switches/:subcategoryId" component={PressureSwitchDetailPage} />
      <Route path="/valves/:categoryId" component={ValveDetailPage} />
      <Route path="/pressure-transmitters/:subcategoryId" component={PressureTransmitterDetailPage} />
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
            <div className="min-h-screen" style={{ background: 'linear-gradient(to top, #dfe9f3 0%, white 100%)' }}>
              <ScrollToTop />
              <Router />
              <Toaster />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;