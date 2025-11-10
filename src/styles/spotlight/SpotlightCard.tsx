import React, { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  darkSpotlightColor?: string;
  size?: number;
  isDarkMode?: boolean;
}

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.15)', // Default indigo for light mode
  darkSpotlightColor = 'rgba(139, 92, 246, 0.2)', // Default purple for dark mode
  size = 300,
  isDarkMode = false,
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: any) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const currentSpotlightColor = isDarkMode ? darkSpotlightColor : spotlightColor;

  return React.createElement('div', {
    ref: cardRef,
    className: `relative overflow-hidden ${className}`,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }, [
    React.createElement('div', {
      key: 'spotlight',
      className: 'absolute inset-0 pointer-events-none transition-opacity duration-300',
      style: {
        opacity: isHovered ? 1 : 0,
        background: `radial-gradient(${size}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${currentSpotlightColor}, transparent 70%)`,
      }
    }),
    React.createElement('div', {
      key: 'content',
      className: 'relative z-10'
    }, children)
  ]);
};

export default SpotlightCard; 