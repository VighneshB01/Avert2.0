import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getColors } from '@/constants/colors';
import { MapPin, TrafficCone } from 'lucide-react-native';
import { ThumbsUp } from 'lucide-react-native';
import { CheckCircle } from 'lucide-react-native';
import { Clock } from 'lucide-react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Droplets } from 'lucide-react-native';
import { Zap } from 'lucide-react-native';

import { ShoppingCart } from 'lucide-react-native';
import { useDisasterStore } from '@/store/disaster-store';

interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  reportedBy: string;
  reportedAt: string;
  upvotes: number;
  verified: boolean;
  category: string;
  images: string[];
}

interface CommunityReportsListProps {
  reports: Report[];
}

export default function CommunityReportsList({ reports }: CommunityReportsListProps) {
  const colors = getColors();
  const { upvoteReport } = useDisasterStore();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'flooding':
        return <Droplets size={20} color="#3498db" />;
      case 'infrastructure':
        return <Zap size={20} color="#f39c12" />;
      case 'obstruction':
        return <TrafficCone size={20} color="#e74c3c" />;
      case 'resources':
        return <ShoppingCart size={20} color="#2ecc71" />;
      default:
        return <AlertTriangle size={20} color={colors.warning} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const handleUpvote = (id: string) => {
    upvoteReport(id);
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <View style={[styles.reportItem, { backgroundColor: colors.card }]}>
      <View style={styles.reportHeader}>
        <View style={styles.categoryContainer}>
          {getCategoryIcon(item.category)}
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <View style={styles.verificationContainer}>
          {item.verified ? (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color={colors.statusVerified} />
              <Text style={[styles.verifiedText, { color: colors.statusVerified }]}>Verified</Text>
            </View>
          ) : (
            <View style={styles.timeContainer}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{formatDate(item.reportedAt)}</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={[styles.reportTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.reportDescription, { color: colors.text }]}>{item.description}</Text>
      
      {item.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.images[0] }} 
            style={styles.reportImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.locationContainer}>
        <MapPin size={14} color={colors.textSecondary} />
        <Text style={[styles.locationText, { color: colors.textSecondary }]}>{item.location}</Text>
      </View>
      
      <View style={styles.reportFooter}>
        <Text style={[styles.reportedByText, { color: colors.textSecondary }]}>
          Reported by {item.reportedBy}
        </Text>
        <TouchableOpacity 
          style={[styles.upvoteButton, { backgroundColor: `${colors.primary}20` }]}
          onPress={() => handleUpvote(item.id)}
          activeOpacity={0.7}
        >
          <ThumbsUp size={14} color={colors.primary} />
          <Text style={[styles.upvoteText, { color: colors.primary }]}>{item.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
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
  reportItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  imageContainer: {
    marginBottom: 12,
  },
  reportImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    marginLeft: 6,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  reportedByText: {
    fontSize: 12,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upvoteText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});