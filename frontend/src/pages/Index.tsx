
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PasswordGenerator from "@/components/PasswordGenerator";
import SecurityFeatures from "@/components/SecurityFeatures";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <TooltipProvider>
          <div className="container mx-auto px-4 py-8">
            <PasswordGenerator />
            <SecurityFeatures />
          </div>
        </TooltipProvider>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
