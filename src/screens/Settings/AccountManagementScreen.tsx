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

interface AccountManagementScreenProps {
  navigation: NavigationProp<any>;
}

interface AccountOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  screen?: string;
  action?: () => void;
}

const AccountManagementScreen: React.FC<AccountManagementScreenProps> = ({ navigation }) => {
  const accountOptions: AccountOption[] = [
    {
      id: 'personal_info',
      title: 'Personal Information',
      subtitle: 'View and edit your personal info',
      icon: 'person',
      screen: 'PersonalInfo',
    },
    {
      id: 'change_password',
      title: 'Change Password',
      subtitle: 'Update your password',
      icon: 'lock',
      screen: 'ChangePassword',
    },
    {
      id: 'linked_accounts',
      title: 'Linked Accounts',
      subtitle: 'Manage connected accounts',
      icon: 'link',
      screen: 'LinkedAccounts',
    },
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      subtitle: 'Secure your account with 2FA',
      icon: 'security',
      screen: 'TwoFactorAuth',
    },
    {
      id: 'login_activity',
      title: 'Login Activity',
      subtitle: 'See where you\'re logged in',
      icon: 'devices',
      screen: 'LoginActivity',
    },
    {
      id: 'data_export',
      title: 'Export Data',
      subtitle: 'Download your account data',
      icon: 'download',
      action: () => handleDataExport(),
    },
    {
      id: 'deactivate',
      title: 'Deactivate Account',
      subtitle: 'Temporarily disable your account',
      icon: 'pause-circle',
      action: () => handleDeactivateAccount(),
    },
    {
      id: 'delete',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      icon: 'delete-forever',
      action: () => handleDeleteAccount(),
    },
  ];

  const handleItemPress = (item: AccountOption) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.action) {
      item.action();
    }
  };

  const handleDataExport = () => {
    // Implement data export functionality
    console.log('Export data requested');
  };

  const handleDeactivateAccount = () => {
    // Implement account deactivation
    console.log('Deactivate account requested');
  };

  const handleDeleteAccount = () => {
    // Implement account deletion
    console.log('Delete account requested');
  };

  const renderAccountOption = (option: AccountOption) => {
    const isDestructive = option.id === 'delete' || option.id === 'deactivate';
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionItem,
          isDestructive && styles.destructiveItem,
        ]}
        onPress={() => handleItemPress(option)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.iconContainer,
          isDestructive && styles.destructiveIconContainer,
        ]}>
          <MaterialIcons 
            name={option.icon as any} 
            size={24} 
            color={isDestructive ? "#ef4444" : "#ffffff"} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.optionTitle,
            isDestructive && styles.destructiveTitle,
          ]}>
            {option.title}
          </Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={isDestructive ? "#ef4444" : "#6b7280"} 
        />
      </TouchableOpacity>
    );
  };

  // Group options into sections
  const basicOptions = accountOptions.filter(option => 
    !['deactivate', 'delete'].includes(option.id)
  );
  
  const dangerousOptions = accountOptions.filter(option => 
    ['deactivate', 'delete'].includes(option.id)
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
        <Text style={styles.headerTitle}>Account</Text>
        <View style={styles.backButton} />
      </View>

      {/* Account Options */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
          <View style={styles.sectionContent}>
            {basicOptions.map((option, index) => (
              <View key={option.id}>
                {renderAccountOption(option)}
                {index < basicOptions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DANGER ZONE</Text>
          <View style={styles.sectionContent}>
            {dangerousOptions.map((option, index) => (
              <View key={option.id}>
                {renderAccountOption(option)}
                {index < dangerousOptions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
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
    marginTop: 24,
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  destructiveItem: {
    // Additional styling for destructive items if needed
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  destructiveTitle: {
    color: '#ef4444',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  separator: {
    height: 1,
    backgroundColor: '#374151',
    marginLeft: 80, // Align with text content
  },
});

export default AccountManagementScreen;