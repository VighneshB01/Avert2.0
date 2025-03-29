import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { getColors } from '@/constants/colors';
import { FileText, Map, Link as LinkIcon, List, FileQuestion, Wrench } from 'lucide-react-native';

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface ResourcesListProps {
  resources: Resource[];
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  const colors = getColors();
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} color={colors.danger} />;
      case 'map':
        return <Map size={20} color={colors.primary} />;
      case 'link':
        return <LinkIcon size={20} color={colors.info} />;
      case 'list':
        return <List size={20} color={colors.textSecondary} />;
      case 'tool':
        return <Wrench size={20} color={colors.success} />;
      default:
        return <FileQuestion size={20} color={colors.textSecondary} />;
    }
  };

  const handleOpenResource = (url: string) => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Cannot open URL:", url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  const renderResourceItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity 
      style={[styles.resourceItem, { backgroundColor: colors.card }]}
      onPress={() => handleOpenResource(item.url)}
      activeOpacity={0.7}
    >
      <View style={[styles.resourceIcon, { backgroundColor: `${colors.background}80` }]}>
        {getResourceIcon(item.type)}
      </View>
      <View style={styles.resourceInfo}>
        <Text style={[styles.resourceTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.resourceType, { color: colors.textSecondary }]}>{item.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
        renderItem={renderResourceItem}
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
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resourceType: {
    fontSize: 12,
  },
});