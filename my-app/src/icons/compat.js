import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const iconMap = {
  IconFlame: 'flame',
  IconFlameFilled: 'flame',
  IconPencil: 'pencil',
  IconQuestionMark: 'help-circle',
  IconCircleCheck: 'checkmark-circle',
  IconChartBar: 'bar-chart',
  IconClock: 'time',
  IconClockFilled: 'time',
  IconMailCheck: 'mail',
  IconSunFilled: 'sunny',
  IconMoonFilled: 'moon',
  IconBellFilled: 'notifications',
  IconNotification: 'notifications',
  IconLogout: 'log-out',
  IconTrash: 'trash',
  IconCloudOff: 'cloud-offline',
  IconUserX: 'person-remove',
  IconBook: 'book',
  IconBookOpen: 'book-outline',
  IconBookFilled: 'book',
  IconAlertTriangle: 'warning',
  IconBuilding: 'business',
  IconSword: 'flash',
  IconFlag: 'flag',
  IconWorld: 'globe',
  IconMap: 'map',
  IconTheater: 'film',
  IconScale: 'scale',
  IconUsers: 'people',
  IconGlobe: 'globe',
  IconCurrencyDollar: 'cash',
  IconPlant: 'leaf',
  IconMicroscope: 'flask',
  IconShield: 'shield',
  IconAlertCircle: 'alert-circle',
  IconCompass: 'compass',
  IconNews: 'newspaper',
  IconFileText: 'document-text',
  IconFileTextFilled: 'document-text',
  IconFileUploadFilled: 'cloud-upload',
  IconUpload: 'cloud-upload',
  IconDownload: 'cloud-download',
  IconApps: 'apps',
  IconRefresh: 'refresh',
  IconConfetti: 'sparkles',
  IconTarget: 'target',
  IconSettings: 'settings',
  IconLock: 'lock-closed',
  IconSunrise: 'sunny',
  IconSun: 'sunny',
  IconCloud: 'cloud',
  IconSunset: 'partly-sunny',
  IconMoon: 'moon',
  IconDeviceTv: 'tv',
  IconDownloadOff: 'cloud-offline',
  IconCloudUpload: 'cloud-upload',
  IconSparkles: 'sparkles',
  IconRocket: 'rocket',
  IconDeviceFloppy: 'save',
  IconClipboard: 'clipboard-outline',
  IconClipboardFilled: 'clipboard',
  IconSearch: 'search',
  IconX: 'close',
  IconBell: 'notifications',
  IconBellOff: 'notifications-off',
};

const createIcon = (name) => {
  const ioniconName = iconMap[name] || 'help-circle';
  return ({ size = 24, color = '#000', stroke, fill, ...props }) => (
    <Ionicons name={ioniconName} size={size} color={color} {...props} />
  );
};

// Export all mapped icons
export const IconFlame = createIcon('IconFlame');
export const IconFlameFilled = createIcon('IconFlameFilled');
export const IconPencil = createIcon('IconPencil');
export const IconQuestionMark = createIcon('IconQuestionMark');
export const IconCircleCheck = createIcon('IconCircleCheck');
export const IconChartBar = createIcon('IconChartBar');
export const IconClock = createIcon('IconClock');
export const IconClockFilled = createIcon('IconClockFilled');
export const IconMailCheck = createIcon('IconMailCheck');
export const IconSunFilled = createIcon('IconSunFilled');
export const IconMoonFilled = createIcon('IconMoonFilled');
export const IconBellFilled = createIcon('IconBellFilled');
export const IconNotification = createIcon('IconNotification');
export const IconLogout = createIcon('IconLogout');
export const IconTrash = createIcon('IconTrash');
export const IconCloudOff = createIcon('IconCloudOff');
export const IconUserX = createIcon('IconUserX');
export const IconBook = createIcon('IconBook');
export const IconBookOpen = createIcon('IconBookOpen');
export const IconBookFilled = createIcon('IconBookFilled');
export const IconAlertTriangle = createIcon('IconAlertTriangle');
export const IconBuilding = createIcon('IconBuilding');
export const IconSword = createIcon('IconSword');
export const IconFlag = createIcon('IconFlag');
export const IconWorld = createIcon('IconWorld');
export const IconMap = createIcon('IconMap');
export const IconTheater = createIcon('IconTheater');
export const IconScale = createIcon('IconScale');
export const IconUsers = createIcon('IconUsers');
export const IconGlobe = createIcon('IconGlobe');
export const IconCurrencyDollar = createIcon('IconCurrencyDollar');
export const IconPlant = createIcon('IconPlant');
export const IconMicroscope = createIcon('IconMicroscope');
export const IconShield = createIcon('IconShield');
export const IconAlertCircle = createIcon('IconAlertCircle');
export const IconCompass = createIcon('IconCompass');
export const IconNews = createIcon('IconNews');
export const IconFileText = createIcon('IconFileText');
export const IconFileTextFilled = createIcon('IconFileTextFilled');
export const IconFileUploadFilled = createIcon('IconFileUploadFilled');
export const IconUpload = createIcon('IconUpload');
export const IconDownload = createIcon('IconDownload');
export const IconApps = createIcon('IconApps');
export const IconRefresh = createIcon('IconRefresh');
export const IconConfetti = createIcon('IconConfetti');
export const IconTarget = createIcon('IconTarget');
export const IconSettings = createIcon('IconSettings');
export const IconLock = createIcon('IconLock');
export const IconSunrise = createIcon('IconSunrise');
export const IconSun = createIcon('IconSun');
export const IconCloud = createIcon('IconCloud');
export const IconSunset = createIcon('IconSunset');
export const IconMoon = createIcon('IconMoon');
export const IconDeviceTv = createIcon('IconDeviceTv');
export const IconDownloadOff = createIcon('IconDownloadOff');
export const IconCloudUpload = createIcon('IconCloudUpload');
export const IconSparkles = createIcon('IconSparkles');
export const IconRocket = createIcon('IconRocket');
export const IconDeviceFloppy = createIcon('IconDeviceFloppy');
export const IconClipboard = createIcon('IconClipboard');
export const IconClipboardFilled = createIcon('IconClipboardFilled');
export const IconSearch = createIcon('IconSearch');
export const IconX = createIcon('IconX');
export const IconBell = createIcon('IconBell');
export const IconBellOff = createIcon('IconBellOff');

// default fallback
export const IconDefault = createIcon('IconQuestionMark');


