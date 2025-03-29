import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  ActivityIndicator,
  useColorScheme,
  ColorSchemeName
} from 'react-native';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

type Category = 'emergency' | 'medical' | 'fire' | 'police' | 'rescue';

type EmergencyContact = {
  id: string;
  name: string;
  number: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number | null;
  category: Category;
  address?: string;
};

// Default fallback contacts in case API fails
const defaultEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'City Emergency Services',
    number: '911',
    location: { latitude: 26.9124, longitude: 75.7873 },
    distance: null,
    category: 'emergency',
  },
  {
    id: '2',
    name: 'Local Hospital',
    number: '108',
    location: { latitude: 26.9118, longitude: 75.7890 },
    distance: null,
    category: 'medical',
  },
  {
    id: '3',
    name: 'Fire Department',
    number: '101',
    location: { latitude: 26.9130, longitude: 75.7880 },
    distance: null,
    category: 'fire',
  },
  {
    id: '4',
    name: 'Local Police Station',
    number: '100',
    location: { latitude: 26.9100, longitude: 75.7860 },
    distance: null,
    category: 'police',
  },
  {
    id: '5',
    name: 'Rescue Team',
    number: '112',
    location: { latitude: 26.9140, longitude: 75.7900 },
    distance: null,
    category: 'rescue',
  },
];

// OpenStreetMap service category mapping
const osmCategoryMapping = {
  'medical': ['amenity=hospital', 'amenity=clinic', 'healthcare=hospital'],
  'police': ['amenity=police'],
  'fire': ['amenity=fire_station'],
  'rescue': ['emergency=ambulance_station']
};

// Theme colors
const themeColors = {
  light: {
    background: '#FFFFFF',
    cardBackground: '#FFFFFF',
    text: '#333333',
    secondaryText: '#666666',
    tertiaryText: '#757575',
    border: '#F0F0F0',
    buttonBg: '#2196F3',
    buttonText: '#FFFFFF',
    loadingIndicator: '#2196F3',
    refreshIcon: '#2196F3',
    errorText: '#FF5252',
    shadow: '#000000',
  },
  dark: {
    background: '#121212',
    cardBackground: '#1E1E1E',
    text: '#E0E0E0',
    secondaryText: '#B0B0B0',
    tertiaryText: '#909090',
    border: '#2C2C2C',
    buttonBg: '#1976D2',
    buttonText: '#FFFFFF',
    loadingIndicator: '#64B5F6',
    refreshIcon: '#64B5F6',
    errorText: '#FF5252',
    shadow: '#000000',
  }
};

const ContactListCard: React.FC = () => {
  const colorScheme = useColorScheme() as NonNullable<ColorSchemeName>;
  const colors = colorScheme === 'dark' ? themeColors.dark : themeColors.light;
  
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyContacts, setNearbyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchLocationAndServices();
  }, []);

  const fetchLocationAndServices = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setNearbyContacts(defaultEmergencyContacts);
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Fetch actual local emergency services using OpenStreetMap
      await fetchNearbyEmergencyServices(userLocation.coords);
    } catch (error) {
      console.error('Error in location and services fetch:', error);
      setErrorMsg('Error getting location or emergency services');
      setNearbyContacts(defaultEmergencyContacts);
      setLoading(false);
    }
  };

  const fetchNearbyEmergencyServices = async (coords: LocationObjectCoords) => {
    try {
      const allServices: EmergencyContact[] = [];
      const serviceCategories = Object.keys(osmCategoryMapping) as Category[];
      
      // Add a general emergency number based on country
      // First, do a reverse geocode to get the country
      const countryCode = await getCountryCode(coords);
      const emergencyNumber = getEmergencyNumberForCountry(countryCode);
      
      allServices.push({
        id: 'emergency-1',
        name: 'Emergency Services',
        number: emergencyNumber,
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        distance: 0,
        category: 'emergency'
      });
      
      // For each service category, fetch places using Overpass API
      for (const category of serviceCategories) {
        const categoryServices = await fetchServicesByCategory(
          coords, 
          category, 
          osmCategoryMapping[category as keyof typeof osmCategoryMapping]
        );
        allServices.push(...categoryServices);
      }
      
      // Sort by distance and update state
      const sortedServices = allServices.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
      
      if (sortedServices.length > 0) {
        setNearbyContacts(sortedServices);
      } else {
        // Fall back to default if no services found
        setNearbyContacts(defaultEmergencyContacts);
      }
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      // Fall back to default emergency contacts
      setNearbyContacts(defaultEmergencyContacts);
    } finally {
      setLoading(false);
    }
  };
  
  // Get country code using Nominatim reverse geocoding
  const getCountryCode = async (coords: LocationObjectCoords): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=3`
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.address.country_code || 'us'; // Default to US if not found
    } catch (error) {
      console.error('Error getting country code:', error);
      return 'us'; // Default to US on error
    }
  };
  
  // Get appropriate emergency number based on country code
  const getEmergencyNumberForCountry = (countryCode: string): string => {
    const emergencyNumbers: {[key: string]: string} = {
      'us': '911',
      'ca': '911',
      'gb': '999',
      'au': '000',
      'in': '112',
      'eu': '112'
      // Add more country codes and their emergency numbers as needed
    };
    
    return emergencyNumbers[countryCode.toLowerCase()] || '112'; // Default to EU emergency number
  };
  
  // Fetch places by category using Overpass API
  const fetchServicesByCategory = async (
    coords: LocationObjectCoords, 
    category: Category, 
    osmTags: string[]
  ): Promise<EmergencyContact[]> => {
    const radius = 10000; // 10km radius
    const services: EmergencyContact[] = [];
    
    try {
      // Build Overpass query
      const tagsQuery = osmTags.map(tag => `node[${tag}](around:${radius},${coords.latitude},${coords.longitude});`).join('');
      const query = `
        [out:json];
        (
          ${tagsQuery}
        );
        out body;
      `;
      
      // Make request to Overpass API
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'EmergencyApp/1.0 (contact@example.com)' // Add a proper User-Agent
        },
        body: `data=${encodeURIComponent(query)}`
      });
      
      if (!response.ok) {
        throw new Error(`Overpass API call failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process results (limit to 5 closest results)
      for (let i = 0; i < Math.min(5, data.elements.length); i++) {
        const element = data.elements[i];
        
        if (element.type === 'node' && element.lat && element.lon) {
          // Calculate distance
          const distance = calculateDistance(
            coords.latitude,
            coords.longitude,
            element.lat,
            element.lon
          );
          
          // Get more details for the place including contact info
          const contactInfo = await getContactInfoForPlace(element);
          
          // Only add if we have a valid contact number
          if (contactInfo.number) {
            services.push({
              id: `osm-${element.id}`,
              name: element.tags.name || getDefaultNameForCategory(category),
              number: contactInfo.number,
              location: {
                latitude: element.lat,
                longitude: element.lon
              },
              distance: distance,
              category: category,
              address: contactInfo.address
            });
          }
        }
      }
      
      return services;
    } catch (error) {
      console.error(`Error fetching ${category} services:`, error);
      return [];
    }
  };
  
  // Try to get contact info for a place
  const getContactInfoForPlace = async (element: any): Promise<{number: string, address: string}> => {
    let contactNumber = '';
    let address = '';
    
    // Extract from OSM tags if available
    if (element.tags) {
      contactNumber = element.tags.phone || element.tags['contact:phone'] || '';
      
      // Build address from OSM tags
      const addressParts = [];
      if (element.tags['addr:housenumber']) addressParts.push(element.tags['addr:housenumber']);
      if (element.tags['addr:street']) addressParts.push(element.tags['addr:street']);
      if (element.tags['addr:city']) addressParts.push(element.tags['addr:city']);
      if (element.tags['addr:postcode']) addressParts.push(element.tags['addr:postcode']);
      
      address = addressParts.join(', ');
    }
    
    // If no phone number found, try to get more details with a Nominatim search
    if (!contactNumber) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${element.lat}&lon=${element.lon}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'EmergencyApp/1.0 (contact@example.com)' // Add a proper User-Agent
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          address = data.display_name || address;
          
          // Unfortunately, Nominatim doesn't provide phone numbers
          contactNumber = contactNumber || getDefaultNumberForCategory(element.tags);
        }
      } catch (error) {
        console.error('Error getting additional place details:', error);
      }
    }
    
    return {
      number: formatPhoneNumber(contactNumber),
      address: address
    };
  };
  
  // Format phone number to ensure it's dialable
  const formatPhoneNumber = (number: string): string => {
    // Remove any non-digit characters except +
    return number.replace(/[^\d+]/g, '');
  };
  
  // Get default name based on category
  const getDefaultNameForCategory = (category: Category): string => {
    switch (category) {
      case 'medical': return 'Hospital';
      case 'police': return 'Police Station';
      case 'fire': return 'Fire Station';
      case 'rescue': return 'Rescue Service';
      default: return 'Emergency Service';
    }
  };
  
  // Get default phone number based on OSM tags and category
  const getDefaultNumberForCategory = (tags: any): string => {
    // Try to determine a reasonable number based on the type of service
    if (tags.amenity === 'hospital' || tags.healthcare === 'hospital') return '108';
    if (tags.amenity === 'police') return '100';
    if (tags.amenity === 'fire_station') return '101';
    return '112'; // EU/India general emergency number as a fallback
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const handleCallPress = (number: string): void => {
    Linking.canOpenURL(`tel:${number}`)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(`tel:${number}`);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const getCategoryColor = (category: Category): string => {
    // Adjusted to ensure colors are visible in both light and dark themes
    switch (category) {
      case 'emergency': return '#FF5252';
      case 'medical': return '#66BB6A';
      case 'fire': return '#FFA726';
      case 'police': return '#42A5F5';
      case 'rescue': return '#AB47BC';
      default: return '#9E9E9E';
    }
  };

  const renderContactItem = ({ item }: { item: EmergencyContact }) => (
    <TouchableOpacity 
      style={[
        styles.contactItem, 
        { borderBottomColor: colors.border }
      ]} 
      onPress={() => handleCallPress(item.number)}
    >
      <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(item.category) }]} />
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactNumber, { color: colors.secondaryText }]}>{item.number}</Text>
        {item.address && (
          <Text style={[styles.addressText, { color: colors.tertiaryText }]} numberOfLines={1}>{item.address}</Text>
        )}
        {item.distance !== null && (
          <View style={styles.distanceContainer}>
            <MaterialIcons name="location-on" size={12} color={colors.tertiaryText} />
            <Text style={[styles.distanceText, { color: colors.tertiaryText }]}>{item.distance?.toFixed(1)} km away</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={[styles.callButton, { backgroundColor: colors.buttonBg }]} onPress={() => handleCallPress(item.number)}>
        <MaterialIcons name="phone" size={20} color={colors.buttonText} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Create dynamic styles based on the current theme
  const dynamicStyles = {
    container: {
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
    },
    header: {
      color: colors.text,
    },
    refreshButton: {
      color: colors.refreshIcon,
    },
    loadingContainer: {
      color: colors.secondaryText,
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, dynamicStyles.header]}>Nearest Emergency Contacts</Text>
        <TouchableOpacity onPress={fetchLocationAndServices} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={20} color={colors.refreshIcon} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.loadingIndicator} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Finding nearby emergency services...</Text>
        </View>
      ) : errorMsg ? (
        <Text style={[styles.errorText, { color: colors.errorText }]}>{errorMsg}</Text>
      ) : (
        <FlatList
          data={nearbyContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 5,
  },
  list: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 8,
    height: '80%',
    borderRadius: 4,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactNumber: {
    fontSize: 14,
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: '90%',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  distanceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  callButton: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    padding: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ContactListCard;