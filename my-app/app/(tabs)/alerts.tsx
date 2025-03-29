import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { getColors } from '@/constants/colors';
import AlertsList from '@/components/AlertList';
import { alertsData } from '@/constants/mock-data';
import { useDisasterStore } from '@/store/disaster-store';
import * as Notifications from 'expo-notifications';

// Set up notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AlertsScreen() {
  const colors = getColors();
  const { emergencyStatus } = useDisasterStore();

  useEffect(() => {
    // Request permissions
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    }
    requestPermissions();
  }, []);

  useEffect(() => {
    // Show notification when emergency status changes
    if (emergencyStatus.level === 'danger' || emergencyStatus.level === 'warning') {
      Notifications.scheduleNotificationAsync({
        content: {
          title: emergencyStatus.level === 'danger' ? 'Emergency Alert' : 'Warning',
          body: emergencyStatus.message,
          data: { level: emergencyStatus.level },
        },
        trigger: null, // Show immediately
      });
    }
  }, [emergencyStatus]);

  const handleAlertPress = async (alert: any) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.title,
        body: alert.message,
        data: { severity: alert.severity },
      },
      trigger: null,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <AlertsList 
          alerts={alertsData} 
          onAlertPress={handleAlertPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  flashContainer: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
  },
  flashTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  flashText: {
    fontSize: 14,
  },
});