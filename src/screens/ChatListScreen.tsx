import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const SAMPLE_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Sophia Bennett',
    lastMessage: 'Hey, are you free for a quick chat?',
    time: '10:42 AM',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667-3a47d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Ethan Carter',
    lastMessage: 'The meeting is scheduled for 3 PM',
    time: '9:15 AM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    unreadCount: 2,
  },
  {
    id: '3',
    name: 'Design Team',
    lastMessage: 'New mockups are ready for review',
    time: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    unreadCount: 5,
  },
  {
    id: '4',
    name: 'Liam Harper',
    lastMessage: 'Thanks for the help!',
    time: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  },
];

const STORY_USERS = [
  { id: '1', name: 'Sophia', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667-3a47d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: '2', name: 'Ethan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: '3', name: 'Liam', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: '4', name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
];

interface ChatListScreenProps {
  navigation: any;
  onLogout?: () => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation, onLogout }) => {
  const renderStoryItem = (item: typeof STORY_USERS[0]) => (
    <TouchableOpacity key={item.id} style={styles.storyItem}>
      <View style={styles.storyImageContainer}>
        <Image source={{ uri: item.avatar }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleChatPress = (chat: ChatItem) => {
    navigation.navigate('Chat', {
      chatId: chat.id,
      name: chat.name,
      avatar: chat.avatar,
      isOnline: chat.isOnline
    });
  };

  const renderChatItem = (item: ChatItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101d23" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b667-3a47d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={() => navigation.navigate('NewChat')}
        >
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchInputContainer}
          onPress={() => navigation.navigate('GlobalSearch')}
        >
          <Ionicons name="search" size={20} color="#90b7cb" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <View style={styles.storiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {STORY_USERS.map(renderStoryItem)}
          </ScrollView>
        </View>

        {/* Chat List */}
        <View style={styles.chatList}>
          {SAMPLE_CHATS.map(renderChatItem)}
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble" size={24} color="#0da6f2" />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Calls')}
        >
          <Ionicons name="call-outline" size={24} color="#90b7cb" />
          <Text style={styles.navLabel}>Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Contacts')}
        >
          <Ionicons name="people-outline" size={24} color="#90b7cb" />
          <Text style={styles.navLabel}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#90b7cb" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  newChatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  searchPlaceholder: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#90b7cb',
  },
  scrollView: {
    flex: 1,
  },
  storiesSection: {
    paddingVertical: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 80,
  },
  storyImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyName: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#101d23',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  chatTime: {
    fontSize: 12,
    color: '#90b7cb',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#90b7cb',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#0da6f2',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#182b34',
    borderTopWidth: 1,
    borderTopColor: '#223c49',
    paddingVertical: 8,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#90b7cb',
    marginTop: 4,
  },
  activeNavLabel: {
    color: '#0da6f2',
    fontWeight: 'bold',
  },
});

export default ChatListScreen;