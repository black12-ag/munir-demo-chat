import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface WelcomeScreenProps {
  navigation: NavigationProp<any>;
  onGetStarted?: () => void;
  onSkip?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  navigation, 
  onGetStarted, 
  onSkip 
}) => {
  const screenHeight = Dimensions.get('window').height;

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigation.navigate('FeatureHighlight');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Image */}
      <View style={[styles.imageContainer, { height: screenHeight * 0.45 }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Connect Instantly</Text>
          <Text style={styles.subtitle}>
            Experience seamless communication with friends and family, anytime, anywhere.
          </Text>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
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
  imageContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    justifyContent: 'space-between',
  },
  textSection: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    lineHeight: 26,
    fontWeight: '400',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6b7280',
  },
  activeDot: {
    width: 32,
    backgroundColor: '#0da6f2',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  getStartedButton: {
    flex: 1,
    backgroundColor: '#0da6f2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default WelcomeScreen;