import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getIconComponent } from '../utils/iconMapper';

/**
 * Universal Icon Wrapper
 * Uses Expo Vector Icons on native (Expo Go compatible)
 * Can use Tabler icons on web if needed
 */
export const IconWrapper = ({ 
  iconName, 
  size = 24, 
  color = '#000', 
  stroke = 2, 
  fill,
  ...props 
}) => {
  // On native platforms, always use Expo Vector Icons
  if (Platform.OS !== 'web') {
    const IconComponent = getIconComponent(iconName, size, color, stroke, fill);
    return <IconComponent size={size} color={color} {...props} />;
  }
  
  // On web, you can use Tabler icons if available
  // For now, fallback to Expo Vector Icons
  const IconComponent = getIconComponent(iconName, size, color, stroke, fill);
  return <IconComponent size={size} color={color} {...props} />;
};

// Export individual icon creators for easier migration
export const createTablerIcon = (iconName) => {
  return (props) => <IconWrapper iconName={iconName} {...props} />;
};

