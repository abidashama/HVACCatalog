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
import FlowSwitchDetailPage from "@/pages/FlowSwitchDetailPage";
import PressureTransmitterDetailPage from "@/pages/PressureTransmitterDetailPage";
import HeatExchangerDetailPage from "@/pages/HeatExchangerDetailPage";
import AxeonValveDetailPage from "@/pages/AxeonValveDetailPage";
import AccumulatorDetailPage from "@/pages/AccumulatorDetailPage";
import FansDetailPage from "@/pages/FansDetailPage";
import FilterDrierDetailPage from "@/pages/FilterDrierDetailPage";
import PressureGaugeDetailPage from "@/pages/PressureGaugeDetailPage";
import TeflonTapeDetailPage from "@/pages/TeflonTapeDetailPage";
import AxeonPumpsDetailPage from "@/pages/AxeonPumpsDetailPage";
import VibrationEliminatorsDetailPage from "@/pages/VibrationEliminatorsDetailPage";
import BrazingRodDetailPage from "@/pages/BrazingRodDetailPage";
import RelayDetailPage from "@/pages/RelayDetailPage";
import ScrollCompressorDetailPage from "@/pages/ScrollCompressorDetailPage";
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
      <Route path="/accumulator/:productId" component={AccumulatorDetailPage} />
      <Route path="/fans/:productId" component={FansDetailPage} />
      <Route path="/filter-driers/:subcategoryId" component={FilterDrierDetailPage} />
      <Route path="/pressure-gauge/:subcategoryId" component={PressureGaugeDetailPage} />
      <Route path="/teflon-tape/:subcategoryId" component={TeflonTapeDetailPage} />
      <Route path="/axeon-pumps/:categoryId" component={AxeonPumpsDetailPage} />
      <Route path="/vibration-eliminators/:subcategoryId" component={VibrationEliminatorsDetailPage} />
      <Route path="/brazing-rod/:subcategoryId" component={BrazingRodDetailPage} />
      <Route path="/relay/:subcategoryId" component={RelayDetailPage} />
      <Route path="/scroll-compressors" component={ScrollCompressorDetailPage} />
      <Route path="/pressure-switches/:subcategoryId" component={PressureSwitchDetailPage} />
      <Route path="/valves/:categoryId" component={ValveDetailPage} />
      <Route path="/flow-switches/:subcategoryId" component={FlowSwitchDetailPage} />
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