import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface SetupGuideScreenProps {
  navigation: NavigationProp<any>;
  onContinue?: () => void;
}

const SetupGuideScreen: React.FC<SetupGuideScreenProps> = ({ 
  navigation, 
  onContinue 
}) => {
  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      // Navigate to the main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIconBackground}>
            <MaterialIcons name="check" size={64} color="#ffffff" />
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            You can now start connecting with friends, family, and colleagues.
          </Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  successIconBackground: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#0da6f2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0da6f2',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
    maxWidth: 280,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#0da6f2',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  continueButton: {
    backgroundColor: '#0da6f2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#0da6f2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default SetupGuideScreen;