import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getColors } from '@/constants/colors';
import { Wind, Droplets, Eye, Gauge } from 'lucide-react-native';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  description?: string;
}

export function WeatherCard({ title, value, unit, icon, description }: WeatherCardProps) {
  const colors = getColors();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>
        </View>
        {description && <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>}
      </View>
    </View>
  );
}

export function WeatherGrid({ weatherData }: { weatherData: any }) {
  const colors = getColors();
  
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <WeatherCard
          title="Wind"
          value={weatherData.wind.speed}
          unit="km/h"
          icon={<Wind size={24} color={colors.primary} />}
          description={`Direction: ${weatherData.wind.direction}`}
        />
        <WeatherCard
          title="Pressure"
          value={weatherData.pressure}
          unit="hPa"
          icon={<Gauge size={24} color={colors.primary} />}
        />
      </View>
      <View style={styles.row}>
        <WeatherCard
          title="Visibility"
          value={weatherData.visibility}
          unit="km"
          icon={<Eye size={24} color={colors.primary} />}
        />
        <WeatherCard
          title="Humidity"
          value={weatherData.humidity}
          unit="%"
          icon={<Droplets size={24} color={colors.primary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
  },
});