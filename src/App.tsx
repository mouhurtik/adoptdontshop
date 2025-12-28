import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const BrowsePets = lazy(() => import("./pages/BrowsePets"));
const PetEssentials = lazy(() => import("./pages/PetEssentials"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Patrons = lazy(() => import("./pages/Sponsors"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PetDetails = lazy(() => import("./pages/PetDetails"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ListPet = lazy(() => import("./pages/ListPet"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const App = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Layout>
                                <Suspense fallback={<LoadingSpinner />}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/browse" element={<BrowsePets />} />
                                        <Route path="/pet-essentials" element={<PetEssentials />} />
                                        <Route path="/pet/:id" element={<PetDetails />} />
                                        <Route path="/success-stories" element={<SuccessStories />} />
                                        <Route path="/sponsors" element={<Patrons />} />
                                        <Route path="/about" element={<AboutUs />} />
                                        <Route path="/terms" element={<TermsAndConditions />} />
                                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                        <Route path="/list-pet" element={<ListPet />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </Suspense>
                            </Layout>
                        </BrowserRouter>
                    </TooltipProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};

export default App;



