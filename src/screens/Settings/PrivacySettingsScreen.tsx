import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface PrivacySettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface PrivacySetting {
  id: string;
  title: string;
  subtitle?: string;
  type: 'selection' | 'toggle' | 'navigation';
  value?: string | boolean;
  options?: string[];
  onPress?: () => void;
}

const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({ navigation }) => {
  const [readReceipts, setReadReceipts] = useState(true);
  const [protectIP, setProtectIP] = useState(false);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState('Everyone');
  const [profilePhotoPrivacy, setProfilePhotoPrivacy] = useState('Everyone');
  const [aboutPrivacy, setAboutPrivacy] = useState('Everyone');
  const [statusPrivacy, setStatusPrivacy] = useState('My contacts');
  const [groupsPrivacy, setGroupsPrivacy] = useState('Everyone');

  const privacyOptions = ['Everyone', 'My contacts', 'Nobody'];

  const whoCanSeeSettings: PrivacySetting[] = [
    {
      id: 'last_seen',
      title: 'Last seen & online',
      subtitle: lastSeenPrivacy,
      type: 'selection',
      value: lastSeenPrivacy,
      options: privacyOptions,
      onPress: () => showPrivacyOptions('Last Seen', lastSeenPrivacy, setLastSeenPrivacy),
    },
    {
      id: 'profile_photo',
      title: 'Profile photo',
      subtitle: profilePhotoPrivacy,
      type: 'selection',
      value: profilePhotoPrivacy,
      options: privacyOptions,
      onPress: () => showPrivacyOptions('Profile Photo', profilePhotoPrivacy, setProfilePhotoPrivacy),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: aboutPrivacy,
      type: 'selection',
      value: aboutPrivacy,
      options: privacyOptions,
      onPress: () => showPrivacyOptions('About', aboutPrivacy, setAboutPrivacy),
    },
    {
      id: 'status',
      title: 'Status',
      subtitle: statusPrivacy,
      type: 'selection',
      value: statusPrivacy,
      options: privacyOptions,
      onPress: () => showPrivacyOptions('Status', statusPrivacy, setStatusPrivacy),
    },
  ];

  const messageSettings: PrivacySetting[] = [
    {
      id: 'read_receipts',
      title: 'Read receipts',
      subtitle: 'If you turn off read receipts, you won\'t be able to see read receipts from other people.',
      type: 'toggle',
      value: readReceipts,
      onPress: () => setReadReceipts(!readReceipts),
    },
    {
      id: 'disappearing_timer',
      title: 'Disappearing messages timer',
      type: 'navigation',
      onPress: () => navigation.navigate('DisappearingMessages'),
    },
  ];

  const groupSettings: PrivacySetting[] = [
    {
      id: 'groups_add_me',
      title: 'Who can add me to groups',
      subtitle: groupsPrivacy,
      type: 'selection',
      value: groupsPrivacy,
      options: privacyOptions,
      onPress: () => showPrivacyOptions('Add to Groups', groupsPrivacy, setGroupsPrivacy),
    },
  ];

  const securitySettings: PrivacySetting[] = [
    {
      id: 'blocked_contacts',
      title: 'Blocked contacts',
      subtitle: '0',
      type: 'navigation',
      onPress: () => navigation.navigate('BlockedUsers'),
    },
    {
      id: 'protect_ip',
      title: 'Protect IP address in calls',
      type: 'toggle',
      value: protectIP,
      onPress: () => setProtectIP(!protectIP),
    },
  ];

  const showPrivacyOptions = (title: string, currentValue: string, setValue: (value: string) => void) => {
    Alert.alert(
      `${title} Visibility`,
      'Who can see this information?',
      [
        ...privacyOptions.map(option => ({
          text: option,
          onPress: () => setValue(option),
          style: option === currentValue ? 'default' : 'default' as any,
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderPrivacySetting = (setting: PrivacySetting) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <View key={setting.id} style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              {setting.subtitle && (
                <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
              )}
            </View>
            <Switch
              value={setting.value as boolean}
              onValueChange={setting.onPress}
              trackColor={{ false: '#374151', true: '#0da6f2' }}
              thumbColor={setting.value ? '#ffffff' : '#9ca3af'}
              ios_backgroundColor="#374151"
            />
          </View>
        );
      
      case 'selection':
      case 'navigation':
        return (
          <TouchableOpacity
            key={setting.id}
            style={styles.settingItem}
            onPress={setting.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              {setting.subtitle && (
                <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
              )}
            </View>
            <View style={styles.navigationContainer}>
              {setting.type === 'navigation' && setting.subtitle && (
                <Text style={styles.navigationValue}>{setting.subtitle}</Text>
              )}
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </View>
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  const renderSection = (title: string, settings: PrivacySetting[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {settings.map((setting, index) => (
          <View key={setting.id}>
            {renderPrivacySetting(setting)}
            {index < settings.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
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
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.backButton} />
      </View>

      {/* Privacy Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('WHO CAN SEE YOUR PERSONAL INFO', whoCanSeeSettings)}
        {renderSection('MESSAGES', messageSettings)}
        {renderSection('GROUPS', groupSettings)}
        {renderSection('SECURITY', securitySettings)}
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0da6f2',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingContent: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationValue: {
    fontSize: 16,
    color: '#9ca3af',
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 16,
  },
});

export default PrivacySettingsScreen;