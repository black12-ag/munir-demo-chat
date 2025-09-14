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

interface AppSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface SettingItem {
  id: string;
  title: string;
  type: 'navigation' | 'toggle' | 'info';
  value?: string | boolean;
  icon?: string;
  onPress?: () => void;
}

const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);
  const [backgroundRefresh, setBackgroundRefresh] = useState(false);

  const generalSettings: SettingItem[] = [
    {
      id: 'language',
      title: 'Language',
      type: 'navigation',
      value: 'English',
      onPress: () => showLanguageOptions(),
    },
    {
      id: 'theme',
      title: 'Dark Mode',
      type: 'toggle',
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
    },
    {
      id: 'data_usage',
      title: 'Data Usage',
      type: 'navigation',
      onPress: () => navigation.navigate('DataUsage'),
    },
    {
      id: 'storage',
      title: 'Storage',
      type: 'navigation',
      onPress: () => navigation.navigate('Storage'),
    },
    {
      id: 'auto_download',
      title: 'Auto-download Media',
      type: 'toggle',
      value: autoDownload,
      onPress: () => setAutoDownload(!autoDownload),
    },
    {
      id: 'background_refresh',
      title: 'Background App Refresh',
      type: 'toggle',
      value: backgroundRefresh,
      onPress: () => setBackgroundRefresh(!backgroundRefresh),
    },
  ];

  const aboutSettings: SettingItem[] = [
    {
      id: 'app_version',
      title: 'App Version',
      type: 'info',
      value: 'v1.2.3',
    },
    {
      id: 'build_number',
      title: 'Build Number',
      type: 'info',
      value: '2024.09.14',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      type: 'navigation',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      id: 'privacy_policy',
      title: 'Privacy Policy',
      type: 'navigation',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
  ];

  const showLanguageOptions = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Spanish', onPress: () => console.log('Spanish selected') },
        { text: 'French', onPress: () => console.log('French selected') },
        { text: 'German', onPress: () => console.log('German selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Switch
              value={item.value as boolean}
              onValueChange={item.onPress}
              trackColor={{ false: '#374151', true: '#0da6f2' }}
              thumbColor={item.value ? '#ffffff' : '#9ca3af'}
              ios_backgroundColor="#374151"
            />
          </TouchableOpacity>
        );
      
      case 'navigation':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.settingTitle}>{item.title}</Text>
            <View style={styles.navigationContainer}>
              {item.value && (
                <Text style={styles.settingValue}>{item.value}</Text>
              )}
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </View>
          </TouchableOpacity>
        );
      
      case 'info':
        return (
          <View key={item.id} style={styles.settingItem}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderSection = (title: string, items: SettingItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {index < items.length - 1 && <View style={styles.separator} />}
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
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={styles.backButton} />
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('GENERAL', generalSettings)}
        {renderSection('ABOUT', aboutSettings)}
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
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    color: '#9ca3af',
    marginRight: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 16,
  },
});

export default AppSettingsScreen;