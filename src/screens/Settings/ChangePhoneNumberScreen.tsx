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

interface ChangePhoneNumberScreenProps {
  navigation: NavigationProp<any>;
}

const ChangePhoneNumberScreen: React.FC<ChangePhoneNumberScreenProps> = ({ navigation }) => {
  const [currentPhone, setCurrentPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPhone?: string;
    newPhone?: string;
  }>({});

  const dataService = DataService;

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = dataService.getCurrentUser();
      if (user) {
        setCurrentPhone(user.phone);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const formatPhoneNumber = (phone: string): string => {
    // Basic formatting - remove all non-digits except +
    return phone.replace(/[^\d+]/g, '');
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!newPhone.trim()) {
      newErrors.newPhone = 'New phone number is required';
    } else {
      const formattedPhone = formatPhoneNumber(newPhone.trim());
      if (!validatePhoneNumber(formattedPhone)) {
        newErrors.newPhone = 'Please enter a valid phone number';
      } else if (formattedPhone === formatPhoneNumber(currentPhone)) {
        newErrors.newPhone = 'New phone number must be different from current phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    const formattedNewPhone = formatPhoneNumber(newPhone.trim());

    Alert.alert(
      'Verify Phone Number',
      `We will send a verification code to ${formattedNewPhone}. Please make sure this number is correct and you have access to it.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => proceedWithVerification(formattedNewPhone),
        },
      ]
    );
  };

  const proceedWithVerification = async (phoneNumber: string) => {
    setLoading(true);
    
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show verification code sent message
      Alert.alert(
        'Verification Code Sent',
        `We've sent a verification code to ${phoneNumber}. Enter the code to confirm your new phone number.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // In a real app, navigate to verification screen
              // For now, simulate successful verification
              handleVerificationSuccess(phoneNumber);
            },
          },
        ]
      );

    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async (phoneNumber: string) => {
    try {
      // Update user data
      const user = dataService.getCurrentUser();
      if (user) {
        await dataService.updateProfile({ phone: phoneNumber });
      }

      Alert.alert(
        'Phone Number Updated',
        'Your phone number has been successfully updated.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating phone number:', error);
      Alert.alert(
        'Update Failed',
        'Failed to update phone number. Please try again.'
      );
    }
  };

  const isFormValid = newPhone.trim().length > 0 && Object.keys(errors).length === 0;

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
        <Text style={styles.headerTitle}>Change Phone Number</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Security Icon and Message */}
          <View style={styles.securitySection}>
            <View style={styles.securityIcon}>
              <MaterialIcons name="security" size={32} color="#0da6f2" />
            </View>
            <Text style={styles.securityMessage}>
              For security reasons, we need to verify your current phone number before you can change it.
            </Text>
          </View>

          {/* Current Phone Number */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.floatingLabel]}
                value={currentPhone}
                editable={false}
                selectTextOnFocus={false}
                placeholder=" "
              />
              <Text style={styles.inputLabel}>Current phone number</Text>
            </View>
          </View>

          {/* New Phone Number */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.floatingLabel]}
                placeholder=" "
                value={newPhone}
                onChangeText={(text) => {
                  setNewPhone(text);
                  if (errors.newPhone) {
                    setErrors(prev => ({ ...prev, newPhone: undefined }));
                  }
                }}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
              <Text style={[
                styles.inputLabel,
                newPhone.length > 0 && styles.inputLabelActive
              ]}>
                New phone number
              </Text>
            </View>
            {errors.newPhone && (
              <Text style={styles.errorText}>{errors.newPhone}</Text>
            )}
          </View>

          {/* Information */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              • We'll send a verification code to your new number{'\n'}
              • Your account will be secured with the new number{'\n'}
              • Make sure you have access to the new number before proceeding
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isFormValid || loading) && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isFormValid || loading}
            activeOpacity={0.7}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Processing...' : 'Continue'}
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
    fontSize: 18,
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
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  securitySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  securityIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityMessage: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 16,
    color: '#ffffff',
  },
  floatingLabel: {
    // Styles for floating label effect
  },
  inputLabel: {
    position: 'absolute',
    left: 16,
    top: 16,
    fontSize: 16,
    color: '#9ca3af',
    backgroundColor: '#111827',
    paddingHorizontal: 4,
  },
  inputLabelActive: {
    top: -8,
    fontSize: 12,
    color: '#0da6f2',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  infoContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#90b7cb',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#0da6f2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#374151',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ChangePhoneNumberScreen;