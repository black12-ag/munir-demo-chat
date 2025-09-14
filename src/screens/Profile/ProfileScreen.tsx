import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../types';
import DataService from '../../services/DataService';

interface ProfileScreenProps {
  navigation?: any;
  onLogout?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<User>>({});
  const dataService = DataService;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = await dataService.getUserById('current-user');
      if (currentUser) {
        setUser(currentUser);
        setEditedProfile(currentUser);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      if (editedProfile) {
        const updatedUser = await dataService.updateProfile(editedProfile);
        setUser(updatedUser);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(user || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          }
        }
      ]
    );
  };

  const handleEditPhoto = () => {
    Alert.alert(
      'Edit Photo',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Camera functionality would open here') },
        { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Gallery picker would open here') }
      ]
    );
  };

  const handleStatusChange = (status: string) => {
    setEditedProfile(prev => ({ ...prev, status: status as any }));
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#101d23" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          style={styles.editButton}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "pencil"}
            size={24}
            color="#0da6f2"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={isEditing ? handleEditPhoto : undefined}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {isEditing && (
              <View style={styles.editPhotoOverlay}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.userInfo}>
            {isEditing ? (
              <TextInput
                style={styles.editNameInput}
                value={editedProfile.name || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                placeholder="Full Name"
                placeholderTextColor="#90b7cb"
              />
            ) : (
              <Text style={styles.userName}>{user.name}</Text>
            )}
            
            <View style={styles.statusContainer}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Username</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedProfile.username || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, username: text }))}
                placeholder="Username"
                placeholderTextColor="#90b7cb"
              />
            ) : (
              <Text style={styles.detailValue}>@{user.username}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Bio</Text>
            {isEditing ? (
              <TextInput
                style={[styles.detailInput, styles.bioInput]}
                value={editedProfile.bio || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#90b7cb"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.detailValue}>{user.bio || 'No bio yet'}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedProfile.email || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                placeholder="Email address"
                placeholderTextColor="#90b7cb"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.detailValue}>{user.email}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedProfile.phone || ''}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                placeholder="Phone number"
                placeholderTextColor="#90b7cb"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.detailValue}>{user.phone}</Text>
            )}
          </View>
        </View>

        {/* Status Selection (only when editing) */}
        {isEditing && (
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Status</Text>
            {['online', 'away', 'busy', 'offline'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  editedProfile.status === status && styles.selectedStatusOption
                ]}
                onPress={() => handleStatusChange(status)}
              >
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                <Text style={[
                  styles.statusOptionText,
                  editedProfile.status === status && styles.selectedStatusText
                ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
                {editedProfile.status === status && (
                  <Ionicons name="checkmark" size={20} color="#0da6f2" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Settings')}
              >
                <Ionicons name="settings-outline" size={20} color="#90b7cb" />
                <Text style={styles.actionButtonText}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#90b7cb" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="help-circle-outline" size={20} color="#90b7cb" />
                <Text style={styles.actionButtonText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#90b7cb" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="information-circle-outline" size={20} color="#90b7cb" />
                <Text style={styles.actionButtonText}>About</Text>
                <Ionicons name="chevron-forward" size={20} color="#90b7cb" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#10b981';
    case 'away': return '#f59e0b';
    case 'busy': return '#ef4444';
    case 'offline': return '#6b7280';
    default: return '#6b7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101d23',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#223c49',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0da6f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  editNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0da6f2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    minWidth: 200,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#90b7cb',
  },
  detailsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#223c49',
  },
  detailItem: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#90b7cb',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
  },
  detailInput: {
    fontSize: 16,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#0da6f2',
    paddingVertical: 8,
  },
  bioInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  statusSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#223c49',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedStatusOption: {
    backgroundColor: 'rgba(13, 166, 242, 0.1)',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusOptionText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  selectedStatusText: {
    color: '#0da6f2',
    fontWeight: '500',
  },
  actionsSection: {
    padding: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#223c49',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0da6f2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#182b34',
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutButtonText: {
    color: '#ef4444',
  },
});

export default ProfileScreen;