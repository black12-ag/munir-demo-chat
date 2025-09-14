import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  SectionList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Call, User } from '../../types';
import DataService from '../../services/DataService';

interface CallsScreenProps {
  navigation?: any;
}

const CallsScreen: React.FC<CallsScreenProps> = ({ navigation }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'missed'>('all');
  const dataService = DataService;

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const callHistory = await dataService.getCalls();
      setCalls(callHistory);
    } catch (error) {
      Alert.alert('Error', 'Failed to load call history');
    }
  };

  const getFilteredCalls = () => {
    if (selectedTab === 'missed') {
      return calls.filter(call => call.status === 'missed');
    }
    return calls;
  };

  const groupCallsByDate = (calls: Call[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const grouped = calls.reduce((acc, call) => {
      const callDate = new Date(call.timestamp);
      let dateKey: string;
      
      if (callDate.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (callDate.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = callDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(call);
      return acc;
    }, {} as Record<string, Call[]>);

    return Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date]
    }));
  };

  const getUserForCall = (call: Call): User | null => {
    const otherUserId = call.participants.find(id => id !== 'current-user');
    if (otherUserId) {
      return dataService.users.find(u => u.id === otherUserId) || null;
    }
    return null;
  };

  const handleCallBack = (call: Call) => {
    const user = getUserForCall(call);
    if (user) {
      Alert.alert(
        'Call',
        `${call.type === 'video' ? 'Video call' : 'Call'} ${user.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: call.type === 'video' ? 'Video Call' : 'Call', 
            onPress: () => {
              Alert.alert('Calling', `${call.type === 'video' ? 'Video calling' : 'Calling'} ${user.name}...`);
            }
          }
        ]
      );
    }
  };

  const handleDeleteCall = (callId: string) => {
    Alert.alert(
      'Delete Call',
      'Are you sure you want to delete this call from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCalls(prev => prev.filter(c => c.id !== callId));
          }
        }
      ]
    );
  };

  const formatCallDuration = (duration?: number): string => {
    if (!duration) return 'Not connected';
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const formatCallTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCallIcon = (call: Call) => {
    if (call.status === 'missed') {
      return call.type === 'video' ? 'videocam-off' : 'call-outline';
    }
    return call.type === 'video' ? 'videocam' : 'call';
  };

  const getCallIconColor = (call: Call) => {
    if (call.status === 'missed') {
      return '#ef4444';
    }
    if (call.status === 'incoming') {
      return '#10b981';
    }
    return '#0da6f2';
  };

  const renderCall = ({ item }: { item: Call }) => {
    const user = getUserForCall(item);
    if (!user) return null;

    return (
      <TouchableOpacity
        style={styles.callItem}
        onPress={() => handleCallBack(item)}
        onLongPress={() => handleDeleteCall(item.id)}
      >
        <View style={styles.callAvatar}>
          <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
        </View>

        <View style={styles.callInfo}>
          <View style={styles.callHeader}>
            <Text style={styles.callerName}>{user.name}</Text>
            <View style={styles.callStatusContainer}>
              <Ionicons
                name={
                  item.status === 'incoming' ? 'arrow-down' : 
                  item.status === 'outgoing' ? 'arrow-up' : 
                  'arrow-down'
                }
                size={16}
                color={getCallIconColor(item)}
                style={styles.callDirectionIcon}
              />
              <Ionicons
                name={getCallIcon(item)}
                size={16}
                color={getCallIconColor(item)}
              />
            </View>
          </View>
          
          <View style={styles.callDetails}>
            <Text style={styles.callTime}>{formatCallTime(item.timestamp)}</Text>
            <Text style={styles.callDuration}>
              {formatCallDuration(item.duration)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCallBack(item)}
        >
          <Ionicons
            name={item.type === 'video' ? 'videocam' : 'call'}
            size={20}
            color="#0da6f2"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const filteredCalls = getFilteredCalls();
  const groupedCalls = groupCallsByDate(filteredCalls);

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
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All ({calls.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'missed' && styles.activeTab]}
          onPress={() => setSelectedTab('missed')}
        >
          <Text style={[styles.tabText, selectedTab === 'missed' && styles.activeTabText]}>
            Missed ({calls.filter(c => c.status === 'missed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calls List */}
      {groupedCalls.length > 0 ? (
        <SectionList
          sections={groupedCalls}
          renderItem={renderCall}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          style={styles.callsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="call-outline" size={64} color="#90b7cb" />
          <Text style={styles.emptyTitle}>No calls yet</Text>
          <Text style={styles.emptyMessage}>
            {selectedTab === 'missed' 
              ? 'No missed calls' 
              : 'Your call history will appear here'}
          </Text>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="keypad" size={24} color="white" />
      </TouchableOpacity>
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
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  callsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingVertical: 12,
    backgroundColor: '#101d23',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0da6f2',
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2b34',
  },
  callAvatar: {
    marginRight: 16,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  callInfo: {
    flex: 1,
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  callerName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  callStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callDirectionIcon: {
    marginRight: 4,
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTime: {
    fontSize: 14,
    color: '#90b7cb',
    marginRight: 8,
  },
  callDuration: {
    fontSize: 14,
    color: '#90b7cb',
  },
  callButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(13, 166, 242, 0.1)',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0da6f2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0da6f2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CallsScreen;