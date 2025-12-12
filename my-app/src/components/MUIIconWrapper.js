import React from 'react';
import { Platform } from 'react-native';

// Wrapper component to use MUI icons in React Native
export const MUIIconWrapper = ({ IconComponent, size = 24, color, style }) => {
  if (Platform.OS === 'web') {
    // For web, use MUI icons directly
    const Icon = IconComponent;
    return <Icon sx={{ fontSize: size, color, ...style }} />;
  } else {
    // For native, we'll need to use an alternative or render as SVG
    // For now, we'll use a simple View with the icon rendered via react-native-svg
    // This is a simplified approach - in production you'd want to extract SVG paths
    return null;
  }
};

