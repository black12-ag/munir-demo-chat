import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import DataService from '../../services/DataService';
import { User } from '../../types';

interface NewChatScreenProps {
  navigation: NavigationProp<any>;
}

const NewChatScreen: React.FC<NewChatScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<User[]>([]);
  const [recentChats, setRecentChats] = useState<User[]>([]);

  const dataService = DataService;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, contacts]);

  const loadData = async () => {
    const [users, currentUser] = await Promise.all([
      dataService.getUsers(),
      dataService.getCurrentUser()
    ]);
    const allContacts = users.filter(
      (user: User) => user.id !== currentUser?.id
    );
    setContacts(allContacts);

    // Get recent chat participants
    const chats = await dataService.getChats();
    const recentChatUsers = chats
      .slice(0, 5) // Get 5 most recent
      .map((chat: any) => {
        const otherParticipant = allContacts.find((user: User) => 
          chat.participants.includes(user.id)
        );
        return otherParticipant;
      })
      .filter((user: User | undefined) => user !== undefined) as User[];
    
    setRecentChats(recentChatUsers);
  };

  const filterContacts = () => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    }
  };

  const startChat = async (user: User) => {
    // Find existing chat or create new one
    const chats = await dataService.getChats();
    const currentUser = await dataService.getCurrentUser();
    let existingChat = chats.find((chat: any) => 
      chat.participants.includes(user.id) && 
      chat.participants.includes(currentUser?.id || '')
    );

    if (existingChat) {
      // Navigate to existing chat
      navigation.navigate('Chat', {
        chatId: existingChat.id,
        name: user.name,
        avatar: user.avatar,
        isOnline: user.status === 'online',
        type: 'private'
      });
    } else {
      // Create new chat
      const newChatId = `chat_${Date.now()}`;
      const newChat = {
        id: newChatId,
        type: 'private' as const,
        participants: [currentUser?.id || '', user.id],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
        isMuted: false,
        isPinned: false,
      };

      // Add chat to data service (we'd need to add this method)
      navigation.navigate('Chat', {
        chatId: newChatId,
        name: user.name,
        avatar: user.avatar,
        isOnline: user.status === 'online',
        type: 'private'
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderContactItem = (contact: User, isRecent: boolean = false) => (
    <TouchableOpacity
      key={contact.id}
      style={styles.contactItem}
      onPress={() => startChat(contact)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <View style={[
          styles.statusIndicator,
          { backgroundColor: contact.status === 'online' ? '#10b981' : '#6b7280' }
        ]} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactStatus}>
          {contact.status === 'online' ? 'Online' : `Last seen ${contact.lastSeen || 'recently'}`}
        </Text>
      </View>
      {isRecent && (
        <View style={styles.recentBadge}>
          <Text style={styles.recentBadgeText}>Recent</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="more-vert" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#90b7cb" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            placeholderTextColor="#90b7cb"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <MaterialIcons name="cancel" size={20} color="#90b7cb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* New Group and Broadcast Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="group-add" size={24} color="#0da6f2" />
          </View>
          <Text style={styles.actionText}>New Group</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="campaign" size={24} color="#0da6f2" />
          </View>
          <Text style={styles.actionText}>New Broadcast</Text>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
        {/* Recent Chats Section */}
        {searchQuery === '' && recentChats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            {recentChats.map(contact => renderContactItem(contact, true))}
          </View>
        )}

        {/* All Contacts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery === '' ? 'All Contacts' : 'Search Results'}
          </Text>
          {filteredContacts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={64} color="#6b7280" />
              <Text style={styles.emptyStateText}>
                {searchQuery === '' ? 'No contacts found' : 'No matching contacts'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery === '' 
                  ? 'Add contacts to start chatting' 
                  : 'Try a different search term'
                }
              </Text>
            </View>
          ) : (
            filteredContacts.map(contact => renderContactItem(contact))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  contactsList: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#111827',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
    color: '#90b7cb',
  },
  recentBadge: {
    backgroundColor: '#0da6f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default NewChatScreen;