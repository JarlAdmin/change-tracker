import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ServiceFilterProps {
  services: string[];
  value: string;
  onChange: (value: string) => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ services, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by service" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Services</SelectItem>
        {services.filter(service => service !== '').map((service) => (
          <SelectItem key={service} value={service}>
            {service}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ServiceFilter;
