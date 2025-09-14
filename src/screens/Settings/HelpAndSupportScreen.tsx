import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface HelpAndSupportScreenProps {
  navigation: NavigationProp<any>;
}

interface HelpItem {
  id: string;
  title: string;
  type: 'navigation' | 'action';
  screen?: string;
  action?: () => void;
}

const HelpAndSupportScreen: React.FC<HelpAndSupportScreenProps> = ({ navigation }) => {
  const faqItems: HelpItem[] = [
    {
      id: 'change_profile_picture',
      title: 'How do I change my profile picture?',
      type: 'action',
      action: () => showFAQAnswer('Change Profile Picture', 'Go to Profile → Edit → Tap on your profile picture → Choose from camera or gallery.'),
    },
    {
      id: 'block_user',
      title: 'How do I block a user?',
      type: 'action',
      action: () => showFAQAnswer('Block User', 'Open the chat → Tap on user name → Select "Block User" → Confirm.'),
    },
    {
      id: 'report_user',
      title: 'How do I report a user?',
      type: 'action',
      action: () => showFAQAnswer('Report User', 'Open the chat → Tap on user name → Select "Report User" → Choose reason and submit.'),
    },
    {
      id: 'delete_account',
      title: 'How do I delete my account?',
      type: 'action',
      action: () => showFAQAnswer('Delete Account', 'Go to Settings → Account → Delete Account → Follow the confirmation steps. Warning: This action cannot be undone.'),
    },
    {
      id: 'privacy_settings',
      title: 'How do I change my privacy settings?',
      type: 'action',
      action: () => showFAQAnswer('Privacy Settings', 'Go to Settings → Privacy → Adjust who can see your information and control your visibility.'),
    },
    {
      id: 'notification_settings',
      title: 'How do I manage notifications?',
      type: 'action',
      action: () => showFAQAnswer('Notification Settings', 'Go to Settings → Notifications → Customize your notification preferences and sounds.'),
    },
  ];

  const contactItems: HelpItem[] = [
    {
      id: 'contact_support',
      title: 'Contact Support',
      type: 'action',
      action: () => contactSupport(),
    },
    {
      id: 'send_feedback',
      title: 'Send Feedback',
      type: 'action',
      action: () => sendFeedback(),
    },
    {
      id: 'report_bug',
      title: 'Report a Bug',
      type: 'action',
      action: () => reportBug(),
    },
  ];

  const legalItems: HelpItem[] = [
    {
      id: 'terms_of_service',
      title: 'Terms of Service',
      type: 'action',
      action: () => openTermsOfService(),
    },
    {
      id: 'privacy_policy',
      title: 'Privacy Policy',
      type: 'action',
      action: () => openPrivacyPolicy(),
    },
    {
      id: 'licenses',
      title: 'Open Source Licenses',
      type: 'action',
      action: () => openLicenses(),
    },
  ];

  const showFAQAnswer = (title: string, answer: string) => {
    Alert.alert(title, answer, [{ text: 'OK', style: 'default' }]);
  };

  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact our support team?',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@stitchchat.com?subject=Support Request'),
        },
        {
          text: 'Phone',
          onPress: () => Linking.openURL('tel:+1234567890'),
        },
        {
          text: 'Live Chat',
          onPress: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendFeedback = () => {
    Linking.openURL('mailto:feedback@stitchchat.com?subject=App Feedback');
  };

  const reportBug = () => {
    Linking.openURL('mailto:bugs@stitchchat.com?subject=Bug Report');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://stitchchat.com/terms');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://stitchchat.com/privacy');
  };

  const openLicenses = () => {
    Alert.alert('Open Source Licenses', 'View licenses in the app settings or on our website.');
  };

  const handleItemPress = (item: HelpItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  const renderHelpItem = (item: HelpItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.helpItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.helpItemTitle}>{item.title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: HelpItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={item.id}>
            {renderHelpItem(item)}
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.backButton} />
      </View>

      {/* Help Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('Frequently Asked Questions', faqItems)}
        {renderSection('Contact', contactItems)}
        {renderSection('Legal', legalItems)}

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.appInfoContainer}>
            <Text style={styles.appInfoText}>Stitch Chat v1.2.3</Text>
            <Text style={styles.appInfoSubtext}>Build 2024.09.14</Text>
            <Text style={styles.appInfoSubtext}>© 2024 Stitch Chat Inc.</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
    marginRight: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 16,
  },
  appInfoContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  appInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
});

export default HelpAndSupportScreen;