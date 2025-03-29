import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getColors } from '@/constants/colors';
import { Home, MapPin } from 'lucide-react-native';

interface Shelter {
  name: string;
  distance: number;
  capacity: string;
}

interface ShelterListProps {
  shelters: Shelter[];
}

export default function ShelterList({ shelters }: ShelterListProps) {
  const colors = getColors();
  
  const getCapacityColor = (capacity: string) => {
    switch (capacity.toLowerCase()) {
      case 'available': return colors.statusSafe;
      case 'limited': return colors.statusWarning;
      case 'full': return colors.statusDanger;
      default: return colors.textSecondary;
    }
  };

  const renderShelterItem = ({ item }: { item: Shelter }) => (
    <View style={[styles.shelterItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.shelterIcon, { backgroundColor: `${colors.primary}20` }]}>
        <Home size={20} color={colors.primary} />
      </View>
      <View style={styles.shelterInfo}>
        <Text style={[styles.shelterName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.shelterDetails}>
          <View style={styles.distanceContainer}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={[styles.distanceText, { color: colors.textSecondary }]}>{item.distance} km</Text>
          </View>
          <View style={styles.capacityContainer}>
            <Text style={[styles.capacityText, { color: getCapacityColor(item.capacity) }]}>
              {item.capacity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Nearest Shelters</Text>
      <FlatList
        data={shelters}
        renderItem={renderShelterItem}
        keyExtractor={(item) => item.name}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  shelterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  shelterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shelterInfo: {
    flex: 1,
  },
  shelterName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  shelterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 13,
    marginLeft: 4,
  },
  capacityContainer: {},
  capacityText: {
    fontSize: 13,
    fontWeight: '500',
  },
});