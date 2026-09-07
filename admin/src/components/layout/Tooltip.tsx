import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  enabled?: boolean;
  position?: 'right' | 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  enabled = true,
  position = 'right',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled || !content) {
    return children;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'right':
        return 'left-full ml-3 top-1/2 -translate-y-1/2';
      case 'top':
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      default:
        return 'left-full ml-3 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1.5 text-xs font-medium tracking-wide text-zinc-100 bg-zinc-900 border border-zinc-700/80 rounded-md shadow-xl transition-opacity duration-150 animate-in fade-in zoom-in-95 ${getPositionClasses()}`}
        >
          {content}
          {position === 'right' && (
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-zinc-700/80 rotate-45" />
          )}
        </div>
      )}
    </div>
  );
};
