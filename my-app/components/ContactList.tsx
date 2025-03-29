import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Platform } from 'react-native';
import { getColors } from '@/constants/colors';
import { Phone, Shield, Stethoscope, Wrench } from 'lucide-react-native';

interface Contact {
  id: string;
  name: string;
  number: string;
  category: string;
}

interface ContactListProps {
  contacts: Contact[];
  category?: string;
}

export default function ContactList({ contacts, category }: ContactListProps) {
  const colors = getColors();
  
  const filteredContacts = category 
    ? contacts.filter(contact => contact.category === category)
    : contacts;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <Phone size={20} color="#e74c3c" />;
      case 'security':
        return <Shield size={20} color="#3498db" />;
      case 'medical':
        return <Stethoscope size={20} color="#2ecc71" />;
      case 'utilities':
        return <Wrench size={20} color="#f39c12" />;
      default:
        return <Phone size={20} color={colors.primary} />;
    }
  };

  const handleCall = (phoneNumber: string) => {
    const formattedNumber = `tel:${phoneNumber}`;
    Linking.canOpenURL(formattedNumber)
      .then(supported => {
        if (supported) {
          Linking.openURL(formattedNumber);
        } else {
          console.log("Phone call not supported");
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.card }]}
      onPress={() => handleCall(item.number)}
      activeOpacity={0.7}
    >
      <View style={[styles.contactIcon, { backgroundColor: `${colors.background}80` }]}>
        {getCategoryIcon(item.category)}
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactNumber, { color: colors.textSecondary }]}>{item.number}</Text>
      </View>
      <View style={[styles.callButton, { backgroundColor: `${colors.primary}20` }]}>
        <Phone size={18} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});