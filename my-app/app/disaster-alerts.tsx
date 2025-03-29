import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getColors } from '@/constants/colors';
import { useDisasterStore } from '@/store/disaster-store';
import TweetCard from '@/components/TweetCard';
import { Stack } from 'expo-router';

export default function DisasterAlertsScreen() {
  const { disasterTweets, isLoading, error } = useDisasterStore();
  const colors = getColors();
  
  const renderContent = () => {
    if (error) {
      return (
        <View style={[styles.messageContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (isLoading && disasterTweets.length === 0) {
      return (
        <View style={[styles.messageContainer, { backgroundColor: colors.card }]}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading disaster alerts...
          </Text>
        </View>
      );
    }

    if (!disasterTweets || disasterTweets.length === 0) {
      return (
        <View style={[styles.messageContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No disaster alerts at this time
          </Text>
        </View>
      );
    }

    return disasterTweets.map((tweet, index) => (
      <TweetCard
        key={index}
        text={tweet.text}
        author={tweet.author}
        created_at={tweet.created_at}
        disaster_confidence={tweet.disaster_confidence}
      />
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ 
        title: "Disaster Alerts",
        headerTitleStyle: { color: colors.text }
      }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  messageContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});