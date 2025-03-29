import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '@/constants/colors';
import { MapPin, AlertTriangle } from 'lucide-react-native';

interface LocationCardProps {
  name: string;
  riskLevel: string;
  evacuationZone: string;
}

export default function LocationCard({ name, riskLevel, evacuationZone }: LocationCardProps) {
  const colors = getColors();
  
  const getRiskColor = () => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return colors.statusSafe;
      case 'moderate': return colors.statusWarning;
      case 'high': return colors.statusDanger;
      case 'extreme': return '#7D0000'; // Darker red for extreme
      default: return colors.statusUnknown;
    }
  };

  console.log("LocationCard props:", { name, riskLevel, evacuationZone });

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={20} color={colors.primary} />
          <Text style={[styles.locationName, { color: colors.text }]}>{name}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Risk Level:</Text>
          <View style={styles.riskContainer}>
            <View style={[styles.riskIndicator, { backgroundColor: getRiskColor() }]} />
            <Text style={[styles.riskText, { color: colors.text }]}>{riskLevel}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Evacuation Zone:</Text>
          <View style={styles.zoneContainer}>
            <AlertTriangle size={16} color={colors.warning} />
            <Text style={[styles.zoneText, { color: colors.text }]}>Zone {evacuationZone}</Text>
          </View>
        </View>
      </View>
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '600',
  },
  zoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoneText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});