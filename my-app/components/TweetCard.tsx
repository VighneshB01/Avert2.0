import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { getColors } from '@/constants/colors';
import { Twitter, AlertTriangle } from 'lucide-react-native';

interface TweetCardProps {
  text: string;
  author: string;
  created_at: string;
  disaster_confidence: number;
}

export default function TweetCard({ text, author, created_at, disaster_confidence }: TweetCardProps) {
  const colors = getColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const date = new Date(created_at);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get severity level
  const getSeverityLevel = () => {
    if (disaster_confidence < 0.25) return 'low';
    if (disaster_confidence < 0.5) return 'moderate';
    if (disaster_confidence < 0.75) return 'high';
    return 'severe';
  };

  // Get severity label
  const getSeverityLabel = () => {
    if (disaster_confidence < 0.25) return 'Low Risk';
    if (disaster_confidence < 0.5) return 'Moderate Risk';
    if (disaster_confidence < 0.75) return 'High Risk';
    return 'Severe Risk';
  };

  // Color schemes that work in both light and dark modes
  const severityColorSchemes = {
    light: {
      low: {
        background: '#e8f5e9',
        border: '#4caf50',
        text: '#1b5e20',
        badge: '#4caf50'
      },
      moderate: {
        background: '#fffde7',
        border: '#ffc107',
        text: '#ff8f00',
        badge: '#ffc107'
      },
      high: {
        background: '#fff3e0',
        border: '#ff9800',
        text: '#e65100',
        badge: '#ff9800'
      },
      severe: {
        background: '#ffebee',
        border: '#f44336',
        text: '#b71c1c',
        badge: '#f44336'
      }
    },
    dark: {
      low: {
        background: 'rgba(76, 175, 80, 0.2)',
        border: '#4caf50',
        text: '#81c784',
        badge: '#4caf50'
      },
      moderate: {
        background: 'rgba(255, 193, 7, 0.2)',
        border: '#ffc107',
        text: '#ffd54f',
        badge: '#ffc107'
      },
      high: {
        background: 'rgba(255, 152, 0, 0.2)',
        border: '#ff9800',
        text: '#ffb74d',
        badge: '#ff9800'
      },
      severe: {
        background: 'rgba(244, 67, 54, 0.2)',
        border: '#f44336',
        text: '#e57373',
        badge: '#f44336'
      }
    }
  };

  const severityLevel = getSeverityLevel();
  const colorSet = isDark 
    ? severityColorSchemes.dark[severityLevel] 
    : severityColorSchemes.light[severityLevel];

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colorSet.background,
        borderLeftColor: colorSet.border,
        borderLeftWidth: disaster_confidence >= 0.5 ? 5 : 2
      }
    ]}>
      {disaster_confidence >= 0.75 && (
        <View style={[styles.alertBanner, { backgroundColor: colorSet.badge }]}>
          <AlertTriangle size={16} color="#ffffff" />
          <Text style={styles.alertText}>URGENT ALERT</Text>
        </View>
      )}
      <View style={styles.header}>
        <Twitter size={20} color={colorSet.border} />
        <Text style={[styles.author, { color: isDark ? colors.text : colorSet.text }]}>@{author}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{formattedDate}</Text>
      </View>
      <Text style={[
        styles.tweetText, 
        { 
          color: isDark ? colors.text : colorSet.text,
          fontWeight: disaster_confidence >= 0.5 ? '600' : 'normal'
        }
      ]}>{text}</Text>
      <View style={styles.footer}>
        <View style={[
          styles.confidenceBadge, 
          { backgroundColor: colorSet.badge }
        ]}>
          <Text style={styles.confidenceText}>
            {getSeverityLabel()} • {(disaster_confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertBanner: {
    padding: 6,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
  },
  alertText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  author: {
    fontWeight: '600',
    marginLeft: 8,
  },
  date: {
    marginLeft: 'auto',
    fontSize: 12,
  },
  tweetText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 