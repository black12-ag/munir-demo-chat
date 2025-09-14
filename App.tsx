import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import ContactsScreen from './src/screens/Contacts/ContactsScreen';
import CallsScreen from './src/screens/Calls/CallsScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import AppSettingsScreen from './src/screens/Settings/AppSettingsScreen';
import PrivacySettingsScreen from './src/screens/Settings/PrivacySettingsScreen';
import AccountManagementScreen from './src/screens/Settings/AccountManagementScreen';
import HelpAndSupportScreen from './src/screens/Settings/HelpAndSupportScreen';
import GlobalSearchScreen from './src/screens/Search/GlobalSearchScreen';
import NewChatScreen from './src/screens/Chat/NewChatScreen';
import MediaSharingScreen from './src/screens/Media/MediaSharingScreen';
import BlockedUsersScreen from './src/screens/Settings/BlockedUsersScreen';
import ChangeEmailAddressScreen from './src/screens/Settings/ChangeEmailAddressScreen';
import ChangePhoneNumberScreen from './src/screens/Settings/ChangePhoneNumberScreen';
import InAppNotificationsScreen from './src/screens/Notifications/InAppNotificationsScreen';
import NotificationSoundSettingsScreen from './src/screens/Notifications/NotificationSoundSettingsScreen';
import WelcomeScreen from './src/screens/Onboarding/WelcomeScreen';
import FeatureHighlightScreen from './src/screens/Onboarding/FeatureHighlightScreen';
import SetupGuideScreen from './src/screens/Onboarding/SetupGuideScreen';
import StatusScreen from './src/screens/StatusScreen';
import CallHistoryScreen from './src/screens/CallHistoryScreen';
import CallScreen from './src/screens/CallScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#101d23' }
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="ChatList">
              {(props) => <ChatListScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Contacts" component={ContactsScreen} />
            <Stack.Screen name="Calls" component={CallsScreen} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
            <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
            <Stack.Screen name="AccountManagement" component={AccountManagementScreen} />
            <Stack.Screen name="HelpAndSupport" component={HelpAndSupportScreen} />
            <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} />
            <Stack.Screen name="MediaSharing" component={MediaSharingScreen} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
            <Stack.Screen name="ChangeEmailAddress" component={ChangeEmailAddressScreen} />
            <Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumberScreen} />
            <Stack.Screen name="InAppNotifications" component={InAppNotificationsScreen} />
            <Stack.Screen name="NotificationSoundSettings" component={NotificationSoundSettingsScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="FeatureHighlight" component={FeatureHighlightScreen} />
            <Stack.Screen name="SetupGuide" component={SetupGuideScreen} />
            <Stack.Screen name="Status" component={StatusScreen} />
            <Stack.Screen name="CallHistory" component={CallHistoryScreen} />
            <Stack.Screen name="Call" component={CallScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
