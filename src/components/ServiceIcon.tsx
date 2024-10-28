import React from 'react';
import { 
  FaMicrosoft, 
  FaCloud, 
  FaShieldAlt, 
  FaEnvelope, 
  FaUsers, 
  FaNetworkWired,
  FaServer,
  FaCogs,
  FaMobileAlt
} from 'react-icons/fa';
import { 
  SiMicrosoftazure, 
  SiMicrosoftteams
} from 'react-icons/si';

interface ServiceIconProps {
  category?: string;
  service?: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ category, service, className = "h-4 w-4" }) => {
  if (category === "Microsoft") {
    if (!service) return <FaMicrosoft className={className} />;
    
    switch (service) {
      case "Azure":
        return <SiMicrosoftazure className={className} />;
      case "Intune":
        return <FaMobileAlt className={className} />;
      case "Exchange":
        return <FaEnvelope className={className} />;
      case "Defender":
        return <FaShieldAlt className={className} />;
      case "Entra":
        return <FaUsers className={className} />;
      case "Teams":
        return <SiMicrosoftteams className={className} />;
      default:
        return <FaMicrosoft className={className} />;
    }
  }

  if (category === "On Premise") {
    if (!service) return <FaServer className={className} />;
    
    switch (service) {
      case "Active Directory":
        return <FaUsers className={className} />;
      case "Network":
        return <FaNetworkWired className={className} />;
      default:
        return <FaServer className={className} />;
    }
  }

  if (category === "General Changes") {
    return <FaCogs className={className} />;
  }

  return null;
};

export const CategoryWithIcon: React.FC<{ category: string; className?: string }> = ({ category, className }) => {
  return (
    <div className="flex items-center gap-2">
      <ServiceIcon category={category} className={className} />
      <span>{category}</span>
    </div>
  );
};

export const ServiceWithIcon: React.FC<{ category: string; service: string; className?: string }> = ({ 
  category, 
  service,
  className 
}) => {
  return (
    <div className="flex items-center gap-2">
      <ServiceIcon category={category} service={service} className={className} />
      <span>{service}</span>
    </div>
  );
};
