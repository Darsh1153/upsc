import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../features/Reference/theme/ThemeContext';
import { useWebStyles } from '../components/WebContainer';

import { MOBILE_API_URL } from '../config/api';

export default function ArticleDetailScreen({ route, navigation }) {
  const { articleId } = route.params;
  const { theme, isDark } = useTheme();
  const { horizontalPadding } = useWebStyles();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${MOBILE_API_URL}/articles/${articleId}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setArticle(data.article);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load article. Please try again.');
      console.error('Fetch article error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nRead more on UPSC Prep App`,
        title: article.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleOpenSource = () => {
    if (article.sourceUrl) {
      Linking.openURL(article.sourceUrl);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        const HeadingStyle = block.level === 1 ? styles.h1 : block.level === 2 ? styles.h2 : styles.h3;
        return (
          <Text key={index} style={[HeadingStyle, { color: theme.colors.text }]}>
            {block.content}
          </Text>
        );
      case 'paragraph':
        return (
          <Text key={index} style={[styles.paragraph, { color: theme.colors.text }]}>
            {block.content}
          </Text>
        );
      case 'quote':
        return (
          <View key={index} style={[styles.quoteContainer, { borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.quoteText, { color: theme.colors.textSecondary }]}>
              {block.content}
            </Text>
          </View>
        );
      case 'unordered-list':
      case 'ordered-list':
        return (
          <View key={index} style={styles.listContainer}>
            {(block.items || []).map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={[styles.listBullet, { color: theme.colors.primary }]}>
                  {block.type === 'ordered-list' ? `${i + 1}.` : '•'}
                </Text>
                <Text style={[styles.listText, { color: theme.colors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        );
      default:
        if (block.content) {
          return (
            <Text key={index} style={[styles.paragraph, { color: theme.colors.text }]}>
              {block.content}
            </Text>
          );
        }
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading article...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !article) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { paddingHorizontal: horizontalPadding || 20 }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Error</Text>
          <Text style={[styles.errorSubtitle, { color: theme.colors.textSecondary }]}>
            {error || 'Article not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={fetchArticle}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding || 20 }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {article.sourceUrl && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              onPress={handleOpenSource}
            >
              <Ionicons name="open-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding || 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Header */}
        <View style={styles.articleHeader}>
          {/* Badges */}
          <View style={styles.badgesContainer}>
            {article.gsPaper && (
              <View style={[styles.paperBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.paperBadgeText, { color: theme.colors.primary }]}>
                  {article.gsPaper}
                </Text>
              </View>
            )}
            {article.subject && (
              <View style={[styles.subjectBadge, { backgroundColor: isDark ? '#4A4A52' : '#F0F0F5' }]}>
                <Text style={[styles.subjectBadgeText, { color: theme.colors.textSecondary }]}>
                  {article.subject}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {article.title}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {article.author && (
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {article.author}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                {formatDate(article.publishedDate || article.createdAt)}
              </Text>
            </View>
          </View>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {article.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: isDark ? '#3A3A3C' : '#F2F2F7' }]}>
                  <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {article.summary && (
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.summaryHeader}>
              <Ionicons name="bulb-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Key Takeaway</Text>
            </View>
            <Text style={[styles.summaryText, { color: theme.colors.textSecondary }]}>
              {article.summary}
            </Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.contentContainer}>
          {article.content && article.content.length > 0 ? (
            article.content.map((block, index) => renderContentBlock(block, index))
          ) : (
            <Text style={[styles.paragraph, { color: theme.colors.text }]}>
              {article.metaDescription || 'No content available for this article.'}
            </Text>
          )}
        </View>

        {/* Source Link */}
        {article.sourceUrl && (
          <TouchableOpacity
            style={[styles.sourceButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleOpenSource}
          >
            <Ionicons name="link-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.sourceButtonText, { color: theme.colors.primary }]}>
              Read Original Article
            </Text>
            <Ionicons name="open-outline" size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '400',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
  },
  errorSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  articleHeader: {
    marginBottom: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  paperBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paperBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.6,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '400',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  contentContainer: {
    marginBottom: 24,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  quoteContainer: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    marginVertical: 16,
    paddingVertical: 8,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    fontWeight: '600',
    width: 24,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  sourceButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

