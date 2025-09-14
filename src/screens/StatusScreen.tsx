import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { DataService } from '../services/DataService';

interface StatusUpdate {
  id: string;
  name: string;
  image: string;
  statusImage: string;
  timestamp: Date;
  viewed?: boolean;
}

interface MyStatus {
  id: string;
  profileImage: string;
  hasStatus: boolean;
}

const { width } = Dimensions.get('window');

const StatusScreen: React.FC = () => {
  const navigation = useNavigation();
  const [myStatus, setMyStatus] = useState<MyStatus | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<StatusUpdate[]>([]);
  const [viewedUpdates, setViewedUpdates] = useState<StatusUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStatusData();
  }, []);

  const loadStatusData = async () => {
    try {
      setLoading(true);
      // Load status data from DataService
      const statusData = await DataService.getStatusUpdates();
      
      // Mock data for demonstration
      const mockData = {
        myStatus: {
          id: 'my-status-1',
          profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrT-1SU3S69Oi_iw4oONYLdoCW_kQi-nYHV9B_2pIj_inTd1-DwDp5J9LeOld6WNiXe6xnkYusl50hzzLZkmFtRfjbJSbnWfOkwbqmTW-7i9AdL0tS44MGliXC4p0TY4EGgeJBE9Dvm5m1lEdNsa9FpVtpP1BnX0UaFONrrspLi0E9JzyexectSfFxkOHVaQtrwpfIDB0QybD-zSAn_CZehSyaEkDuKyOEEC6QLtiZ2wkJBM_HlPIGeFOq8ft7m7wcqC-TZxO44Ok',
          hasStatus: false,
        },
        recentUpdates: [
          {
            id: 'status-1',
            name: 'Sophia',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnlKXqIzjkbhISMG0Zj7_2VdLLuot-YCj8UbCIN7uGyh_MkjlHXXPC_keBP3djusexOgDGf2GEmuANTmAoEL1-KW8TOC0E_NxtU10uACY7nAwUzE7oLHGrFVKGWFtgmd-_9TYESWtgfjeD5B30xDBQEEM1RcSsZB1qUpng5CevSTAzKEUzfTR4bOMgVLDbuA09vhtsrobm8fe-OJul6LM8-jqQ_iNw6m7EqkBpi8eKO3418bDVhte6yddDTbXa_sSYWS1SVjJC83U',
            statusImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnlKXqIzjkbhISMG0Zj7_2VdLLuot-YCj8UbCIN7uGyh_MkjlHXXPC_keBP3djusexOgDGf2GEmuANTmAoEL1-KW8TOC0E_NxtU10uACY7nAwUzE7oLHGrFVKGWFtgmd-_9TYESWtgfjeD5B30xDBQEEM1RcSsZB1qUpng5CevSTAzKEUzfTR4bOMgVLDbuA09vhtsrobm8fe-OJul6LM8-jqQ_iNw6m7EqkBpi8eKO3418bDVhte6yddDTbXa_sSYWS1SVjJC83U',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: 'status-2',
            name: 'Ethan',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4aak1hT-y4f2vGPgG82ic8ncuY8SgewiE9EMyOtkwttoD5TErwTEa4dzpD4FL4zom_21gjV08w0Tvgfcih4IVgEplSSpWv0qp-uO2U_hYhBXFOKcVZtGXA8h67YU1MPVKaCX67mHY0AIvPsJeCzJgEwuEnZuZiBMgzv9BonhpU9QjiDgAeN_klDP9W1Q21ZNKENQQqqwHoizMaO6C1MFZDwJGpR0lIcikopwnskf6K93TZ5k4Melw_0gjFm57nDz78lTiSMixXsk',
            statusImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4aak1hT-y4f2vGPgG82ic8ncuY8SgewiE9EMyOtkwttoD5TErwTEa4dzpD4FL4zom_21gjV08w0Tvgfcih4IVgEplSSpWv0qp-uO2U_hYhBXFOKcVZtGXA8h67YU1MPVKaCX67mHY0AIvPsJeCzJgEwuEnZuZiBMgzv9BonhpU9QjiDgAeN_klDP9W1Q21ZNKENQQqqwHoizMaO6C1MFZDwJGpR0lIcikopwnskf6K93TZ5k4Melw_0gjFm57nDz78lTiSMixXsk',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
        ],
        viewedUpdates: [
          {
            id: 'status-3',
            name: 'Olivia',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfdoVljaMqaWIdZsTIbmv9ZjF-FSSaBBBca6lI2x6aSSY05cjKU8wEkRgPRL6pv_ujN5gQnBToGSgONLqFQCB9qoi3bxE3N1wOzyXD3LbE1uoFmTCwoELwqyX2IRGGEas8tKq_U-vaJfrDGGK7l0NU3NDdFa6iPCibbMAaE4CP6Mf4HJxI9DDEov8oxzozKLZxHjemOgETzJymRYKqknFUKMe3HbczNiGmjhVxHifI7Qyw3SHfgQdDJeW_wd76ffaHPVocpggBOuc',
            statusImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfdoVljaMqaWIdZsTIbmv9ZjF-FSSaBBBca6lI2x6aSSY05cjKU8wEkRgPRL6pv_ujN5gQnBToGSgONLqFQCB9qoi3bxE3N1wOzyXD3LbE1uoFmTCwoELwqyX2IRGGEas8tKq_U-vaJfrDGGK7l0NU3NDdFa6iPCibbMAaE4CP6Mf4HJxI9DDEov8oxzozKLZxHjemOgETzJymRYKqknFUKMe3HbczNiGmjhVxHifI7Qyw3SHfgQdDJeW_wd76ffaHPVocpggBOuc',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            viewed: true,
          },
          {
            id: 'status-4',
            name: 'Liam',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJf1aBIEK2zrDuuqUxVI6cxCrrLJu-4rVhYPK1OzuG1z3RgbZ4wk1Bx-a67VEAMHBq29Tcrf5g5trl6ytTTG3q849FNSQ2sSMKAzBeuuE1tqot5zkMSnquQgwAOVmmVlYhOk5imtSXWd7HUr8WqwR11HfYOlRr-jYxutl7i_RtcZgtMp6RSo6wsTUstAH2jL6b0MjRzTwS2So_7s5tg-_fDhmxU7fTkkMg7Ys4kxTxDov-SsSCDp8AtsHP1um4w6PoWlyA1-uIy-s',
            statusImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJf1aBIEK2zrDuuqUxVI6cxCrrLJu-4rVhYPK1OzuG1z3RgbZ4wk1Bx-a67VEAMHBq29Tcrf5g5trl6ytTTG3q849FNSQ2sSMKAzBeuuE1tqot5zkMSnquQgwAOVmmVlYhOk5imtSXWd7HUr8WqwR11HfYOlRr-jYxutl7i_RtcZgtMp6RSo6wsTUstAH2jL6b0MjRzTwS2So_7s5tg-_fDhmxU7fTkkMg7Ys4kxTxDov-SsSCDp8AtsHP1um4w6PoWlyA1-uIy-s',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            viewed: true,
          },
          {
            id: 'status-5',
            name: 'Ava',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAta52K4vBvvC1-CKatrIYK4EfItObmcJz5XEbGXzMh_4IfYw7hDg9rUzZu7WFTpjr3tA5cLAVjCVRG7GVBCrZTQ9N6ZKI6CifSGMAovBnB6vhX6Mwgjbj-yy_iW8P14LHWGQydE7eKs8Wv5Ty4Exct9Y-UHVYdLFf9rfAX68Re3pJ07oivKBta_nWq8iL2xRYg4-FSCCB73iyogcjaLwN4ZH-bL3_47hI-jTR-OMKpTYrpTevhpZdHLWdb5cKKDDnVCvjhOFivCeU',
            statusImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAta52K4vBvvC1-CKatrIYK4EfItObmcJz5XEbGXzMh_4IfYw7hDg9rUzZu7WFTpjr3tA5cLAVjCVRG7GVBCrZTQ9N6ZKI6CifSGMAovBnB6vhX6Mwgjbj-yy_iW8P14LHWGQydE7eKs8Wv5Ty4Exct9Y-UHVYdLFf9rfAX68Re3pJ07oivKBta_nWq8iL2xRYg4-FSCCB73iyogcjaLwN4ZH-bL3_47hI-jTR-OMKpTYrpTevhpZdHLWdb5cKKDDnVCvjhOFivCeU',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            viewed: true,
          },
        ],
      };

      setMyStatus(mockData.myStatus);
      setRecentUpdates(mockData.recentUpdates);
      setViewedUpdates(mockData.viewedUpdates);
    } catch (error) {
      console.error('Error loading status data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStatus = () => {
    Alert.alert(
      'Add Status',
      'Choose an option to add your status',
      [
        { text: 'Camera', onPress: () => console.log('Camera pressed') },
        { text: 'Gallery', onPress: () => console.log('Gallery pressed') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCameraAction = () => {
    Alert.alert('Camera', 'Camera functionality would be implemented here');
  };

  const handleEditAction = () => {
    Alert.alert('Edit', 'Edit functionality would be implemented here');
  };

  const handleStatusPress = (status: StatusUpdate) => {
    Alert.alert('View Status', `Viewing ${status.name}'s status`);
  };

  const renderStatusItem = (item: StatusUpdate, isViewed: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.statusItem, isViewed && styles.statusItemViewed]}
      onPress={() => handleStatusPress(item)}
    >
      <Image source={{ uri: item.statusImage }} style={styles.statusImage} />
      <Text style={[styles.statusName, isViewed && styles.statusNameViewed]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Status Section */}
        <TouchableOpacity style={styles.myStatusContainer} onPress={handleAddStatus}>
          <View style={styles.myStatusContent}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: myStatus?.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.addButton}>
                <Icon name="add" size={16} color="#fff" />
              </View>
            </View>
            <View style={styles.myStatusText}>
              <Text style={styles.myStatusTitle}>My Status</Text>
              <Text style={styles.myStatusSubtitle}>Tap to add status update</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Updates Section */}
        {recentUpdates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent updates</Text>
            <View style={styles.statusGrid}>
              {recentUpdates.map(item => renderStatusItem(item))}
            </View>
          </View>
        )}

        {/* Viewed Updates Section */}
        {viewedUpdates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Viewed updates</Text>
            <View style={styles.statusGrid}>
              {viewedUpdates.map(item => renderStatusItem(item, true))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.floatingButton, styles.editButton]}
          onPress={handleEditAction}
        >
          <Icon name="edit" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.floatingButton, styles.cameraButton]}
          onPress={handleCameraAction}
        >
          <Icon name="photo-camera" size={28} color="#fff" />
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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#101d23',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  myStatusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  myStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0da6f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myStatusText: {
    flex: 1,
  },
  myStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  myStatusSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  statusItemViewed: {
    opacity: 0.7,
  },
  statusImage: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  statusNameViewed: {
    color: '#9ca3af',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'flex-end',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editButton: {
    width: 48,
    height: 48,
    backgroundColor: '#374151',
  },
  cameraButton: {
    backgroundColor: '#0da6f2',
  },
});

export default StatusScreen;