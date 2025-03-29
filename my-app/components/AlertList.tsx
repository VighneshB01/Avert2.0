import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getColors } from '@/constants/colors';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react-native';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
  time: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const colors = getColors();
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'danger':
        return <AlertCircle size={20} color={colors.danger} />;
      case 'warning':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'info':
      default:
        return <Info size={20} color={colors.info} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return colors.danger;
      case 'warning': return colors.warning;
      case 'info': default: return colors.info;
    }
  };

  const renderAlertItem = ({ item }: { item: Alert }) => (
    <View style={[styles.alertItem, { borderLeftColor: getSeverityColor(item.severity), backgroundColor: colors.card }]}>
      <View style={styles.alertHeader}>
        <View style={styles.titleContainer}>
          {getSeverityIcon(item.severity)}
          <Text style={[styles.alertTitle, { color: colors.text }]}>{item.title}</Text>
        </View>
        <Text style={[styles.alertTime, { color: colors.textSecondary }]}>{item.time}</Text>
      </View>
      <Text style={[styles.alertMessage, { color: colors.text }]}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={alerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  alertItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertTime: {
    fontSize: 12,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
});