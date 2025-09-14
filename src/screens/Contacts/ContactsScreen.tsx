import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../../types';
import DataService from '../../services/DataService';

interface ContactsScreenProps {
  navigation?: any;
}

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'favorites'>('all');
  const dataService = DataService;

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery, selectedTab]);

  const loadContacts = async () => {
    try {
      const contactList = await dataService.getContacts();
      setContacts(contactList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const filterContacts = () => {
    let filtered = contacts;
    
    if (selectedTab === 'favorites') {
      filtered = filtered.filter(contact => contact.isFavorite);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );
    }
    
    setFilteredContacts(filtered);
  };

  const groupContactsByLetter = (contacts: Contact[]) => {
    const grouped = contacts.reduce((acc, contact) => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(contact);
      return acc;
    }, {} as Record<string, Contact[]>);

    return Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: grouped[letter]
      }));
  };

  const handleContactPress = (contact: Contact) => {
    if (contact.isRegistered) {
      // Start a chat with registered user
      const user = dataService.users.find(u => u.id === contact.id);
      if (user) {
        navigation?.navigate('Chat', {
          chatId: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          isOnline: user.status === 'online',
          type: 'private'
        });
      }
    } else {
      // Show invite options for non-registered contacts
      Alert.alert(
        'Invite Friend',
        `${contact.name} is not on Stitch yet. Invite them?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Invitation', onPress: () => handleInvite(contact) }
        ]
      );
    }
  };

  const handleInvite = (contact: Contact) => {
    Alert.alert('Invitation Sent', `Invitation sent to ${contact.name}!`);
  };

  const handleCall = (contact: Contact) => {
    Alert.alert('Call', `Calling ${contact.name} at ${contact.phone}...`);
  };

  const handleVideoCall = (contact: Contact) => {
    Alert.alert('Video Call', `Video calling ${contact.name}...`);
  };

  const toggleFavorite = (contact: Contact) => {
    const updatedContacts = contacts.map(c =>
      c.id === contact.id ? { ...c, isFavorite: !c.isFavorite } : c
    );
    setContacts(updatedContacts);
  };

  const handleAddContact = () => {
    navigation?.navigate('AddContact');
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
    >
      <View style={styles.contactAvatar}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.defaultAvatarText}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
        )}
        {item.isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.status && (
          <Text style={styles.contactStatus}>{item.status}</Text>
        )}
      </View>

      <View style={styles.contactActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleFavorite(item)}
        >
          <Ionicons
            name={item.isFavorite ? "star" : "star-outline"}
            size={20}
            color={item.isFavorite ? "#FFD700" : "#90b7cb"}
          />
        </TouchableOpacity>

        {item.isRegistered ? (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCall(item)}
            >
              <Ionicons name="call" size={20} color="#90b7cb" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleVideoCall(item)}
            >
              <Ionicons name="videocam" size={20} color="#90b7cb" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => handleInvite(item)}
          >
            <Text style={styles.inviteButtonText}>INVITE</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const groupedContacts = groupContactsByLetter(filteredContacts);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101d23" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity
          onPress={handleAddContact}
          style={styles.addButton}
        >
          <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#90b7cb" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#90b7cb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All ({contacts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'favorites' && styles.activeTab]}
          onPress={() => setSelectedTab('favorites')}
        >
          <Text style={[styles.tabText, selectedTab === 'favorites' && styles.activeTabText]}>
            Favorites ({contacts.filter(c => c.isFavorite).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      {groupedContacts.length > 0 ? (
        <SectionList
          sections={groupedContacts}
          renderItem={renderContact}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#90b7cb" />
          <Text style={styles.emptyTitle}>No contacts found</Text>
          <Text style={styles.emptyMessage}>
            {searchQuery ? 'Try a different search term' : 'Add some contacts to get started'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101d23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#223c49',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#223c49',
    borderRadius: 24,
    height: 48,
  },
  searchIcon: {
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#0da6f2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#90b7cb',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 8,
    backgroundColor: '#101d23',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0da6f2',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2b34',
  },
  contactAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#223c49',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  registeredBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#101d23',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: '#90b7cb',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 12,
    color: '#90b7cb',
    fontStyle: 'italic',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  inviteButton: {
    backgroundColor: '#0da6f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  inviteButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#90b7cb',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ContactsScreen;