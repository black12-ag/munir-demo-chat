import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';

interface MediaSharingScreenProps {
  navigation: NavigationProp<any>;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  name?: string;
  duration?: number;
}

type MediaTab = 'photos' | 'gifs' | 'files';

const MediaSharingScreen: React.FC<MediaSharingScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('photos');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const itemSize = (screenWidth - 48) / 3; // 3 items per row with padding

  // Sample media data
  const samplePhotos: MediaItem[] = [
    { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop' },
    { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop' },
    { id: '3', type: 'image', url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop' },
    { id: '4', type: 'image', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop' },
    { id: '5', type: 'video', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', duration: 120 },
    { id: '6', type: 'image', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop' },
    { id: '7', type: 'image', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop' },
    { id: '8', type: 'image', url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&h=300&fit=crop' },
    { id: '9', type: 'image', url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=300&h=300&fit=crop' },
  ];

  const sampleGifs: MediaItem[] = [
    { id: '10', type: 'image', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop' },
    { id: '11', type: 'image', url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop' },
    { id: '12', type: 'image', url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop' },
  ];

  const sampleFiles: MediaItem[] = [
    { id: '13', type: 'file', url: '', name: 'Project_Proposal.pdf' },
    { id: '14', type: 'file', url: '', name: 'Meeting_Notes.docx' },
    { id: '15', type: 'file', url: '', name: 'Budget_Report.xlsx' },
    { id: '16', type: 'file', url: '', name: 'Design_Assets.zip' },
  ];

  const getCurrentMediaData = () => {
    switch (activeTab) {
      case 'photos':
        return samplePhotos;
      case 'gifs':
        return sampleGifs;
      case 'files':
        return sampleFiles;
      default:
        return samplePhotos;
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSend = () => {
    if (selectedItems.length > 0) {
      // Handle sending selected media
      console.log('Sending items:', selectedItems);
      navigation.goBack();
    }
  };

  const renderTabButton = (tab: MediaTab, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.activeTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMediaItem = (item: MediaItem) => {
    const isSelected = selectedItems.includes(item.id);
    
    if (item.type === 'file') {
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.fileItem, isSelected && styles.selectedItem]}
          onPress={() => toggleItemSelection(item.id)}
        >
          <View style={styles.fileIcon}>
            <MaterialIcons name="description" size={32} color="#0da6f2" />
          </View>
          <Text style={styles.fileName} numberOfLines={2}>
            {item.name}
          </Text>
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <MaterialIcons name="check" size={16} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.mediaItem, isSelected && styles.selectedItem]}
        onPress={() => toggleItemSelection(item.id)}
      >
        <Image source={{ uri: item.url }} style={styles.mediaImage} />
        
        {item.type === 'video' && (
          <View style={styles.videoOverlay}>
            <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
            {item.duration && (
              <Text style={styles.videoDuration}>
                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
              </Text>
            )}
          </View>
        )}
        
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <MaterialIcons name="check" size={16} color="#ffffff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <View style={styles.closeButton} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('photos', 'Photos & Videos')}
        {renderTabButton('gifs', 'GIFs')}
        {renderTabButton('files', 'Files')}
      </View>

      {/* Media Grid */}
      <ScrollView style={styles.mediaContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mediaGrid}>
          {getCurrentMediaData().map(renderMediaItem)}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Camera opened (demo)')}
          >
            <MaterialIcons name="photo-camera" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Gallery opened (demo)')}
          >
            <MaterialIcons name="photo-library" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('File picker opened (demo)')}
          >
            <MaterialIcons name="attach-file" size={24} color="#ffffff" />
            <Text style={styles.actionButtonText}>Files</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            selectedItems.length === 0 && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.sendButtonText}>
            Send {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
          </Text>
          <MaterialIcons name="send" size={20} color="#ffffff" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#0da6f2',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabButtonText: {
    color: '#ffffff',
  },
  mediaContainer: {
    flex: 1,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  mediaItem: {
    width: (Dimensions.get('window').width - 32) / 3,
    height: (Dimensions.get('window').width - 32) / 3,
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: '#0da6f2',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fileItem: {
    width: (Dimensions.get('window').width - 32) / 3,
    height: (Dimensions.get('window').width - 32) / 3,
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    position: 'relative',
  },
  fileIcon: {
    marginBottom: 8,
  },
  fileName: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0da6f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    backgroundColor: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0da6f2',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  sendButtonDisabled: {
    backgroundColor: '#374151',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
});

export default MediaSharingScreen;