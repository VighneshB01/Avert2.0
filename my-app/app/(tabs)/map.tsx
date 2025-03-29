import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Alert } from 'react-native';
import MapView, {Heatmap, PROVIDER_DEFAULT, UrlTile, Marker } from 'react-native-maps';
import { getColors } from '@/constants/colors';
import { useDisasterStore } from '@/store/disaster-store';
import LocationCard from '@/components/LocationCard';
import axios from 'axios';
import * as Location from 'expo-location';
import { ActivityIndicator } from 'react-native';
import { FLASK_SERVER_URL } from '@/config';

interface MapConfig {
  tileServer: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  locationName?: string;
}

interface HeatMapPoint {
  latitude: number;
  longitude: number;
  weight: number;
}

export default function MapScreen() {
  const { userLocation, setUserLocation } = useDisasterStore();
  const colors = getColors();
  const [mapConfig, setMapConfig] = useState<MapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatMapPoint[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        // Use fallback configuration if permission denied
        fetchMapConfig();
        return;
      }
      
      try {
        // Get current location
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        // Fetch map config with user's location
        fetchMapConfig(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Failed to get location');
        fetchMapConfig();
      }
    })();
  }, []);

  useEffect(() => {
    console.log("Current user location state:", userLocation);
  }, [userLocation]);

  useEffect(() => {
    // Fetch heatmap data after map config is loaded
    if (mapConfig) {
      fetchHeatmapData();
    }
  }, [mapConfig]);

  const fetchMapConfig = async (latitude?: number, longitude?: number) => {
    try {
      let url = `${FLASK_SERVER_URL}/map/config`; // Replace with your actual IP address
      
      // Add location parameters if available
      if (latitude !== undefined && longitude !== undefined) {
        url += `?lat=${latitude}&lng=${longitude}`;
      }
      
      const response = await axios.get(url);
      console.log("API Response:", response.data);
      console.log("Location name from API:", response.data.locationName);
      
      setMapConfig(response.data);
      
      // Update user location in store with the fetched location name
      if (setUserLocation && latitude !== undefined && longitude !== undefined) {
        console.log("Updating user location with name:", response.data.locationName || 'Unknown Location');
        setUserLocation({
          ...userLocation,
          name: response.data.locationName || 'Unknown Location',
          latitude: latitude,
          longitude: longitude,
        });
        console.log("Updated user location:", userLocation);
      }
    } catch (error) {
      console.error('Failed to fetch map configuration:', error);
      // Fallback configuration
      setMapConfig({
        tileServer: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        initialRegion: {
          latitude: latitude || 40.7128,
          longitude: longitude || -74.0060,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      });
      
      // Still update user location even if API fails
      if (setUserLocation && latitude !== undefined && longitude !== undefined) {
        setUserLocation({
          ...userLocation,
          latitude: latitude,
          longitude: longitude,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapData = async () => {
    // This would normally fetch from an API
    // For demonstration, let's create sample heatmap data around the user's location
    try {
      // You should replace this with your actual endpoint
      // const response = await axios.get('http://192.168.221.88:5500/map/heatmap');
      // setHeatmapData(response.data);

      // For demo purposes, generate dummy heatmap data points
      if (mapConfig && mapConfig.initialRegion) {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = mapConfig.initialRegion;
        const points: HeatMapPoint[] = [];
        
        // Generate a grid of points with varying weights
        for (let lat = latitude - latitudeDelta; lat <= latitude + latitudeDelta; lat += latitudeDelta / 10) {
          for (let lng = longitude - longitudeDelta; lng <= longitude + longitudeDelta; lng += longitudeDelta / 10) {
            // Generate a weight between 0 and 1
            // This is where you'd apply your risk calculation logic
            const distanceFromCenter = Math.sqrt(
              Math.pow(lat - latitude, 2) + Math.pow(lng - longitude, 2)
            );
            
            // Higher weight (risk) for points closer to the center
            const weight = 1 - Math.min(1, distanceFromCenter / Math.max(latitudeDelta, longitudeDelta));
            
            points.push({
              latitude: lat,
              longitude: lng,
              weight: weight * 100 // Scale to 0-100 for better visualization
            });
          }
        }
        
        setHeatmapData(points);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Getting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{errorMsg}</Text>
        </View>
      )}
      
      <View style={styles.mapContainer}>
        {mapConfig && (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={mapConfig.initialRegion}
          >
            <UrlTile
              urlTemplate={mapConfig.tileServer}
              maximumZ={19}
              flipY={false}
            />
            
            {/* Heat Map Layer */}
            {heatmapData.length > 0 && (
              <Heatmap
                points={heatmapData}
                radius={20}
                opacity={0.7}
                gradient={{
                  colors: [
                    colors.statusSafe,      // Low risk (green)
                    colors.statusWarning,   // Moderate risk (yellow/orange)
                    colors.statusDanger,    // High risk (red)
                    '#7D0000'               // Extreme risk (dark red)
                  ],
                  startPoints: [0, 0.33, 0.66, 1],
                }}
              />
            )}
            
            {/* Add a marker for the user's location */}
            {userLocation.latitude && userLocation.longitude && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
                description={userLocation.name}
              />
            )}
          </MapView>
        )}
        
        <View style={[styles.legendContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>Risk Level</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.statusSafe }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>Low (0-25)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.statusWarning }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>Moderate (26-50)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.statusDanger }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>High (51-75)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#7D0000' }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>Extreme (76-100)</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <LocationCard 
          name={userLocation.name}
          riskLevel={userLocation.riskLevel}
          evacuationZone={userLocation.evacuationZone}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  legendContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 8,
    padding: 12,
    minWidth: 150,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItems: {},
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  infoContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});