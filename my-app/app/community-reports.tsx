import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { getColors } from '@/constants/colors';
import { useDisasterStore } from '@/store/disaster-store';
import CommunityReportsList from '@/components/CommunityReportList';
import { Stack } from 'expo-router';
import { MapPin, Camera, Upload, X, AlertTriangle } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function CommunityReportsScreen() {
  const { communityReports, addCommunityReport, userLocation, fetchCommunityReports } = useDisasterStore();
  const colors = getColors();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  const [category, setCategory] = useState('obstruction');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationDistance, setLocationDistance] = useState(0);
  const [reportCoordinates, setReportCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch community reports when the component mounts
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        await fetchCommunityReports();
        console.log("Community reports loaded successfully");
      } catch (error) {
        console.error("Error loading community reports:", error);
        Alert.alert("Error", "Failed to load community reports. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [fetchCommunityReports]);

  // Get user's current location for verification
  useEffect(() => {
    if (showForm && userLocation.latitude && userLocation.longitude) {
      // User location is already available from the dashboard
      console.log("User location available:", userLocation);
    }
  }, [showForm, userLocation]);

  // Verify location when report location is entered
  const verifyLocation = async () => {
    if (!reportLocation.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    try {
      // Check if user's location is available
      if (!userLocation.latitude || !userLocation.longitude) {
        Alert.alert("Error", "Your current location is not available. Please enable location services.");
        return;
      }

      // Geocode the reported location to get coordinates
      const geocodeResult = await Location.geocodeAsync(reportLocation);
      
      if (geocodeResult.length === 0) {
        Alert.alert("Error", "Could not find the location you entered. Please try a more specific address.");
        return;
      }

      const reportCoords = {
        latitude: geocodeResult[0].latitude,
        longitude: geocodeResult[0].longitude
      };
      setReportCoordinates(reportCoords);

      // Calculate distance between user's location and reported location
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        reportCoords.latitude,
        reportCoords.longitude
      );
      
      setLocationDistance(distance);
      
      // Verify if the user is within a reasonable distance (e.g., 10 km)
      if (distance <= 10) {
        setLocationVerified(true);
        Alert.alert("Location Verified", `You are ${distance.toFixed(2)} km from the reported location.`);
      } else {
        setLocationVerified(false);
        Alert.alert(
          "Location Warning", 
          `You are ${distance.toFixed(2)} km from the reported location. For accurate reporting, please only report situations near your current location.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Continue Anyway", onPress: () => setLocationVerified(true) }
          ]
        );
      }
    } catch (error) {
      console.error("Error verifying location:", error);
      Alert.alert("Error", "Failed to verify location. Please try again.");
    }
  };

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  // Pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Sorry, we need camera roll permissions to upload images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Sorry, we need camera permissions to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Submit the report
  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (!reportLocation.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (!locationVerified) {
      Alert.alert("Error", "Please verify your location first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the report object
      const newReport = {
        title,
        description,
        location: reportLocation,
        coordinates: reportCoordinates || {
          latitude: userLocation.latitude || 0,
          longitude: userLocation.longitude || 0
        },
        reportedBy: "You", // In a real app, this would be the user's name or ID
        category,
        images,
      };

      // Add the report to the store (which will save to Firebase)
      await addCommunityReport(newReport);

      // Reset form
      setTitle('');
      setDescription('');
      setReportLocation('');
      setCategory('obstruction');
      setImages([]);
      setLocationVerified(false);
      setReportCoordinates(null);
      setShowForm(false);

      Alert.alert("Success", "Your report has been submitted successfully");
    } catch (error) {
      console.error("Error submitting report:", error);
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: "Community Reports",
        headerTitleStyle: { color: colors.text }
      }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          {!showForm ? (
            <>
              <CommunityReportsList reports={communityReports} />
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.addButtonText}>Report a Situation</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ScrollView style={styles.formContainer}>
              <Text style={[styles.formTitle, { color: colors.text }]}>Report a Situation</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Title*</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                  placeholder="E.g., Fallen tree blocking road"
                  placeholderTextColor={colors.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Description*</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
                  placeholder="Describe the situation in detail..."
                  placeholderTextColor={colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Category*</Text>
                <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={{ color: colors.text }}
                    dropdownIconColor={colors.text}
                  >
                    <Picker.Item label="Road Obstruction" value="obstruction" />
                    <Picker.Item label="Flooding" value="flooding" />
                    <Picker.Item label="Infrastructure Damage" value="infrastructure" />
                    <Picker.Item label="Resource Shortage" value="resources" />
                    <Picker.Item label="Other Emergency" value="emergency" />
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Location*</Text>
                <View style={styles.locationInputContainer}>
                  <TextInput
                    style={[styles.locationInput, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Enter specific location address"
                    placeholderTextColor={colors.textSecondary}
                    value={reportLocation}
                    onChangeText={setReportLocation}
                  />
                  <TouchableOpacity 
                    style={[styles.verifyButton, { 
                      backgroundColor: locationVerified ? colors.success + '20' : colors.primary 
                    }]}
                    onPress={verifyLocation}
                  >
                    <Text style={[styles.verifyButtonText, {
  color: locationVerified ? colors.success : '#FFFFFF'
}]}>
                      {locationVerified ? 'Verified' : 'Verify'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {locationVerified && (
                  <Text style={[styles.verifiedText, { color: colors.success }]}>
                    Location verified ({locationDistance.toFixed(2)} km away)
                  </Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Photos (Optional)</Text>
                <View style={styles.imageButtons}>
                  <TouchableOpacity 
                    style={[styles.imageButton, { backgroundColor: colors.card }]}
                    onPress={takePhoto}
                  >
                    <Camera size={20} color={colors.primary} />
                    <Text style={[styles.imageButtonText, { color: colors.text }]}>Take Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.imageButton, { backgroundColor: colors.card }]}
                    onPress={pickImage}
                  >
                    <Upload size={20} color={colors.primary} />
                    <Text style={[styles.imageButtonText, { color: colors.text }]}>Upload</Text>
                  </TouchableOpacity>
                </View>
                
                {images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    {images.map((uri, index) => (
                      <View key={index} style={styles.imagePreview}>
                        <TouchableOpacity 
                          style={styles.removeImageButton}
                          onPress={() => removeImage(index)}
                        >
                          <X size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { borderColor: colors.border }]}
                  onPress={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.submitButton, 
                    { 
                      backgroundColor: locationVerified ? colors.primary : colors.textSecondary,
                      opacity: isSubmitting ? 0.7 : 1
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting || !locationVerified}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.disclaimer}>
                <AlertTriangle size={16} color={colors.warning} />
                <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                  Please only report verified situations. False reports may result in account restrictions.
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedText: {
    marginTop: 4,
    fontSize: 12,
  },
  imageButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  imageButtonText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreview: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 12,
  },
  disclaimerText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  }
});