import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Wrapper component to render Tabler icons in React Native
// This converts web-based Tabler icons to work with React Native SVG
export const TablerIcon = ({ icon, size = 24, color = '#000', stroke = 2, fill, ...props }) => {
  // Get the icon data - we'll need to import the actual SVG paths
  // For now, this is a placeholder structure
  const IconComponent = icon;
  
  if (!IconComponent) {
    return null;
  }

  // If the icon has a render method or is a component, we need to extract its SVG path
  // Since @tabler/icons-react uses SVG paths, we'll need to access them differently
  // This is a workaround - in production, you'd want to use a library that provides RN-compatible icons
  
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill || 'none'}
      stroke={fill ? 'none' : color}
      strokeWidth={fill ? 0 : stroke}
      {...props}
    >
      {/* The actual path would need to be extracted from the Tabler icon */}
      {/* This is a placeholder - we'll need a different approach */}
    </Svg>
  );
};

