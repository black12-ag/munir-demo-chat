import React, { useState, useEffect } from 'react';
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
import DataService from '../../services/DataService';

interface NotificationSoundSettingsScreenProps {
  navigation: NavigationProp<any>;
}

interface SoundOption {
  id: string;
  name: string;
  displayName: string;
}

interface SoundSetting {
  id: string;
  title: string;
  subtitle: string;
  currentSound: string;
  options: SoundOption[];
}

const NotificationSoundSettingsScreen: React.FC<NotificationSoundSettingsScreenProps> = ({ navigation }) => {
  const [inAppSounds, setInAppSounds] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [messageSoundId, setMessageSoundId] = useState('chime');
  const [groupSoundId, setGroupSoundId] = useState('tri_tone');
  const [ringtoneSoundId, setRingtoneSoundId] = useState('opening');

  const dataService = DataService;

  const soundOptions: SoundOption[] = [
    { id: 'chime', name: 'chime', displayName: 'Chime' },
    { id: 'tri_tone', name: 'tri_tone', displayName: 'Tri-tone' },
    { id: 'ping', name: 'ping', displayName: 'Ping' },
    { id: 'bell', name: 'bell', displayName: 'Bell' },
    { id: 'pop', name: 'pop', displayName: 'Pop' },
    { id: 'none', name: 'none', displayName: 'None' },
  ];

  const ringtoneOptions: SoundOption[] = [
    { id: 'opening', name: 'opening', displayName: 'Opening' },
    { id: 'classic', name: 'classic', displayName: 'Classic' },
    { id: 'vibrant', name: 'vibrant', displayName: 'Vibrant' },
    { id: 'digital', name: 'digital', displayName: 'Digital' },
    { id: 'melody', name: 'melody', displayName: 'Melody' },
  ];

  const messageSoundSettings: SoundSetting[] = [
    {
      id: 'messages',
      title: 'Messages',
      subtitle: 'Choose a sound for new messages',
      currentSound: messageSoundId,
      options: soundOptions,
    },
    {
      id: 'group_chats',
      title: 'Group Chats',
      subtitle: 'Choose a sound for group messages',
      currentSound: groupSoundId,
      options: soundOptions,
    },
  ];

  const callSoundSettings: SoundSetting[] = [
    {
      id: 'ringtone',
      title: 'Ringtone',
      subtitle: 'Choose a sound for incoming calls',
      currentSound: ringtoneSoundId,
      options: ringtoneOptions,
    },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = dataService.getSettings();
      setInAppSounds(settings.notifications.sound);
      setVibrate(settings.notifications.vibration);
      setSilentMode(!settings.notifications.enabled);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const updateSettings = async (updates: any) => {
    try {
      await dataService.updateSettings({
        notifications: {
          ...dataService.getSettings().notifications,
          ...updates,
        },
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleSoundSelection = (settingId: string, soundId: string) => {
    switch (settingId) {
      case 'messages':
        setMessageSoundId(soundId);
        break;
      case 'group_chats':
        setGroupSoundId(soundId);
        break;
      case 'ringtone':
        setRingtoneSoundId(soundId);
        break;
    }
    
    // In a real app, you would play the sound here for preview
    console.log(`Selected sound: ${soundId} for ${settingId}`);
  };

  const showSoundPicker = (setting: SoundSetting) => {
    const options = setting.options.map(option => ({
      text: option.displayName,
      onPress: () => handleSoundSelection(setting.id, option.id),
    }));
    
    options.push({ text: 'Cancel', onPress: () => {} });

    Alert.alert(
      `Select ${setting.title} Sound`,
      'Choose a sound for this notification type',
      options
    );
  };

  const getCurrentSoundName = (settingId: string) => {
    let currentId = '';
    let options: SoundOption[] = [];
    
    switch (settingId) {
      case 'messages':
        currentId = messageSoundId;
        options = soundOptions;
        break;
      case 'group_chats':
        currentId = groupSoundId;
        options = soundOptions;
        break;
      case 'ringtone':
        currentId = ringtoneSoundId;
        options = ringtoneOptions;
        break;
    }
    
    const currentOption = options.find(option => option.id === currentId);
    return currentOption?.displayName || 'None';
  };

  const handleInAppSoundsToggle = (value: boolean) => {
    setInAppSounds(value);
    updateSettings({ sound: value });
  };

  const handleVibrateToggle = (value: boolean) => {
    setVibrate(value);
    updateSettings({ vibration: value });
  };

  const handleSilentModeToggle = (value: boolean) => {
    setSilentMode(value);
    updateSettings({ enabled: !value });
    
    if (value) {
      Alert.alert(
        'Silent Mode Enabled',
        'You will not receive any sound or vibration notifications.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderSoundSetting = (setting: SoundSetting) => (
    <TouchableOpacity
      key={setting.id}
      style={styles.soundSettingItem}
      onPress={() => showSoundPicker(setting)}
      activeOpacity={0.7}
    >
      <View style={styles.soundSettingContent}>
        <Text style={styles.soundSettingTitle}>{setting.title}</Text>
        <Text style={styles.soundSettingSubtitle}>{setting.subtitle}</Text>
      </View>
      <View style={styles.soundSettingValue}>
        <Text style={styles.currentSoundText}>
          {getCurrentSoundName(setting.id)}
        </Text>
        <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );

  const renderToggleSetting = (title: string, value: boolean, onToggle: (value: boolean) => void) => (
    <View style={styles.toggleSettingItem}>
      <Text style={styles.toggleSettingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#374151', true: '#0da6f2' }}
        thumbColor={value ? '#ffffff' : '#9ca3af'}
        ios_backgroundColor="#374151"
      />
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Message Sounds */}
        {renderSection(
          'MESSAGE SOUNDS',
          messageSoundSettings.map(renderSoundSetting)
        )}

        {/* Call Sounds */}
        {renderSection(
          'CALL SOUNDS',
          callSoundSettings.map(renderSoundSetting)
        )}

        {/* General Settings */}
        {renderSection(
          'GENERAL SETTINGS',
          <View>
            {renderToggleSetting('In-App Sounds', inAppSounds, handleInAppSoundsToggle)}
            <View style={styles.separator} />
            {renderToggleSetting('Vibrate', vibrate, handleVibrateToggle)}
            <View style={styles.separator} />
            {renderToggleSetting('Silent Mode', silentMode, handleSilentModeToggle)}
          </View>
        )}

        {/* Information */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Sound Settings</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              • Silent mode overrides all sound settings{'\n'}
              • Vibration works independently of sound settings{'\n'}
              • In-app sounds play when the app is active{'\n'}
              • Different sounds help identify notification types{'\n'}
              • Tap any sound setting to hear a preview
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
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  soundSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  soundSettingContent: {
    flex: 1,
  },
  soundSettingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  soundSettingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  soundSettingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSoundText: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
  },
  toggleSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  toggleSettingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 16,
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
  infoContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#90b7cb',
    lineHeight: 20,
  },
});

export default NotificationSoundSettingsScreen;