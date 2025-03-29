import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getColors } from '@/constants/colors';
import { AlertCircle, Clock, CheckCircle, Calendar } from 'lucide-react-native';

interface Directive {
  id: string;
  title: string;
  description: string;
  authority: string;
  status: 'active' | 'expired' | 'scheduled';
  issuedAt: string;
  expiresAt: string | null;
}

interface GovernmentDirectivesListProps {
  directives: Directive[];
}

export default function GovernmentDirectivesList({ directives }: GovernmentDirectivesListProps) {
  const colors = getColors();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.statusActive;
      case 'expired': return colors.statusInactive;
      case 'scheduled': return colors.statusWarning;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertCircle size={20} color={colors.statusActive} />;
      case 'expired':
        return <Clock size={20} color={colors.statusInactive} />;
      case 'scheduled':
        return <Calendar size={20} color={colors.statusWarning} />;
      default:
        return <CheckCircle size={20} color={colors.textSecondary} />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Until further notice';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderDirectiveItem = ({ item }: { item: Directive }) => (
    <View style={[styles.directiveItem, { backgroundColor: colors.card }]}>
      <View style={styles.directiveHeader}>
        <View style={styles.titleContainer}>
          {getStatusIcon(item.status)}
          <Text style={[styles.directiveTitle, { color: colors.text }]}>{item.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.directiveDescription, { color: colors.text }]}>{item.description}</Text>
      
      <View style={styles.directiveFooter}>
        <Text style={[styles.authorityText, { color: colors.textSecondary }]}>
          Issued by: {item.authority}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {item.status === 'scheduled' ? 'Starts: ' : 'Issued: '}{formatDate(item.issuedAt)}
          </Text>
          {item.status !== 'expired' && (
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              Expires: {formatDate(item.expiresAt)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={directives}
        renderItem={renderDirectiveItem}
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
  directiveItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  directiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  directiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  directiveDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  directiveFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  authorityText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeContainer: {},
  timeText: {
    fontSize: 12,
    marginBottom: 2,
  },
});