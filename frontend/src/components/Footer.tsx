
import React from "react";
import { Lock, Shield } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 mt-10 border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Lock className="h-4 w-4 text-vault-accent" />
            <span className="text-sm text-vault-dark">
              Vault Password Forge © {new Date().getFullYear()}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-vault-accent" />
              <span className="text-xs text-vault-dark">
                100% Secure & Local Generation
              </span>
            </div>
            <div className="text-xs text-vault-dark">
              No passwords are stored
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
