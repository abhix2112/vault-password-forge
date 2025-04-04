
import React from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 md:px-10 flex justify-between items-center border-b animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full shield-gradient flex items-center justify-center">
          <LockKeyhole className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Vault <span className="text-primary">Password Forge</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-sm text-foreground hidden md:inline-block">
            Secured & Protected
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
