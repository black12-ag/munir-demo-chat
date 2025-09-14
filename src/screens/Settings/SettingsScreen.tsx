import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface SettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  screen?: string;
  action?: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const settingSections: SettingSection[] = [
    {
      title: 'ACCOUNT',
      items: [
        {
          id: 'account_info',
          title: 'Account Information',
          subtitle: 'Manage your account information',
          icon: 'person',
          screen: 'AccountManagement',
        },
        {
          id: 'change_phone',
          title: 'Change Phone Number',
          subtitle: 'Change your phone number',
          icon: 'phone',
          screen: 'ChangePhoneNumber',
        },
        {
          id: 'email_address',
          title: 'Email Address',
          subtitle: 'Manage your email address',
          icon: 'mail',
          screen: 'ChangeEmailAddress',
        },
      ],
    },
    {
      title: 'NOTIFICATIONS',
      items: [
        {
          id: 'notification_preferences',
          title: 'Notification Preferences',
          subtitle: 'Customize your notification preferences',
          icon: 'notifications',
          screen: 'InAppNotifications',
        },
        {
          id: 'sound_settings',
          title: 'Sound Settings',
          subtitle: 'Manage your sound settings',
          icon: 'volume-up',
          screen: 'NotificationSoundSettings',
        },
      ],
    },
    {
      title: 'PRIVACY',
      items: [
        {
          id: 'privacy_settings',
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy settings',
          icon: 'shield',
          screen: 'PrivacySettings',
        },
        {
          id: 'blocked_users',
          title: 'Blocked Users',
          subtitle: 'Manage blocked users',
          icon: 'block',
          screen: 'BlockedUsers',
        },
      ],
    },
    {
      title: 'GENERAL',
      items: [
        {
          id: 'app_settings',
          title: 'App Settings',
          subtitle: 'Manage app settings',
          icon: 'tune',
          screen: 'AppSettings',
        },
        {
          id: 'help_support',
          title: 'Help & Support',
          subtitle: 'Get help and support',
          icon: 'help',
          screen: 'HelpAndSupport',
        },
      ],
    },
  ];

  const handleItemPress = (item: SettingItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name={item.icon as any} 
          size={24} 
          color="#ffffff" 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
    </TouchableOpacity>
  );

  const renderSection = (section: SettingSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionItems}>
        {section.items.map(renderSettingItem)}
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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map(renderSection)}
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionItems: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
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
  },
});

export default SettingsScreen;