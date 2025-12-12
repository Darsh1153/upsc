import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  IconTarget,
  IconSettings,
  IconChartBar,
  IconLock,
  IconSunrise,
  IconSun,
  IconCloud,
  IconSunset,
  IconMoon,
  IconBook,
  IconDeviceTv,
  IconPencil,
  IconScale,
  IconBellFilled,
  IconTrash,
  IconDownload,
  IconCloudUpload,
  IconClipboardFilled
} from '../icons/compat';
import { 
  getUserPreferences, 
  saveUserPreferences,
  resetRoadmap,
  exportProgress,
} from '../utils/roadmapStorage';
import { AVAILABLE_OPTIONALS } from '../data/roadmapData';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../features/Reference/theme/ThemeContext';
import { useWebStyles } from '../components/WebContainer';

export default function UserPreferencesScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { horizontalPadding, isWeb } = useWebStyles();
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOptionalPicker, setShowOptionalPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeSection, setActiveSection] = useState('attempt'); // attempt, customization, goals, privacy

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await getUserPreferences();
    setPreferences(prefs);
    setLoading(false);
  };

  const updatePreference = async (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    await saveUserPreferences({ [key]: value });
  };

  const handleExportData = async () => {
    try {
      const data = await exportProgress();
      if (data) {
        const fileUri = FileSystem.documentDirectory + 'upsc_progress_backup.json';
        await FileSystem.writeAsStringAsync(fileUri, data);
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Your Progress',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleResetRoadmap = () => {
    Alert.alert(
      '⚠️ Reset Roadmap',
      'This will delete all your topic progress, study sessions, and achievements. Your preferences will be kept. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const success = await resetRoadmap();
            if (success) {
              Alert.alert('✅ Done', 'Roadmap has been reset.');
            }
          },
        },
      ]
    );
  };

  const timeSlots = [
    { id: 'morning', label: 'Morning (5-9 AM)', icon: IconSunrise },
    { id: 'forenoon', label: 'Forenoon (9 AM-12 PM)', icon: IconSun },
    { id: 'afternoon', label: 'Afternoon (12-5 PM)', icon: IconCloud },
    { id: 'evening', label: 'Evening (5-9 PM)', icon: IconSunset },
    { id: 'night', label: 'Night (9 PM+)', icon: IconMoon },
  ];

  const studyStyles = [
    { id: 'reading', label: 'Reading-focused', desc: 'Books & notes', icon: IconBook },
    { id: 'videos', label: 'Video-focused', desc: 'Online lectures', icon: IconDeviceTv },
    { id: 'notes', label: 'Notes-focused', desc: 'Self-made notes', icon: IconPencil },
    { id: 'balanced', label: 'Balanced', desc: 'Mix of all', icon: IconScale },
  ];

  const interestAreas = [
    'Polity', 'Economy', 'History', 'Geography', 'Environment',
    'Science & Tech', 'International Relations', 'Ethics', 'Current Affairs',
  ];

  const reminderTimes = [
    '05:00', '06:00', '07:00', '08:00', '09:00', '10:00',
    '18:00', '19:00', '20:00', '21:00', '22:00',
  ];

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  const toggleTimeSlot = (slotId) => {
    const current = preferences.preferredTimeSlots || [];
    const updated = current.includes(slotId)
      ? current.filter(id => id !== slotId)
      : [...current, slotId];
    updatePreference('preferredTimeSlots', updated);
  };

  const toggleInterest = (area) => {
    const current = preferences.interestAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    updatePreference('interestAreas', updated);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sections = [
    { id: 'attempt', label: 'Attempt Details', icon: IconClipboardFilled },
    { id: 'customization', label: 'Customization', icon: IconSettings },
    { id: 'goals', label: 'Performance Goals', icon: IconChartBar },
    { id: 'privacy', label: 'Data & Privacy', icon: IconLock },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding || 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Preferences</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Customize your study experience</Text>
        </View>

        {/* Section Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const SectionIcon = section.icon;
            return (
              <TouchableOpacity
                key={section.id}
                activeOpacity={0.7}
                style={styles.sectionTab}
                onPress={() => setActiveSection(section.id)}
              >
                {isActive ? (
                  <LinearGradient
                    colors={['#667eea', '#764ba2', '#5a4fcf']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, styles.sectionTabActive]}
                  />
                ) : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 }}>
                  {isActive ? (
                    <View style={styles.sectionTabIconContainer}>
                      <SectionIcon stroke={2} size={18} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={[styles.sectionTabIconContainer, { backgroundColor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' }]}>
                      <SectionIcon stroke={2} size={18} color={theme.colors.primary || '#667eea'} />
                    </View>
                  )}
                  <Text style={[styles.sectionTabText, { color: isActive ? '#FFFFFF' : theme.colors.text }]}>
                    {section.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Attempt Details Section */}
        {activeSection === 'attempt' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionTitleIconContainer}
              >
                <IconClipboardFilled stroke={2} size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Attempt Details</Text>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Previous Attempts</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>How many times have you appeared?</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity 
                    style={[styles.counterButton, { backgroundColor: theme.colors.background }]}
                    onPress={() => updatePreference('previousAttempts', Math.max(0, (preferences.previousAttempts || 0) - 1))}
                  >
                    <Text style={[styles.counterButtonText, { color: theme.colors.primary }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.colors.text }]}>{preferences.previousAttempts || 0}</Text>
                  <TouchableOpacity 
                    style={[styles.counterButton, { backgroundColor: theme.colors.background }]}
                    onPress={() => updatePreference('previousAttempts', (preferences.previousAttempts || 0) + 1)}
                  >
                    <Text style={[styles.counterButtonText, { color: theme.colors.primary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Target Year</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>When are you planning to appear?</Text>
                </View>
                <View style={styles.yearPicker}>
                  {[2025, 2026, 2027, 2028].map((year) => {
                    const isSelected = preferences.targetYear === year;
                    return (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.yearChip, 
                          { backgroundColor: isSelected ? theme.colors.primary : theme.colors.background }
                        ]}
                        onPress={() => updatePreference('targetYear', year)}
                      >
                        <Text style={[
                          styles.yearChipText, 
                          { color: isSelected ? '#FFFFFF' : theme.colors.text }
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Target Exam</Text>
                </View>
              </View>
              <View style={styles.optionsRow}>
                {['CSE', 'IFoS', 'Both'].map((exam) => (
                  <TouchableOpacity
                    key={exam}
                    style={[
                      styles.optionChip, 
                      { backgroundColor: theme.colors.background },
                      preferences.targetExam === exam && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => updatePreference('targetExam', exam)}
                  >
                    <Text style={[
                      styles.optionChipText, 
                      { color: preferences.targetExam === exam ? '#FFFFFF' : theme.colors.text }
                    ]}>
                      {exam}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Working Professional?</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>We'll adjust your study plan accordingly</Text>
                </View>
                <Switch
                  value={preferences.isWorkingProfessional}
                  onValueChange={(value) => updatePreference('isWorkingProfessional', value)}
                  trackColor={{ false: theme.colors.border, true: '#34C759' }}
                  thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Daily Study Hours</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>How many hours can you dedicate?</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <Text style={[styles.sliderValue, { color: theme.colors.primary }]}>{preferences.availableHoursDaily || 6}h</Text>
                </View>
              </View>
              <View style={styles.hoursSlider}>
                {[2, 4, 6, 8, 10, 12].map((hours) => (
                  <TouchableOpacity
                    key={hours}
                    style={[
                      styles.hourChip, 
                      { backgroundColor: theme.colors.background },
                      preferences.availableHoursDaily === hours && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => updatePreference('availableHoursDaily', hours)}
                  >
                    <Text style={[
                      styles.hourChipText, 
                      { color: theme.colors.text },
                      preferences.availableHoursDaily === hours && styles.hourChipTextActive
                    ]}>
                      {hours}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.divider} />
              
              <Text style={[styles.settingLabel, { marginBottom: 12, color: theme.colors.text }]}>Preferred Time Slots</Text>
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((slot) => {
                  const isSelected = preferences.preferredTimeSlots?.includes(slot.id);
                  const SlotIcon = slot.icon;
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      activeOpacity={0.7}
                      style={[
                        styles.timeSlotChip,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                        isSelected && { borderColor: '#667eea' }
                      ]}
                      onPress={() => toggleTimeSlot(slot.id)}
                    >
                      {isSelected ? (
                        <LinearGradient
                          colors={['#667eea', '#764ba2', '#5a4fcf']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.timeSlotIconContainer}
                        >
                          <SlotIcon stroke={2.5} size={22} color="#FFFFFF" />
                        </LinearGradient>
                      ) : (
                        <View style={[styles.timeSlotIconContainer, { backgroundColor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' }]}>
                          <SlotIcon stroke={2} size={22} color={theme.colors.primary || '#667eea'} />
                        </View>
                      )}
                      <Text style={[
                        styles.timeSlotText,
                        { 
                          color: isSelected ? theme.colors.primary : theme.colors.text,
                          fontWeight: isSelected ? '600' : '500'
                        }
                      ]}>
                        {slot.label.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Customization Section */}
        {activeSection === 'customization' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionTitleIconContainer}
              >
                <IconSettings stroke={2} size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customization</Text>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity style={styles.settingRow} onPress={() => setShowOptionalPicker(true)}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Optional Subject</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>
                    {preferences.optionalSubject || 'Tap to select'}
                  </Text>
                </View>
                <Text style={[styles.settingArrow, { color: theme.colors.border }]}>→</Text>
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <Text style={[styles.settingLabel, { marginBottom: 12, marginTop: 8, color: theme.colors.text }]}>Interest Areas</Text>
              <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Select subjects you want to focus on</Text>
              <View style={styles.interestGrid}>
                {interestAreas.map((area) => {
                  const isSelected = preferences.interestAreas?.includes(area);
                  return (
                    <TouchableOpacity
                      key={area}
                      activeOpacity={0.7}
                      style={[
                        styles.interestChip,
                        { backgroundColor: theme.colors.background },
                        isSelected && { backgroundColor: '#34C759' }
                      ]}
                      onPress={() => toggleInterest(area)}
                    >
                      <Text style={[
                        styles.interestChipText,
                        { color: theme.colors.text },
                        isSelected && styles.interestChipTextActive
                      ]}>
                        {area}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              <View style={styles.divider} />
              
              <Text style={[styles.settingLabel, { marginBottom: 12, marginTop: 8, color: theme.colors.text }]}>Study Style</Text>
              <View style={styles.studyStyleGrid}>
                {studyStyles.map((style) => {
                  const isSelected = preferences.studyStyle === style.id;
                  const StyleIcon = style.icon;
                  return (
                    <TouchableOpacity
                      key={style.id}
                      activeOpacity={0.7}
                      style={[
                        styles.studyStyleCard,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                        isSelected && { borderColor: '#667eea' }
                      ]}
                      onPress={() => updatePreference('studyStyle', style.id)}
                    >
                      {isSelected ? (
                        <LinearGradient
                          colors={['#667eea', '#764ba2', '#5a4fcf']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.studyStyleIconContainer}
                        >
                          <StyleIcon stroke={2.5} size={24} color="#FFFFFF" />
                        </LinearGradient>
                      ) : (
                        <View style={[styles.studyStyleIconContainer, { backgroundColor: isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)' }]}>
                          <StyleIcon stroke={2} size={24} color={theme.colors.primary || '#667eea'} />
                        </View>
                      )}
                      <Text style={[
                        styles.studyStyleLabel, 
                        { 
                          color: isSelected ? theme.colors.primary : theme.colors.text,
                          fontWeight: isSelected ? '700' : '600'
                        }
                      ]}>
                        {style.label}
                      </Text>
                      <Text style={[styles.studyStyleDesc, { color: theme.colors.textSecondary }]}>
                        {style.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingLabelRow}>
                    <LinearGradient
                      colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconContainer}
                    >
                      <IconBellFilled size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Daily Reminders</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.dailyReminderEnabled}
                  onValueChange={(value) => updatePreference('dailyReminderEnabled', value)}
                  trackColor={{ false: theme.colors.border, true: '#34C759' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              {preferences.dailyReminderEnabled && (
                <>
                  <View style={styles.divider} />
                  <TouchableOpacity style={styles.settingRow} onPress={() => setShowTimePicker(true)}>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Reminder Time</Text>
                    </View>
                    <Text style={[styles.timeValue, { color: theme.colors.primary }]}>
                      {formatTime(preferences.dailyReminderTime || '07:00')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              
              <View style={styles.divider} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Revision Reminders</Text>
                </View>
                <Switch
                  value={preferences.revisionRemindersEnabled}
                  onValueChange={(value) => updatePreference('revisionRemindersEnabled', value)}
                  trackColor={{ false: theme.colors.border, true: '#34C759' }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Current Affairs Reminder</Text>
                </View>
                <Switch
                  value={preferences.currentAffairsReminderEnabled}
                  onValueChange={(value) => updatePreference('currentAffairsReminderEnabled', value)}
                  trackColor={{ false: theme.colors.border, true: '#34C759' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        )}

        {/* Performance Goals Section */}
        {activeSection === 'goals' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionTitleIconContainer}
              >
                <IconChartBar stroke={2} size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Performance Goals</Text>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.goalRow}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: theme.colors.text }]}>Daily Target Hours</Text>
                  <Text style={[styles.goalValue, { color: theme.colors.primary }]}>{preferences.dailyTargetHours || 6}h</Text>
                </View>
                <View style={styles.goalSlider}>
                  {[4, 6, 8, 10].map((hours) => (
                    <TouchableOpacity
                      key={hours}
                      style={[
                        styles.goalChip, 
                        { backgroundColor: theme.colors.background },
                        preferences.dailyTargetHours === hours && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => updatePreference('dailyTargetHours', hours)}
                    >
                      <Text style={[
                        styles.goalChipText, 
                        { color: theme.colors.text },
                        preferences.dailyTargetHours === hours && styles.goalChipTextActive
                      ]}>
                        {hours}h
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.goalRow}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: theme.colors.text }]}>Weekly Completion %</Text>
                  <Text style={[styles.goalValue, { color: theme.colors.primary }]}>{preferences.weeklyCompletionTarget || 80}%</Text>
                </View>
                <View style={styles.goalSlider}>
                  {[60, 70, 80, 90, 100].map((pct) => (
                    <TouchableOpacity
                      key={pct}
                      style={[
                        styles.goalChip, 
                        { backgroundColor: theme.colors.background },
                        preferences.weeklyCompletionTarget === pct && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => updatePreference('weeklyCompletionTarget', pct)}
                    >
                      <Text style={[
                        styles.goalChipText, 
                        { color: theme.colors.text },
                        preferences.weeklyCompletionTarget === pct && styles.goalChipTextActive
                      ]}>
                        {pct}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.goalRow}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: theme.colors.text }]}>Mock Tests Per Week</Text>
                  <Text style={[styles.goalValue, { color: theme.colors.primary }]}>{preferences.mockTestsPerWeek || 2}</Text>
                </View>
                <View style={styles.goalSlider}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.goalChip, 
                        { backgroundColor: theme.colors.background },
                        preferences.mockTestsPerWeek === num && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => updatePreference('mockTestsPerWeek', num)}
                    >
                      <Text style={[
                        styles.goalChipText, 
                        { color: theme.colors.text },
                        preferences.mockTestsPerWeek === num && styles.goalChipTextActive
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.goalRow}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: theme.colors.text }]}>Monthly Revision Target</Text>
                  <Text style={[styles.goalValue, { color: theme.colors.primary }]}>{preferences.monthlyRevisionTarget || 4} topics</Text>
                </View>
                <View style={styles.goalSlider}>
                  {[2, 4, 6, 8].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.goalChip, 
                        { backgroundColor: theme.colors.background },
                        preferences.monthlyRevisionTarget === num && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => updatePreference('monthlyRevisionTarget', num)}
                    >
                      <Text style={[
                        styles.goalChipText, 
                        { color: theme.colors.text },
                        preferences.monthlyRevisionTarget === num && styles.goalChipTextActive
                      ]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Privacy & Data Section */}
        {activeSection === 'privacy' && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <LinearGradient
                colors={['#F59E0B', '#D97706', '#B45309']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sectionTitleIconContainer}
              >
                <IconLock stroke={2} size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data & Privacy</Text>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingLabelRow}>
                    <LinearGradient
                      colors={['#60A5FA', '#3B82F6', '#2563EB']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconContainer}
                    >
                      <IconCloudUpload stroke={2} size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <View>
                      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Cloud Sync</Text>
                      <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Sync progress across devices</Text>
                    </View>
                  </View>
                </View>
                <Switch
                  value={preferences.cloudSyncEnabled}
                  onValueChange={(value) => updatePreference('cloudSyncEnabled', value)}
                  trackColor={{ false: theme.colors.border, true: '#34C759' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
            
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.actionCard, { backgroundColor: theme.colors.surface }]} 
              onPress={handleExportData}
            >
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionIconContainer}
              >
                <IconDownload stroke={2} size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Export Progress</Text>
                <Text style={[styles.actionHint, { color: theme.colors.textSecondary }]}>Download your data as JSON</Text>
              </View>
              <Text style={[styles.actionArrow, { color: theme.colors.border }]}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.7}
              style={[styles.actionCard, styles.dangerCard, { backgroundColor: isDark ? '#3A1A1A' : '#FFF5F5' }]} 
              onPress={handleResetRoadmap}
            >
              <LinearGradient
                colors={['#EF4444', '#DC2626', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionIconContainer}
              >
                <IconTrash stroke={2} size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionLabel, styles.dangerText]}>Reset Roadmap</Text>
                <Text style={[styles.actionHint, { color: theme.colors.textSecondary }]}>Clear all progress and start fresh</Text>
              </View>
              <Text style={[styles.actionArrow, { color: theme.colors.border }]}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Optional Subject Picker Modal */}
      <Modal visible={showOptionalPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Optional Subject</Text>
            <ScrollView style={styles.optionalsList}>
              {AVAILABLE_OPTIONALS.map((optional) => (
                <TouchableOpacity
                  key={optional}
                  style={[
                    styles.optionalItem,
                    { backgroundColor: theme.colors.background },
                    preferences.optionalSubject === optional && [styles.optionalItemActive, { backgroundColor: isDark ? '#1A3A5C' : '#E5F3FF', borderColor: theme.colors.primary }]
                  ]}
                  onPress={() => {
                    updatePreference('optionalSubject', optional);
                    setShowOptionalPicker(false);
                  }}
                >
                  <Text style={[
                    styles.optionalItemText,
                    { color: theme.colors.text },
                    preferences.optionalSubject === optional && { color: theme.colors.primary, fontWeight: '600' }
                  ]}>
                    {optional}
                  </Text>
                  {preferences.optionalSubject === optional && (
                    <Text style={[styles.optionalCheck, { color: theme.colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setShowOptionalPicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Reminder Time</Text>
            <View style={styles.timeGrid}>
              {reminderTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    { 
                      backgroundColor: preferences.dailyReminderTime === time 
                        ? theme.colors.primary 
                        : theme.colors.background 
                    }
                  ]}
                  onPress={() => {
                    updatePreference('dailyReminderTime', time);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={[
                    styles.timeOptionText,
                    { 
                      color: preferences.dailyReminderTime === time ? '#FFFFFF' : theme.colors.text 
                    }
                  ]}>
                    {formatTime(time)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.background }]}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 17,
    color: '#8E8E93',
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsContent: {
    gap: 8,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 8,
  },
  sectionTabActive: {
    borderRadius: 20,
  },
  sectionTabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTabTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionTitleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingHint: {
    fontSize: 13,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  counterValue: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  yearPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  yearChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  yearChipActive: {
    // Handled inline
  },
  yearChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  yearChipTextActive: {
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  optionChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionChipActive: {
    // Handled inline
  },
  optionChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: '#FFFFFF',
  },
  sliderContainer: {
    alignItems: 'flex-end',
  },
  sliderValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  hoursSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hourChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  hourChipActive: {
    // Handled inline
  },
  hourChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hourChipTextActive: {
    color: '#FFFFFF',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    borderWidth: 2,
  },
  timeSlotChipActive: {
    // Handled inline
  },
  timeSlotIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '500',
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  interestChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestChipActive: {
    // Handled inline
  },
  interestChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  interestChipTextActive: {
    color: '#FFFFFF',
  },
  studyStyleGrid: {
    gap: 8,
  },
  studyStyleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
  },
  studyStyleCardActive: {
    // Handled inline
  },
  studyStyleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studyStyleLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  studyStyleDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalRow: {
    marginBottom: 16,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalSlider: {
    flexDirection: 'row',
    gap: 8,
  },
  goalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  goalChipActive: {
    // Handled inline
  },
  goalChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalChipTextActive: {
    color: '#FFFFFF',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  dangerCard: {
    backgroundColor: '#FFF5F5',
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerText: {
    color: '#FF3B30',
  },
  actionHint: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 18,
    color: '#C7C7CC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionalsList: {
    maxHeight: 400,
  },
  optionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    marginBottom: 8,
  },
  optionalItemActive: {
    backgroundColor: '#E5F3FF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  optionalItemText: {
    fontSize: 16,
  },
  optionalItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  optionalCheck: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

