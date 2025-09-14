import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface VideoCallScreenParams {
  name: string;
  avatar: string;
  isIncoming?: boolean;
}

const VideoCallScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as VideoCallScreenParams;
  
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
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

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'ringing':
        return params.isIncoming ? 'Incoming video call...' : 'Calling...';
      case 'connected':
        return formatDuration(callDuration);
      case 'ended':
        return 'Call ended';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Views */}
      <View style={styles.videoContainer}>
        <TouchableOpacity 
          style={styles.remoteVideoContainer}
          onPress={toggleControls}
          activeOpacity={1}
        >
          <Image 
            source={{ uri: params.avatar }} 
            style={styles.remoteVideo}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Local video preview */}
        <View style={styles.localVideoContainer}>
          {isCameraOff ? (
            <View style={styles.cameraOffView}>
              <Icon name="videocam-off" size={32} color="#fff" />
            </View>
          ) : (
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b667-3a47d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }}
              style={styles.localVideo}
              resizeMode="cover"
            />
          )}
        </View>
      </View>

      {/* Header */}
      {showControls && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.minimizeButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.contactName}>{params.name}</Text>
          <Text style={styles.durationText}>
            {callStatus === 'connected' ? formatDuration(callDuration) : getStatusText()}
          </Text>
        </View>
      )}

      {/* Controls */}
      {showControls && (
        <View style={styles.controlsSection}>
          {callStatus === 'ringing' && params.isIncoming ? (
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
                <Icon name="videocam" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.connectedControls}>
              <TouchableOpacity
                style={[styles.controlButton, isMuted && styles.activeControlButton]}
                onPress={toggleMute}
              >
                <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, isCameraOff && styles.activeControlButton]}
                onPress={toggleCamera}
              >
                <Icon name={isCameraOff ? "videocam-off" : "videocam"} size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.callButton, styles.endCallButton]}
                onPress={handleEndCall}
              >
                <Icon name="call-end" size={32} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => navigation.navigate('MediaSharing', { callMode: true })}
              >
                <Icon name="screen-share" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  minimizeButton: {
    position: 'absolute',
    left: 16,
    top: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: '#90b7cb',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 120,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#0da6f2',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  cameraOffView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
  },
  controlsSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 40,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    paddingVertical: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeControlButton: {
    backgroundColor: '#ef4444',
  },
});

export default VideoCallScreen;