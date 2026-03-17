
import React from 'react';
import { cn } from '@/lib/utils';
import nerdLogo from '@/assets/nerdoptimize-logo.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={nerdLogo}
        alt="NerdOptimize" 
        className="h-9 w-auto"
      />
    </div>
  );
};

export default Logo;
