import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { DataService } from '../services/DataService';

interface CallRecord {
  id: string;
  name: string;
  image: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string | null;
  time: string;
  callType: 'voice' | 'video';
  timestamp: Date;
}

const CallHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      setLoading(true);
      // Load call history from DataService
      const historyData = await DataService.getCallHistory();
      
      // Mock data for demonstration
      const mockData: CallRecord[] = [
        {
          id: 'call-1',
          name: 'Ethan Harper',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgs4-B-Jc9o82bWQoUphMt18FOiwExHdP2JSp71R_VFXu8nPCWD7bx2s8mDZp_Qnff5Ny5_YedKgSPx8vLg_O8Cgwnysic7fTEoEnhzXCECdnD3kp4bZ270swvuR_7TKUbB7Sl5c0hhjYG4C00uzs5HCRAKqgq9nifzPiZDs0uad4JgMY4wDgIgiVhrJHKikNZVv486gsVlER0wLPYnyApoXgfV9wOFIhiyBcs4dJu-pv3TnZ0BAJusltyHiNdGITXtjWvmzbhBgs',
          type: 'outgoing' as const,
          duration: '1m 23s',
          time: '10:30 AM',
          callType: 'voice' as const,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: 'call-2',
          name: 'Sophia Bennett',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh4Z-2bFCQzgc41ZfcUEqLZSxUALKEYi1NblJWdMR87vP96n1qg_fACMq-c8foc7t5Ak0hwARjbtDqV8V190eACbeJ3AswEYaw6Ho23XlaUT4CQWNDvhOeIFcf6gCyfK5LBPsOe87_oY4Zsqa850-op3AcEjbVXjiuMYLMmdppB7aISQCt4YbDjEyGB--vf-QA3JlSgNBLsYvmHc_Zsb8_T4pXp4V116De4TtGtUyLnGHtGLdS1f-_syuBqdergVvJUl1CRtEtrgw',
          type: 'incoming' as const,
          duration: '2m 45s',
          time: '9:15 AM',
          callType: 'voice' as const,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: 'call-3',
          name: 'Liam Carter',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSUi20fun0FZrwTjCz4_Wcq5ao5UW_SMIWAOez2-m6AdcOpBozdaqNk_50OQ3g9jVyxbljJptL3KxKXEc5eejJPXsF44-uO1lM9rrYwjcKzCGiMUSwSqnNcfJaZmvKmrP-PxI7IaR23Fq0wkdstRrOnKvgzn4DibUEpl-NF0iu6CqN6BM2PvZCkDDMdYAZOm1hhhfko6xWWuMr1CxHV48km89DRGKZdd191HzNybNTvq0o3qp0cGDsTC9-YrwRK3Z0vCehyTHpp8o',
          type: 'outgoing' as const,
          duration: '3m 12s',
          time: 'Yesterday',
          callType: 'voice' as const,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: 'call-4',
          name: 'Olivia Davis',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0R6duTQZ012sne5UoxIXFD6Kiu1V6-V33aKV15OYIOUjaOnCjcqEezdsa07BXD8O-hhkiTRMobgBP5CqQI0iN9CcTLXpQQ9VWTeDwyZ9qfzXziLdh6qcrnnAkrR3hdeizFQEFRuwspuB-qc6d4bYRw5vQvH4hY40NxwB5cFjraeFg19z5b-JpQWckXwojzU23DIkfSaBQBil7IVtSD1JLSdnxTOabMj9G2qzCESE6Nl8AQF6LNzCR6LVLwDbJze4n9gME3NXLcj8',
          type: 'missed' as const,
          duration: null,
          time: '2 days ago',
          callType: 'video' as const,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'call-5',
          name: 'Noah Evans',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDk8upR0zgGiDITD4QHD3iT-jU4ebXRRwZ3Y0q4QLO0CXJ8MYMxGeyRtzp3vJWX-LHN7ux24J6RISx4uwqDt3tzfSCxIeFdeWjahVSVeyKy7gBDiF9CRlWk3qQMxm141OAPXd7ndyIt8aI9g_2BNSez13bLf2pGsHTM1qf5I0tn-GuyQcDY9DQfOzJXPSHbqfhBFyoDejZlM1tuxREdHQhkbhqJBKlttbjEHKWM-p3yTrpauDE_hDzS-Fx88fTbmm26k4GKEsLa6M',
          type: 'outgoing' as const,
          duration: '5m 34s',
          time: '3 days ago',
          callType: 'voice' as const,
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'call-6',
          name: 'Ava Foster',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw0LxucYntRZzi6QM8DH1tOymxtoiXyEnP-3PngvuwZSKuLKOiyrtiHGW67PisHcV8_allCjOu--ues0ofvG4gRN7Y6jDI4uF5iVzFoZSVXO5knUQ6917ILsDJSsbdoNoNxfBqcKr6S0HaUx3iJN_qkEhbo5I6yp9MaYEk6CPTK5oIMOblk5wSV4Kgz_-eBS6NLDZsJe7sTiGkc5HomH6ylKfIAhV9ppsEXnzLLK_Do5lOE2eq5pMV_dYG2jwBnuLASCM89e9dxTc',
          type: 'incoming' as const,
          duration: '6m 21s',
          time: '4 days ago',
          callType: 'video' as const,
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'call-7',
          name: 'Jackson Gray',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZQxA5JP8dx0LDB0QfwhN9hbrXmz5rd2uETzBY6QxiqOZLjLwtBwnDTXShTJS7lVqm98sp5NqeV4rBOPGMq8tJBJHkP_l3Pzi8gZm3mI354yky8QBO1hNQsnq8azx5_hTjcnYDxEcSrkEQQRnSp6Kvdd_QtseU9xmJbvPZpgjT2-owzFcVZMnlOAtGhaIGgHwOGF6TdM9FaJuQxbWGk2rQVSLT648d-iHYJlY6Zdl40zlJxqueH0LahMA458qg6P602zdhVx_ADl8',
          type: 'outgoing' as const,
          duration: '7m 48s',
          time: '5 days ago',
          callType: 'voice' as const,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: 'call-8',
          name: 'Isabella Hayes',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3H7irScCnnhlclZaU1lZXDVs-JCnTArJ7kF-ajB5IIbkRF_1jtNd2tjwXgTtAdgfsROcxWP9CieyzROuVEzBP9X1w3inDhU6A3GqYwUG8Ykx4qWs2G6GwTfenfS8O8KLLCzFKlzP7Fy3ngg1rpSIgG7lSYLbpDM1UuPj1XBVQKK32vzBKlWF15GqJ9pA9ll4p7ah6hU34OclOrmjbvElJes92351i2RGB7w-DApFkxc9pb3bPasH04fKTRHQrR8uP7zldzZ39Rp4',
          type: 'incoming' as const,
          duration: '8m 15s',
          time: '6 days ago',
          callType: 'video' as const,
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
      ];

      setCallHistory(mockData);
    } catch (error) {
      console.error('Error loading call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (contact: CallRecord, isVideo: boolean = false) => {
    if (isVideo) {
      navigation.navigate('VideoCall', {
        name: contact.name,
        avatar: contact.image,
        type: 'video',
        isIncoming: false
      });
    } else {
      navigation.navigate('Call', {
        name: contact.name,
        avatar: contact.image,
        type: 'voice',
        isIncoming: false
      });
    }
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'outgoing':
        return { name: 'call-made', color: '#22c55e', rotation: 0 };
      case 'incoming':
        return { name: 'call-received', color: '#22c55e', rotation: 0 };
      case 'missed':
        return { name: 'call-received', color: '#ef4444', rotation: 0 };
      default:
        return { name: 'call', color: '#9ca3af', rotation: 0 };
    }
  };

  const formatCallDetails = (item: CallRecord) => {
    const icon = getCallIcon(item.type);
    let details = '';
    
    if (item.type === 'missed') {
      details = `Missed • ${item.time}`;
    } else {
      const typeText = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      details = `${typeText} • ${item.duration} • ${item.time}`;
    }
    
    return { icon, details };
  };

  const renderCallItem = ({ item }: { item: CallRecord }) => {
    const { icon, details } = formatCallDetails(item);
    const shouldShowVideoButton = item.callType === 'video' || item.type === 'missed';

    return (
      <View style={styles.callItem}>
        <View style={styles.callInfo}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          <View style={styles.callDetails}>
            <Text style={styles.contactName}>{item.name}</Text>
            <View style={styles.callMeta}>
              <Icon
                name={icon.name}
                size={16}
                color={icon.color}
                style={[
                  styles.callIcon,
                  icon.name === 'call-made' && { transform: [{ rotate: '-45deg' }] },
                  icon.name === 'call-received' && { transform: [{ rotate: '45deg' }] },
                ]}
              />
              <Text style={styles.callMetaText}>{details}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(item, shouldShowVideoButton)}
        >
          <Icon
            name={shouldShowVideoButton ? 'videocam' : 'call'}
            size={24}
            color="#0da6f2"
          />
        </TouchableOpacity>
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
        >
          <Icon name="arrow-back-ios" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Call History List */}
      <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
    padding: 16,
    backgroundColor: '#101d23',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSpacer: {
    width: 32,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  callDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    marginRight: 4,
  },
  callMetaText: {
    fontSize: 14,
    color: '#90b7cb',
  },
  actionButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CallHistoryScreen;