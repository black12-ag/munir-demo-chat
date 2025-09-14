import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface CallScreenParams {
  name: string;
  avatar: string;
  type: 'voice' | 'video';
  isIncoming?: boolean;
}

const CallScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as CallScreenParams;
  
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Start pulsing animation for ringing
    if (callStatus === 'ringing') {
      startPulseAnimation();
    }
    
    // Auto connect after 3 seconds for demo
    const connectTimer = setTimeout(() => {
      if (callStatus === 'ringing') {
        setCallStatus('connected');
      }
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, [callStatus]);

  useEffect(() => {
    // Call duration timer
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'ringing':
        return params.isIncoming ? 'Incoming call...' : 'Calling...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  const renderCallControls = () => {
    if (callStatus === 'ringing' && params.isIncoming) {
      // Incoming call controls
      return (
        <View style={styles.incomingControls}>
          <TouchableOpacity
            style={[styles.callButton, styles.declineButton]}
            onPress={handleEndCall}
          >
            <Icon name="call-end" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.callButton, styles.acceptButton]}
            onPress={handleAcceptCall}
          >
            <Icon name="call" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    } else if (callStatus === 'connected') {
      // Connected call controls
      return (
        <View style={styles.connectedControls}>
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.activeControlButton]}
            onPress={toggleMute}
          >
            <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, isSpeakerOn && styles.activeControlButton]}
            onPress={toggleSpeaker}
          >
            <Icon name={isSpeakerOn ? "volume-up" : "volume-down"} size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.callButton, styles.endCallButton]}
            onPress={handleEndCall}
          >
            <Icon name="call-end" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background */}
      <View style={styles.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.minimizeButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="keyboard-arrow-down" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.callType}>
          {params.type === 'voice' ? 'Voice Call' : 'Video Call'}
        </Text>
      </View>

      {/* Contact Info */}
      <View style={styles.contactSection}>
        <Animated.View
          style={[
            styles.avatarContainer,
            { transform: [{ scale: callStatus === 'ringing' ? pulseAnim : 1 }] }
          ]}
        >
          <Image source={{ uri: params.avatar }} style={styles.avatar} />
          {callStatus === 'ringing' && (
            <View style={styles.pulseRing} />
          )}
        </Animated.View>
        
        <Text style={styles.contactName}>{params.name}</Text>
        <Text style={styles.callStatus}>{getStatusText()}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsSection}>
        {renderCallControls()}
      </View>

      {/* Additional Features */}
      {callStatus === 'connected' && (
        <View style={styles.additionalControls}>
          <TouchableOpacity style={styles.featureButton}>
            <Icon name="dialpad" size={20} color="#90b7cb" />
            <Text style={styles.featureText}>Keypad</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={() => navigation.navigate('MediaSharing', { callMode: true })}
          >
            <Icon name="screen-share" size={20} color="#90b7cb" />
            <Text style={styles.featureText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureButton}>
            <Icon name="person-add" size={20} color="#90b7cb" />
            <Text style={styles.featureText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101d23',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#101d23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  minimizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  callType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  contactSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#0da6f2',
  },
  pulseRing: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(13, 166, 242, 0.3)',
  },
  contactName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: '#90b7cb',
    textAlign: 'center',
  },
  controlsSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  connectedControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 32,
  },
  callButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  declineButton: {
    backgroundColor: '#ef4444',
  },
  endCallButton: {
    backgroundColor: '#ef4444',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeControlButton: {
    backgroundColor: '#0da6f2',
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  featureButton: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#90b7cb',
    marginTop: 4,
  },
});

export default CallScreen;