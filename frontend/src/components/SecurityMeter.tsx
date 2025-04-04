
import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SecurityScore {
  overall: number;
  banking: number;
  social_media: number;
  email: number;
  strength_details: Record<string, boolean>;
}

interface SecurityMeterProps {
  securityScore: SecurityScore;
}

const SecurityMeter: React.FC<SecurityMeterProps> = ({ securityScore }) => {
  const isMobile = useIsMobile();
  
  const getStrengthLabel = (score: number) => {
    if (score < 30) return { label: "Weak", color: "password-strength-weak", textColor: "text-red-600 dark:text-red-400" };
    if (score < 60) return { label: "Medium", color: "password-strength-medium", textColor: "text-yellow-600 dark:text-yellow-400" };
    if (score < 80) return { label: "Strong", color: "password-strength-strong", textColor: "text-green-600 dark:text-green-400" };
    return { label: "Very Strong", color: "password-strength-very-strong", textColor: "text-blue-600 dark:text-blue-400" };
  };

  const strengthOverall = getStrengthLabel(securityScore.overall);
  const strengthBanking = getStrengthLabel(securityScore.banking);
  const strengthSocialMedia = getStrengthLabel(securityScore.social_media);
  const strengthEmail = getStrengthLabel(securityScore.email);

  const renderStrengthDetails = () => {
    const details = Object.entries(securityScore.strength_details || {}).map(
      ([key, value]) => {
        // Replace underscores with spaces and capitalize first letter of each word
        const formattedKey = key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return (
          <li key={key} className="flex items-center gap-2 mt-1.5">
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full",
                value ? "bg-green-500 dark:bg-green-400" : "bg-red-500 dark:bg-red-400"
              )}
            />
            <span className={cn(
              "text-sm",
              value ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            )}>
              {formattedKey}
            </span>
          </li>
        );
      }
    );

    return (
      <ul className="mt-2 space-y-1">{details}</ul>
    );
  };

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-foreground">Password Strength</h3>
        <div className={cn("score-badge", {
          "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300": securityScore.overall < 30,
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300": securityScore.overall >= 30 && securityScore.overall < 60,
          "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300": securityScore.overall >= 60 && securityScore.overall < 80,
          "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300": securityScore.overall >= 80,
        })}>
          {strengthOverall.label}
        </div>
      </div>

      <div className="security-meter-container">
        <Progress value={securityScore.overall} className={cn("security-meter-progress", strengthOverall.color)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Banking</span>
              {isMobile ? (
                <button 
                  className="inline-flex" 
                  onClick={() => alert("Your password's suitability for banking websites that often require high security standards.")}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Your password's suitability for banking websites that often require high security standards.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className={cn("text-xs", strengthBanking.textColor)}>
              {securityScore.banking}%
            </span>
          </div>
          <div className="security-meter-container">
            <Progress value={securityScore.banking} className={cn("security-meter-progress", strengthBanking.color)} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Social Media</span>
              {isMobile ? (
                <button 
                  className="inline-flex" 
                  onClick={() => alert("How well your password would protect social media accounts that may contain personal information.")}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      How well your password would protect social media accounts that may contain personal information.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className={cn("text-xs", strengthSocialMedia.textColor)}>
              {securityScore.social_media}%
            </span>
          </div>
          <div className="security-meter-container">
            <Progress value={securityScore.social_media} className={cn("security-meter-progress", strengthSocialMedia.color)} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Email</span>
              {isMobile ? (
                <button 
                  className="inline-flex" 
                  onClick={() => alert("Suitability for email accounts, which often serve as recovery options for other services.")}
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Suitability for email accounts, which often serve as recovery options for other services.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <span className={cn("text-xs", strengthEmail.textColor)}>
              {securityScore.email}%
            </span>
          </div>
          <div className="security-meter-container">
            <Progress value={securityScore.email} className={cn("security-meter-progress", strengthEmail.color)} />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Details</h4>
          {isMobile ? (
            <button 
              className="inline-flex" 
              onClick={() => alert("Specific criteria that affect your password's security rating.")}
            >
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Specific criteria that affect your password's security rating.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        {renderStrengthDetails()}
      </div>
    </div>
  );
};

export default SecurityMeter;
