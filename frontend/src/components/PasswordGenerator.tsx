
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Copy,
  Download,
  RefreshCw,
  Shield,
  Key,
  FileText,
  AlertCircle,
  CheckCircle,
  Lock,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import SecurityMeter from "@/components/SecurityMeter";
import { passwordService } from "@/services/passwordService";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PasswordOptions {
  length: number;
  symbols: boolean;
  numbers: boolean;
}

interface PassphraseOptions {
  words: number;
}

interface SecurityScore {
  overall: number;
  banking: number;
  social_media: number;
  email: number;
  strength_details: Record<string, boolean>;
}

const PasswordGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("password");
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 16,
    symbols: true,
    numbers: true,
  });
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>({
    words: 4,
  });
  const [password, setPassword] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [customPassword, setCustomPassword] = useState<string>("");
  const [customPasswordScore, setCustomPasswordScore] = useState<SecurityScore | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [securityScore, setSecurityScore] = useState<SecurityScore | null>(null);
  const [breachCheckResult, setBreachCheckResult] = useState<{
    breached: boolean;
    message: string;
  } | null>(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handlePasswordGeneration = async () => {
    setLoading(true);
    try {
      const response = await passwordService.generatePassword(
        passwordOptions.length,
        passwordOptions.symbols,
        passwordOptions.numbers
      );
      
      setPassword(response.password);
      setSecurityScore(response.security_score);
      setBreachCheckResult(null);
    } catch (error) {
      console.error("Error generating password:", error);
      toast({
        title: "Error",
        description: "Failed to generate password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePassphraseGeneration = async () => {
    setLoading(true);
    try {
      const response = await passwordService.generatePassphrase(
        passphraseOptions.words
      );
      
      setPassphrase(response.passphrase);
      setSecurityScore(response.security_score);
      setBreachCheckResult(null);
    } catch (error) {
      console.error("Error generating passphrase:", error);
      toast({
        title: "Error",
        description: "Failed to generate passphrase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCustomPassword = async () => {
    if (!customPassword) {
      toast({
        title: "No password entered",
        description: "Please enter a password to check",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await passwordService.checkSecurity(customPassword);
      setCustomPasswordScore(response.security_score);
      setBreachCheckResult(null);
    } catch (error) {
      console.error("Error checking password:", error);
      toast({
        title: "Error",
        description: "Failed to check password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBreachCheck = async () => {
    let textToCheck = "";
    
    if (activeTab === "password") textToCheck = password;
    else if (activeTab === "passphrase") textToCheck = passphrase;
    else if (activeTab === "check") textToCheck = customPassword;
    
    if (!textToCheck) {
      toast({
        title: "No password to check",
        description: activeTab === "check" 
          ? "Please enter a password first" 
          : "Please generate a password first",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingBreach(true);
    try {
      const result = await passwordService.checkPasswordBreach(textToCheck);
      setBreachCheckResult(result);
    } catch (error) {
      console.error("Error checking breach:", error);
      toast({
        title: "Error",
        description: "Failed to check breach status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingBreach(false);
    }
  };

  const copyToClipboard = () => {
    let textToCopy = "";
    
    if (activeTab === "password") textToCopy = password;
    else if (activeTab === "passphrase") textToCopy = passphrase;
    else if (activeTab === "check") textToCopy = customPassword;
    
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    
    // Show the visual feedback
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
    
    toast({
      title: "Copied to clipboard",
      description: "Your secure text has been copied!",
    });
  };

  const downloadAsFile = () => {
    let textToDownload = "";
    let fileName = "";
    
    if (activeTab === "password") {
      textToDownload = password;
      fileName = "secure-password";
    } else if (activeTab === "passphrase") {
      textToDownload = passphrase;
      fileName = "secure-passphrase";
    } else if (activeTab === "check") {
      textToDownload = customPassword;
      fileName = "custom-password";
    }
    
    if (!textToDownload) return;

    const element = document.createElement("a");
    const file = new Blob([textToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded",
      description: `Your secure ${activeTab} has been downloaded as a text file`,
    });
  };

  // Generate password/passphrase on component mount
  useEffect(() => {
    handlePasswordGeneration();
    // We'll only generate the password on mount, not both
  }, []);

  // Generate when tab changes
  useEffect(() => {
    if (activeTab === "password" && !password) {
      handlePasswordGeneration();
    } else if (activeTab === "passphrase" && !passphrase) {
      handlePassphraseGeneration();
    }
  }, [activeTab]);

  const getDisplayedText = () => {
    if (activeTab === "password") return password;
    if (activeTab === "passphrase") return passphrase;
    return customPassword;
  };

  const getCurrentScore = () => {
    if (activeTab === "check") return customPasswordScore;
    return securityScore;
  };

  const displayedText = getDisplayedText();
  const currentScore = getCurrentScore();

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 animate-bounce-in">
      <div className="security-card rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          Secure Password Generator
        </h2>

        <Tabs
          defaultValue="password"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Password
            </TabsTrigger>
            <TabsTrigger value="passphrase" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Passphrase
            </TabsTrigger>
            <TabsTrigger value="check" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Check Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="password" className="space-y-6">
            <div className="space-y-4">
              <Label>Password Length: {passwordOptions.length}</Label>
              <Slider
                value={[passwordOptions.length]}
                min={8}
                max={64}
                step={1}
                onValueChange={(value) =>
                  setPasswordOptions({ ...passwordOptions, length: value[0] })
                }
                className="mb-6"
              />

              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="symbols"
                    checked={passwordOptions.symbols}
                    onCheckedChange={(checked) =>
                      setPasswordOptions({ ...passwordOptions, symbols: checked })
                    }
                  />
                  <Label htmlFor="symbols">Include Symbols</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="numbers"
                    checked={passwordOptions.numbers}
                    onCheckedChange={(checked) =>
                      setPasswordOptions({ ...passwordOptions, numbers: checked })
                    }
                  />
                  <Label htmlFor="numbers">Include Numbers</Label>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePasswordGeneration}
              className="w-full"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate New Password
            </Button>
          </TabsContent>

          <TabsContent value="passphrase" className="space-y-6">
            <div className="space-y-4">
              <Label>Number of Words: {passphraseOptions.words}</Label>
              <Slider
                value={[passphraseOptions.words]}
                min={2}
                max={10}
                step={1}
                onValueChange={(value) =>
                  setPassphraseOptions({ ...passphraseOptions, words: value[0] })
                }
                className="mb-6"
              />
            </div>

            <Button
              onClick={handlePassphraseGeneration}
              className="w-full"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate New Passphrase
            </Button>
          </TabsContent>

          <TabsContent value="check" className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="custom-password">Enter a password to check</Label>
              <div className="relative">
                <Input
                  id="custom-password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="pr-10 font-mono py-6"
                  placeholder="Type your password here..."
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={checkCustomPassword}
              className="w-full"
              variant="outline"
              disabled={loading || !customPassword}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Check Password Strength
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <Label className="block mb-2">Your Secure {activeTab === "password" ? "Password" : activeTab === "passphrase" ? "Passphrase" : "Password"}</Label>
            <div className="relative">
              <Input
                value={displayedText}
                type={showPassword ? "text" : "password"}
                readOnly={activeTab !== "check"}
                className="pr-10 font-mono text-lg py-6"
                onChange={activeTab === "check" ? (e) => setCustomPassword(e.target.value) : undefined}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/70 hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={copyToClipboard} 
              variant="secondary" 
              className="flex-1 min-w-[150px] relative"
              disabled={!displayedText}
            >
              {copyFeedback ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copyFeedback ? "Copied!" : "Copy"}
            </Button>
            <Button 
              onClick={downloadAsFile} 
              variant="secondary" 
              className="flex-1 min-w-[150px]"
              disabled={!displayedText}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={handleBreachCheck} 
              variant="secondary" 
              className="flex-1 min-w-[150px]"
              disabled={isCheckingBreach || !displayedText}
            >
              <Shield className="h-4 w-4 mr-2" />
              {isCheckingBreach ? "Checking..." : "Check Breach"}
            </Button>
          </div>

          {currentScore && (
            <TooltipProvider>
              <SecurityMeter securityScore={currentScore} />
            </TooltipProvider>
          )}

          {breachCheckResult && (
            <div 
              className={cn(
                "p-4 rounded-md mt-4 animate-fade-in", 
                breachCheckResult.breached 
                  ? "bg-red-100 border border-red-300 dark:bg-red-900/30 dark:border-red-800/30 dark:text-red-100" 
                  : "bg-green-100 border border-green-300 dark:bg-green-900/30 dark:border-green-800/30 dark:text-green-100"
              )}
            >
              <div className="flex items-start gap-3">
                {breachCheckResult.breached ? (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                )}
                <div>
                  <h3 className={cn(
                    "font-medium text-lg",
                    breachCheckResult.breached ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
                  )}>
                    {breachCheckResult.breached ? "Password Compromised" : "Password Secure"}
                  </h3>
                  <p className={cn(
                    "text-sm mt-1",
                    breachCheckResult.breached ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"
                  )}>
                    {breachCheckResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
