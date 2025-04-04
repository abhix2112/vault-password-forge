
import React from "react";
import { Shield, Lock, Bell, Eye, Database, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Data Breach Protection",
    description:
      "Verify your password against known data breaches to ensure maximum security.",
  },
  {
    icon: Lock,
    title: "Advanced Encryption",
    description:
      "All passwords are generated using cryptographically secure methods.",
  },
  {
    icon: Eye,
    title: "Zero Knowledge",
    description:
      "We never store your passwords on our servers. Everything is generated locally.",
  },
  {
    icon: Database,
    title: "Customizable Generation",
    description:
      "Create passwords or passphrases that meet your specific security requirements.",
  },
  {
    icon: Clock,
    title: "Instant Generation",
    description:
      "Generate secure passwords instantly with our high-performance algorithm.",
  },
  {
    icon: Bell,
    title: "Security Alerts",
    description:
      "Get instant feedback on password strength and security recommendations.",
  },
];

const SecurityFeatures: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto my-16">
      <h2 className="text-2xl font-bold text-center text-vault-primary mb-12">
        Why Choose Vault Password Forge?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="security-card rounded-lg p-6 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full shield-gradient flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-vault-primary">
                {feature.title}
              </h3>
            </div>
            <p className="text-sm text-vault-dark/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityFeatures;
