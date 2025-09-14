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
import { User, Chat, Message } from '../../types';

interface GlobalSearchScreenProps {
  navigation: NavigationProp<any>;
}

interface SearchResult {
  chats: Chat[];
  contacts: User[];
  messages: Message[];
}

const GlobalSearchScreen: React.FC<GlobalSearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    chats: [],
    contacts: [],
    messages: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  const dataService = DataService;

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults({ chats: [], contacts: [], messages: [] });
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      // Search chats
      const chats = dataService.getChats().filter(chat => 
        chat.participants.some(userId => {
          const user = dataService.getUsers().find(u => u.id === userId);
          return user?.name.toLowerCase().includes(lowerQuery);
        })
      );

      // Search contacts
      const contacts = dataService.getUsers().filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.username?.toLowerCase().includes(lowerQuery) ||
        user.email?.toLowerCase().includes(lowerQuery)
      );

      // Search messages
      const messages = dataService.getAllMessages().filter(message =>
        message.text.toLowerCase().includes(lowerQuery)
      );

      setSearchResults({ chats, contacts, messages });
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ chats: [], contacts: [], messages: [] });
  };

  const navigateToChat = (chatId: string) => {
    navigation.navigate('Chat', { chatId });
  };

  const navigateToContact = (contactId: string) => {
    navigation.navigate('ContactProfile', { contactId });
  };

  const navigateToMessage = (message: Message) => {
    navigation.navigate('Chat', { chatId: message.chatId, messageId: message.id });
  };

  const renderChatResult = (chat: Chat) => {
    const otherParticipant = dataService.getUsers().find(user => 
      user.id !== dataService.getCurrentUser()?.id && chat.participants.includes(user.id)
    );
    
    if (!otherParticipant) return null;

    return (
      <TouchableOpacity
        key={chat.id}
        style={styles.resultItem}
        onPress={() => navigateToChat(chat.id)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: otherParticipant.avatar }} style={styles.resultAvatar} />
        <View style={styles.resultContent}>
          <Text style={styles.resultTitle}>{otherParticipant.name}</Text>
          <Text style={styles.resultSubtitle}>
            {otherParticipant.status === 'online' ? 'Active now' : 
             `Active ${chat.lastActivity || '2d ago'}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContactResult = (contact: User) => (
    <TouchableOpacity
      key={contact.id}
      style={styles.resultItem}
      onPress={() => navigateToContact(contact.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: contact.avatar }} style={styles.resultAvatar} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{contact.name}</Text>
        <Text style={styles.resultSubtitle}>
          {contact.status === 'online' ? 'Active now' : 
           `Active ${contact.lastSeen || '2d ago'}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageResult = (message: Message) => {
    const sender = dataService.getUsers().find(user => user.id === message.senderId);
    const chat = dataService.getChats().find(chat => chat.id === message.chatId);
    
    if (!sender || !chat) return null;

    return (
      <TouchableOpacity
        key={message.id}
        style={styles.messageResultItem}
        onPress={() => navigateToMessage(message)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: sender.avatar }} style={styles.resultAvatar} />
        <View style={styles.resultContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.resultTitle}>{sender.name}</Text>
            <Text style={styles.messageTime}>
              {new Date(message.timestamp).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.messageContent} numberOfLines={2}>
            {message.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderResultSection = (title: string, results: any[], renderFunc: (item: any) => any) => {
    if (results.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>
          {results.map(renderFunc)}
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.backButton} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#90b7cb" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#90b7cb"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <MaterialIcons name="cancel" size={20} color="#90b7cb" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search" size={64} color="#6b7280" />
            <Text style={styles.emptyStateText}>Start typing to search</Text>
            <Text style={styles.emptyStateSubtext}>
              Search across chats, contacts, and messages
            </Text>
          </View>
        ) : isSearching ? (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <>
            {renderResultSection('Chats', searchResults.chats, renderChatResult)}
            {renderResultSection('Contacts', searchResults.contacts, renderContactResult)}
            {renderResultSection('Messages', searchResults.messages, renderMessageResult)}
            
            {searchResults.chats.length === 0 && 
             searchResults.contacts.length === 0 && 
             searchResults.messages.length === 0 && (
              <View style={styles.noResultsState}>
                <MaterialIcons name="search-off" size={64} color="#6b7280" />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try a different search term
                </Text>
              </View>
            )}
          </>
        )}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    position: 'relative',
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
  resultsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionContent: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  messageResultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    marginBottom: 4,
  },
  resultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#90b7cb',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#90b7cb',
  },
  messageContent: {
    fontSize: 14,
    color: '#90b7cb',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
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
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#90b7cb',
  },
  noResultsState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default GlobalSearchScreen;