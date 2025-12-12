import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Map Tabler icon names to Expo Vector Icons (Ionicons)
// This allows us to use Tabler icon names but render with Expo Vector Icons
export const getIconComponent = (iconName, size = 24, color = '#000', stroke = 2, fill) => {
  const iconMap = {
    // Flame icons
    'IconFlame': 'flame',
    'IconFlameFilled': 'flame',
    
    // Pencil/Edit icons
    'IconPencil': 'pencil',
    'IconEdit': 'create',
    
    // Question icons
    'IconQuestionMark': 'help-circle',
    'IconHelp': 'help-circle',
    
    // Check icons
    'IconCircleCheck': 'checkmark-circle',
    'IconCheck': 'checkmark',
    
    // Chart icons
    'IconChartBar': 'bar-chart',
    'IconChartLine': 'trending-up',
    
    // Clock icons
    'IconClock': 'time',
    'IconClockFilled': 'time',
    
    // Book icons
    'IconBook': 'book',
    'IconBookFilled': 'book',
    'IconBookOpen': 'book-open',
    
    // File icons
    'IconFileText': 'document-text',
    'IconFileTextFilled': 'document-text',
    
    // Upload/Download icons
    'IconUpload': 'cloud-upload',
    'IconDownload': 'cloud-download',
    'IconFileUploadFilled': 'cloud-upload',
    'IconCloudUpload': 'cloud-upload',
    
    // Save icons
    'IconDeviceFloppy': 'save',
    
    // Settings icons
    'IconSettings': 'settings',
    'IconTarget': 'target',
    'IconChartBar': 'stats-chart',
    'IconLock': 'lock-closed',
    
    // Time icons
    'IconSunrise': 'sunny',
    'IconSun': 'sunny',
    'IconCloud': 'cloud',
    'IconSunset': 'sunset',
    'IconMoon': 'moon',
    
    // Study icons
    'IconDeviceTv': 'tv',
    'IconScale': 'scale',
    
    // Bell icons
    'IconBellFilled': 'notifications',
    'IconNotification': 'notifications',
    
    // Action icons
    'IconTrash': 'trash',
    'IconLogout': 'log-out',
    'IconCloudOff': 'cloud-offline',
    'IconUserX': 'person-remove',
    'IconMailCheck': 'mail',
    
    // Theme icons
    'IconSunFilled': 'sunny',
    'IconMoonFilled': 'moon',
    
    // Other icons
    'IconRefresh': 'refresh',
    'IconNews': 'newspaper',
    'IconConfetti': 'sparkles',
    'IconSparkles': 'sparkles',
    'IconRocket': 'rocket',
    'IconSearch': 'search',
    'IconX': 'close',
    'IconClipboardFilled': 'clipboard',
    
    // Roadmap icons
    'IconAlertTriangle': 'warning',
    'IconBuilding': 'business',
    'IconSword': 'flash',
    'IconFlag': 'flag',
    'IconWorld': 'globe',
    'IconMap': 'map',
    'IconTheater': 'film',
    'IconUsers': 'people',
    'IconGlobe': 'globe',
    'IconCurrencyDollar': 'cash',
    'IconPlant': 'leaf',
    'IconMicroscope': 'flask',
    'IconShield': 'shield',
    'IconAlertCircle': 'alert-circle',
    'IconCompass': 'compass',
    'IconApps': 'apps',
  };

  const ioniconName = iconMap[iconName] || 'help-circle-outline';
  
  return (props) => (
    <Ionicons 
      name={ioniconName} 
      size={props.size || size} 
      color={props.color || color}
      {...props}
    />
  );
};

// Helper to create icon component with same API as Tabler icons
export const createIcon = (iconName) => {
  return (props) => {
    const IconComponent = getIconComponent(iconName, props.size, props.color, props.stroke, props.fill);
    return <IconComponent {...props} />;
  };
};

