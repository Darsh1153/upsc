import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../features/Reference/theme/ThemeContext';
import { useWebStyles } from '../components/WebContainer';

export default function EssayScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { horizontalPadding, isWeb } = useWebStyles();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [language, setLanguage] = useState('English');
  const [wordLimit, setWordLimit] = useState('400');

  const sampleTopics = [
    {
      id: 1,
      title: 'Women Empowerment',
      category: 'Social Issues',
      desc: 'Role of women in nation building',
    },
    {
      id: 2,
      title: 'Climate Change',
      category: 'Environment',
      desc: 'Impact and mitigation strategies',
    },
    {
      id: 3,
      title: 'Digital India',
      category: 'Technology',
      desc: 'Digital transformation of governance',
    },
    {
      id: 4,
      title: 'Indian Democracy',
      category: 'Polity',
      desc: 'Challenges and opportunities',
    },
    {
      id: 5,
      title: 'Economic Reforms',
      category: 'Economy',
      desc: 'Post-liberalization journey',
    },
    {
      id: 6,
      title: 'Ethics in Public Life',
      category: 'Ethics',
      desc: 'Integrity and accountability',
    },
  ];

  const wordLimits = ['200', '400', '600', '800', '1000'];

  const handleGenerate = () => {
    // In production, this would call AI to generate essay
    alert('Essay generation feature coming soon! This will generate a structured essay based on your topic.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding || 20 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Essay Practice</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Improve your writing skills</Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Language</Text>
          <View style={styles.optionRow}>
            {['English', 'Hindi'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.optionChip, { backgroundColor: theme.colors.surface }, language === lang && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }]}
                onPress={() => setLanguage(lang)}
              >
                <Text style={[styles.optionText, { color: theme.colors.text }, language === lang && { color: theme.colors.primary }]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Word Limit */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Word Limit</Text>
          <View style={styles.optionRow}>
            {wordLimits.map((limit) => (
              <TouchableOpacity
                key={limit}
                style={[styles.optionChip, styles.smallChip, { backgroundColor: theme.colors.surface }, wordLimit === limit && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary }]}
                onPress={() => setWordLimit(limit)}
              >
                <Text style={[styles.optionText, { color: theme.colors.text }, wordLimit === limit && { color: theme.colors.primary }]}>
                  {limit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Topic Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Custom Topic</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
            placeholder="Enter your essay topic..."
            placeholderTextColor={theme.colors.textTertiary}
            value={customTopic}
            onChangeText={(text) => {
              setCustomTopic(text);
              setSelectedTopic(null);
            }}
          />
        </View>

        {/* Sample Topics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Or Choose a Topic</Text>
          <View style={styles.topicsGrid}>
            {sampleTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[styles.topicCard, { backgroundColor: theme.colors.surface }, selectedTopic === topic.id && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedTopic(topic.id);
                  setCustomTopic('');
                }}
              >
                <Text style={[styles.topicCategory, { color: theme.colors.primary }]}>{topic.category}</Text>
                <Text style={[styles.topicTitle, { color: theme.colors.text }, selectedTopic === topic.id && { color: theme.colors.primary }]}>
                  {topic.title}
                </Text>
                <Text style={[styles.topicDesc, { color: theme.colors.textSecondary }]}>{topic.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Essay Structure Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.infoBg }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.info }]}>
            <Ionicons name="document-text" size={14} color={theme.colors.info} /> Essay Structure
          </Text>
          <View style={styles.infoList}>
            <Text style={[styles.infoItem, { color: theme.colors.text }]}>• Introduction (10-15%)</Text>
            <Text style={[styles.infoItem, { color: theme.colors.text }]}>• Body with arguments (70-75%)</Text>
            <Text style={[styles.infoItem, { color: theme.colors.text }]}>• Conclusion (10-15%)</Text>
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, (!selectedTopic && !customTopic) && styles.generateButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleGenerate}
          disabled={!selectedTopic && !customTopic}
        >
          <LinearGradient
            colors={(!selectedTopic && !customTopic) ? ['#C7C7CC', '#A1A1A6'] : ['#34C759', '#28A745']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Generate Essay ✍️</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Coming Soon Notice */}
        <View style={[styles.comingSoon, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <Text style={[styles.comingSoonText, { color: theme.colors.textSecondary }]}>
            <Ionicons name="rocket" size={14} color={theme.colors.textSecondary} /> AI-powered essay generation coming soon!
          </Text>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#007AFF',
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  smallChip: {
    paddingHorizontal: 16,
  },
  optionChipActive: {
    borderColor: '#34C759',
    backgroundColor: '#E8F8ED',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  optionTextActive: {
    color: '#34C759',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    fontWeight: '400',
    color: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topicsGrid: {
    gap: 12,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topicCardActive: {
    borderColor: '#34C759',
    backgroundColor: '#F8FFF9',
  },
  topicCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  topicTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  topicTitleActive: {
    color: '#34C759',
  },
  topicDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    letterSpacing: -0.2,
  },
  infoCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#B8860B',
    marginBottom: 10,
  },
  infoList: {},
  infoItem: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1C1C1E',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  generateButton: {},
  generateButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  comingSoon: {
    marginTop: 16,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.2,
  },
});

