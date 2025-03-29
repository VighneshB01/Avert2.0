import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { getColors } from '@/constants/colors';
import { CheckCircle, Circle } from 'lucide-react-native';
import { useDisasterStore } from '@/store/disaster-store';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function ChecklistCard() {
  const { checklistItems, toggleChecklistItem } = useDisasterStore();
  const colors = getColors();
  
  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const renderItem = ({ item }: { item: ChecklistItem }) => (
    <TouchableOpacity 
      style={[styles.checklistItem, { borderBottomColor: colors.border }]}
      onPress={() => toggleChecklistItem(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        {item.completed ? (
          <CheckCircle size={24} color={colors.success} />
        ) : (
          <Circle size={24} color={colors.textSecondary} />
        )}
      </View>
      <View style={styles.itemContent}>
        <Text style={[
          styles.itemTitle,
          { color: colors.text },
          item.completed && styles.completedText
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.itemDescription,
          { color: colors.textSecondary },
          item.completed && styles.completedText
        ]}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Preparation Checklist</Text>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {completedCount}/{totalCount} completed
        </Text>
      </View>
      
      <View style={[styles.progressContainer, { backgroundColor: `${colors.primary}30` }]}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
      </View>
      
      <FlatList
        data={checklistItems.slice(0, 5)} // Show only first 5 items
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
      
      {totalCount > 5 && (
        <Text style={[styles.moreItems, { color: colors.primary }]}>
          +{totalCount - 5} more items
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 14,
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  listContent: {
    paddingBottom: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  moreItems: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});