import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import DataService from '../../services/DataService';
import { User } from '../../types';

interface BlockedUsersScreenProps {
  navigation: NavigationProp<any>;
}

const BlockedUsersScreen: React.FC<BlockedUsersScreenProps> = ({ navigation }) => {
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const dataService = DataService;

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      
      // Get blocked user IDs from settings
      const settings = await dataService.getSettings();
      const blockedUserIds = settings.privacy.blockedUsers;
      
      // Get user details for blocked users
      const allUsers = await dataService.getUsers();
      const blocked = allUsers.filter((user: User) => blockedUserIds.includes(user.id));
      
      setBlockedUsers(blocked);
    } catch (error) {
      console.error('Error loading blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = (user: User) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user.name}? They will be able to call you and send you messages again.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          style: 'default',
          onPress: () => unblockUser(user),
        },
      ]
    );
  };

  const unblockUser = async (user: User) => {
    try {
      await dataService.unblockUser(user.id);
      
      // Update local state
      setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
      
      Alert.alert('Success', `${user.name} has been unblocked.`);
    } catch (error) {
      console.error('Error unblocking user:', error);
      Alert.alert('Error', 'Failed to unblock user. Please try again.');
    }
  };

  const renderBlockedUser = (user: User) => (
    <View key={user.id} style={styles.userItem}>
      <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userSubtitle}>Blocked</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => handleUnblockUser(user)}
        activeOpacity={0.7}
      >
        <Text style={styles.unblockButtonText}>Unblock</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={styles.headerTitle}>Blocked</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Contacts you block will no longer be able to call you or send you messages on this app. 
          This won't affect your interactions on other apps.
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading blocked users...</Text>
          </View>
        ) : blockedUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="block" size={64} color="#6b7280" />
            <Text style={styles.emptyStateText}>No blocked users</Text>
            <Text style={styles.emptyStateSubtext}>
              Users you block will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {blockedUsers.map(renderBlockedUser)}
          </View>
        )}

        {/* Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About blocking</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>
              • Blocked users can't call you or send messages
            </Text>
            <Text style={styles.infoItem}>
              • They won't see when you're online or your last seen
            </Text>
            <Text style={styles.infoItem}>
              • They can't see your profile picture or status updates
            </Text>
            <Text style={styles.infoItem}>
              • You won't receive notifications from them
            </Text>
            <Text style={styles.infoItem}>
              • You can unblock them anytime from this screen
            </Text>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: '#90b7cb',
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  loadingText: {
    fontSize: 16,
    color: '#90b7cb',
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
  usersList: {
    marginBottom: 32,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userSubtitle: {
    fontSize: 14,
    color: '#90b7cb',
  },
  unblockButton: {
    backgroundColor: '#0da6f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoList: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    fontSize: 14,
    color: '#90b7cb',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default BlockedUsersScreen;