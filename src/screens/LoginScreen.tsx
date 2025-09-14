import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (username.length >= 3 && password.length >= 3) {
      console.log('Login successful:', { username });
      onLogin();
    } else {
      Alert.alert('Error', 'Please enter at least 3 characters for both fields');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101d23" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.headerSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name="person-outline" 
                size={24} 
                color="#90b7cb" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#90b7cb"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name="lock-closed-outline" 
                size={24} 
                color="#90b7cb" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#90b7cb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.buttonSection}>
              <TouchableOpacity 
                style={[styles.button, styles.loginButton]}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.signUpButton]}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.backgroundImageContainer}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80'
            }}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
          />
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
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
    gap: 64,
  },
  headerSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#90b7cb',
    textAlign: 'center',
    marginTop: 8,
  },
  formSection: {
    width: '100%',
    maxWidth: 400,
    gap: 24,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -12,
    zIndex: 1,
  },
  input: {
    backgroundColor: '#223c49',
    borderRadius: 56,
    height: 56,
    paddingHorizontal: 56,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#90b7cb',
  },
  buttonSection: {
    gap: 16,
    marginTop: 8,
  },
  button: {
    borderRadius: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#0da6f2',
    shadowColor: '#0da6f2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  signUpButton: {
    backgroundColor: '#223c49',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backgroundImageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 256,
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.3,
  },
});

export default LoginScreen;