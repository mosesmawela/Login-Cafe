import React, { useRef, useState, MouseEvent } from 'react';
import { Heart } from 'lucide-react';

interface ShinyCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const ShinyCard: React.FC<ShinyCardProps> = ({ children, className = '', onClick, isFavorite, onToggleFavorite }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Safe handler to prevent event bubbling issues if nested
  const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
          e.stopPropagation(); // Prevent duplicate triggers
          onClick();
      }
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      ref={divRef as any}
      onMouseMove={handleMouseMove as any}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative rounded-xl transition-all duration-500 text-left w-full overflow-hidden ${className}`}
      type={onClick ? 'button' : undefined}
    >
      {/* Dynamic Shine Overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-20 rounded-xl mix-blend-overlay"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255, 255, 255, 0.15), transparent 40%)`,
        }}
      />
      {/* Background Tint for Glass effect interaction */}
      <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors duration-300 pointer-events-none z-10" />
      
      {/* Favorite Button */}
      {onToggleFavorite && (
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(e);
            }}
            className="absolute top-3 right-3 z-30 p-2 rounded-full hover:bg-white/20 transition-all active:scale-95"
          >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-[#E4002B] text-[#E4002B]' : 'text-gray-400 hover:text-white'}`} />
          </button>
      )}
      
      <div className="relative h-full w-full z-10">
         {children}
      </div>
    </Component>
  );
};