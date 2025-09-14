import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatScreenProps {
  navigation?: any;
  route?: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey, are you free for a quick chat?', timestamp: new Date(Date.now() - 600000), isOwn: false },
    { id: '2', text: 'Hi! Yes, I am. What\'s up?', timestamp: new Date(Date.now() - 540000), isOwn: true },
    { id: '3', text: 'I wanted to discuss the project timeline.', timestamp: new Date(Date.now() - 480000), isOwn: false },
    { id: '4', text: 'Sure, give me a minute to wrap up this email.', timestamp: new Date(Date.now() - 420000), isOwn: true },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatData = route?.params || {
    name: 'Sophia Bennett',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    isOnline: true
  };

  const AUTO_RESPONSES = [
    "That sounds great!",
    "I agree with that.",
    "Thanks for letting me know.",
    "Perfect timing!",
    "I understand.",
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate auto response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)],
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleCall = () => {
    navigation?.navigate('Call', {
      name: chatData.name,
      avatar: chatData.avatar,
      type: 'voice',
      isIncoming: false
    });
  };

  const handleVideoCall = () => {
    navigation?.navigate('VideoCall', {
      name: chatData.name,
      avatar: chatData.avatar,
      type: 'video',
      isIncoming: false
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101d23" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: chatData.avatar }} style={styles.avatar} />
              {chatData.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View>
              <Text style={styles.userName}>{chatData.name}</Text>
              <Text style={styles.userStatus}>
                {isTyping ? 'typing...' : 'Online'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVideoCall} style={styles.actionButton}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>Today</Text>
          </View>
          
          {messages.map((message) => (
            <View 
              key={message.id}
              style={[styles.messageContainer, message.isOwn ? styles.ownMessage : styles.otherMessage]}
            >
              {!message.isOwn && (
                <Image source={{ uri: chatData.avatar }} style={styles.messageAvatar} />
              )}
              <View style={styles.messageContent}>
                <View style={[styles.messageBubble, message.isOwn ? styles.ownBubble : styles.otherBubble]}>
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
                <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
              </View>
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.otherMessage]}>
              <Image source={{ uri: chatData.avatar }} style={styles.messageAvatar} />
              <View style={styles.messageContent}>
                <View style={[styles.messageBubble, styles.otherBubble, styles.typingBubble]}>
                  <Text style={styles.typingText}>typing...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => navigation?.navigate('MediaSharing')}
            >
              <Ionicons name="camera" size={24} color="#90b7cb" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Message"
              placeholderTextColor="#90b7cb"
              multiline
            />
            <TouchableOpacity 
              onPress={handleSendMessage}
              style={[styles.sendButton, { opacity: newMessage.trim() ? 1 : 0.5 }]}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101d23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#223c49',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#101d23',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  userStatus: {
    fontSize: 12,
    color: '#90b7cb',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  dateHeader: {
    alignSelf: 'center',
    backgroundColor: '#223c49',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
  },
  dateText: {
    fontSize: 12,
    color: '#90b7cb',
    fontWeight: '500',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  ownBubble: {
    backgroundColor: '#0da6f2',
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: '#223c49',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    color: '#90b7cb',
    paddingHorizontal: 4,
  },
  typingBubble: {
    paddingVertical: 16,
  },
  typingText: {
    fontSize: 14,
    color: '#90b7cb',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#223c49',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#223c49',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0da6f2',
    borderRadius: 20,
    padding: 8,
    marginLeft: 4,
  },
});

export default ChatScreen;