import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import DataService from '../../services/DataService';

interface ChangeEmailAddressScreenProps {
  navigation: NavigationProp<any>;
}

const ChangeEmailAddressScreen: React.FC<ChangeEmailAddressScreenProps> = ({ navigation }) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentEmail?: string;
    newEmail?: string;
  }>({});

  const dataService = DataService;

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await dataService.getCurrentUser();
      if (user) {
        setCurrentEmail(user.email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!newEmail.trim()) {
      newErrors.newEmail = 'New email address is required';
    } else if (!validateEmail(newEmail.trim())) {
      newErrors.newEmail = 'Please enter a valid email address';
    } else if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      newErrors.newEmail = 'New email must be different from current email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmail = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate email update process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show verification message
      Alert.alert(
        'Verification Required',
        `We've sent a verification link to ${newEmail.trim()}. Please check your email and click the link to confirm your new email address.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // In a real app, you might navigate back or to a verification screen
              navigation.goBack();
            },
          },
        ]
      );

      // Update user data (in real app, this would happen after email verification)
      const user = await dataService.getCurrentUser();
      if (user) {
        await dataService.updateProfile({ email: newEmail.trim() });
      }

    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert(
        'Update Failed', 
        'Failed to update email address. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = newEmail.trim().length > 0 && Object.keys(errors).length === 0;

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
        <Text style={styles.headerTitle}>Change Email</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Current Email */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={currentEmail}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
          </View>

          {/* New Email */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>New email address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="mail" 
                size={20} 
                color="#90b7cb" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                placeholder="Enter new email"
                placeholderTextColor="#90b7cb"
                value={newEmail}
                onChangeText={(text) => {
                  setNewEmail(text);
                  if (errors.newEmail) {
                    setErrors(prev => ({ ...prev, newEmail: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>
            {errors.newEmail && (
              <Text style={styles.errorText}>{errors.newEmail}</Text>
            )}
          </View>

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              We will send a verification link to your new email address. 
              Please make sure you have access to it.
            </Text>
          </View>
        </View>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              (!isFormValid || loading) && styles.updateButtonDisabled
            ]}
            onPress={handleUpdateEmail}
            disabled={!isFormValid || loading}
            activeOpacity={0.7}
          >
            <Text style={styles.updateButtonText}>
              {loading ? 'Updating...' : 'Update Email'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  readOnlyInput: {
    backgroundColor: '#374151',
    color: '#9ca3af',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 8,
  },
  infoContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#90b7cb',
    lineHeight: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  updateButton: {
    backgroundColor: '#0da6f2',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#374151',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ChangeEmailAddressScreen;