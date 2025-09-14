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

interface FeatureHighlightScreenProps {
  navigation: NavigationProp<any>;
  onNext?: () => void;
  onBack?: () => void;
}

const FeatureHighlightScreen: React.FC<FeatureHighlightScreenProps> = ({ 
  navigation, 
  onNext, 
  onBack 
}) => {
  const screenHeight = Dimensions.get('window').height;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigation.navigate('SetupGuide');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Feature Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }}
            style={styles.featureImage}
            resizeMode="cover"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Connect with voice and video calls</Text>
          <Text style={styles.subtitle}>
            Stay in touch with friends and family through high-quality voice and video calls, 
            no matter where they are.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.activeDot]} />
          <View style={styles.progressDot} />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  illustrationContainer: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  featureImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
  },
  textContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
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
    flexDirection: 'row',
    gap: 16,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#0da6f2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default FeatureHighlightScreen;