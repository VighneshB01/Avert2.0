import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '@/constants/colors';
import { AlertTriangle, CheckCircle, AlertCircle, HelpCircle, Activity } from 'lucide-react-native';
import { useThemeStore } from '@/store/theme-store';

type StatusLevel = 'safe' | 'warning' | 'danger' | 'unknown';

interface StatusCardProps {
  level: StatusLevel;
  message: string;
  lastUpdated: string;
  activeIncidents?: number;
}

export default function StatusCard({ level, message, lastUpdated, activeIncidents }: StatusCardProps) {
  const colors = getColors();

  const getStatusColor = () => {
    switch (level) {
      case 'safe': return colors.statusSafe;
      case 'warning': return colors.statusWarning;
      case 'danger': return colors.statusDanger;
      default: return colors.statusUnknown;
    }
  };

  const getStatusIcon = () => {
    switch (level) {
      case 'safe':
        return <CheckCircle size={24} color={colors.statusSafe} />;
      case 'warning':
        return <AlertTriangle size={24} color={colors.statusWarning} />;
      case 'danger':
        return <AlertCircle size={24} color={colors.statusDanger} />;
      default:
        return <HelpCircle size={24} color={colors.statusUnknown} />;
    }
  };

  const getStatusText = () => {
    switch (level) {
      case 'safe': return 'Safe';
      case 'warning': return 'Warning';
      case 'danger': return 'Danger';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor(), backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
          Updated: {formatDate(lastUpdated)}
        </Text>
      </View>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      
      {activeIncidents !== undefined && activeIncidents > 0 && (
        <View style={styles.activeIncidentsContainer}>
          <Activity size={16} color={colors.statusActive} />
          <Text style={[styles.activeIncidentsText, { color: colors.statusActive }]}>
            {activeIncidents} active incident{activeIncidents !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: 12,
  },
  activeIncidentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  activeIncidentsText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});