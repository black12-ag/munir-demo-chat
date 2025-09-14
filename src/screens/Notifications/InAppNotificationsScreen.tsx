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

interface InAppNotificationsScreenProps {
  navigation: NavigationProp<any>;
}

interface Notification {
  id: string;
  type: 'message' | 'missed_call' | 'group_invite' | 'friend_request';
  title: string;
  subtitle?: string;
  avatar: string;
  timestamp: string;
  isOnline?: boolean;
  actionable?: boolean;
  read?: boolean;
}

const InAppNotificationsScreen: React.FC<InAppNotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const dataService = DataService;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Sample notification data - in a real app this would come from your backend
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'message',
        title: 'New message from Sophia',
        subtitle: '"Hey, are you free for a call later?"',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667-3a47d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: '10:30 AM',
        isOnline: true,
        read: false,
      },
      {
        id: '2',
        type: 'missed_call',
        title: 'Missed call from Ethan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: 'Yesterday',
        read: false,
      },
      {
        id: '3',
        type: 'group_invite',
        title: 'Group invite from Friends',
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: '2 days ago',
        actionable: true,
        read: false,
      },
      {
        id: '4',
        type: 'friend_request',
        title: 'Friend request from Liam',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: '3 days ago',
        actionable: true,
        read: false,
      },
      {
        id: '5',
        type: 'message',
        title: 'New message from Olivia',
        subtitle: '"See you soon!"',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: '4 days ago',
        read: true,
      },
      {
        id: '6',
        type: 'missed_call',
        title: 'Missed call from Noah',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        timestamp: '5 days ago',
        read: true,
      },
    ];

    setNotifications(sampleNotifications);
    setLoading(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return { icon: 'chat', color: '#10b981' };
      case 'missed_call':
        return { icon: 'call-missed', color: '#ef4444' };
      case 'group_invite':
        return { icon: 'group-add', color: '#3b82f6' };
      case 'friend_request':
        return { icon: 'person-add', color: '#8b5cf6' };
      default:
        return { icon: 'notifications', color: '#6b7280' };
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Handle navigation based on type
    switch (notification.type) {
      case 'message':
        navigation.navigate('Chat', {
          chatId: notification.id,
          name: notification.title.replace('New message from ', ''),
          avatar: notification.avatar,
        });
        break;
      case 'missed_call':
        navigation.navigate('Calls');
        break;
      case 'group_invite':
      case 'friend_request':
        // Handle invite actions
        break;
      default:
        break;
    }
  };

  const handleAcceptAction = (notification: Notification) => {
    Alert.alert(
      'Request Accepted',
      `You accepted the ${notification.type === 'group_invite' ? 'group invite' : 'friend request'}.`,
      [{ text: 'OK' }]
    );
    
    // Remove from notifications
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const handleDeclineAction = (notification: Notification) => {
    Alert.alert(
      'Request Declined',
      `You declined the ${notification.type === 'group_invite' ? 'group invite' : 'friend request'}.`,
      [{ text: 'OK' }]
    );
    
    // Remove from notifications
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const renderNotification = (notification: Notification) => {
    const iconData = getNotificationIcon(notification.type);

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationItem,
          !notification.read && styles.unreadNotification
        ]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: notification.avatar }} style={styles.avatar} />
          {notification.isOnline && <View style={styles.onlineIndicator} />}
          <View style={[styles.notificationBadge, { backgroundColor: iconData.color }]}>
            <MaterialIcons
              name={iconData.icon as any}
              size={14}
              color="#ffffff"
            />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            !notification.read && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          
          {notification.subtitle && (
            <Text style={styles.notificationSubtitle}>
              {notification.subtitle}
            </Text>
          )}

          {notification.actionable && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptAction(notification)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleDeclineAction(notification)}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllNotifications}
        >
          <MaterialIcons name="clear-all" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#6b7280" />
            <Text style={styles.emptyStateText}>No notifications</Text>
            <Text style={styles.emptyStateSubtext}>
              You're all caught up! New notifications will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map(renderNotification)}
          </View>
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
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
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
    paddingHorizontal: 32,
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
    lineHeight: 22,
  },
  notificationsList: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  unreadNotification: {
    backgroundColor: '#1f2937',
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#111827',
  },
  notificationBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#111827',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#90b7cb',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  acceptButton: {
    backgroundColor: '#0da6f2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  declineButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    color: '#90b7cb',
    marginTop: 4,
  },
});

export default InAppNotificationsScreen;