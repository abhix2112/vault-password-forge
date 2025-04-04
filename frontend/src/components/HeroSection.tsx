
import React from "react";
import { ShieldCheck, CheckCircle } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <div className="w-full py-12 md:py-20 bg-gradient-to-br from-vault-primary to-vault-dark text-white">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Generate Secure Passwords with Confidence
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Create strong, unique passwords that keep your accounts safe from hackers.
            </p>

            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-vault-secondary" />
                <span>Safely check if your password has been breached</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-vault-secondary" />
                <span>Generate passwords or memorable passphrases</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-vault-secondary" />
                <span>Your security is our top priority</span>
              </div>
            </div>
          </div>

          <div className="md:w-2/5 flex justify-center animate-slide-in">
            <div className="relative">
              <div className="absolute inset-0 bg-vault-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 p-10 rounded-2xl">
                <ShieldCheck className="h-24 w-24 text-white mx-auto" />
                <p className="text-center font-medium mt-4">
                  Protecting your digital life
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
