export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
  bio?: string;
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice' | 'video' | 'file';
  status: 'sent' | 'delivered' | 'read';
  replyTo?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  size: number;
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  description?: string;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
}

export interface Call {
  id: string;
  type: 'voice' | 'video';
  status: 'incoming' | 'outgoing' | 'missed';
  participants: string[];
  duration?: number;
  timestamp: Date;
  isGroup: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isRegistered: boolean;
  isFavorite: boolean;
  isBlocked: boolean;
  lastSeen?: Date;
  status?: string;
}

export interface Settings {
  notifications: {
    enabled: boolean;
    messagePreview: boolean;
    sound: boolean;
    vibration: boolean;
    groupNotifications: boolean;
  };
  privacy: {
    lastSeen: 'everyone' | 'contacts' | 'nobody';
    profilePhoto: 'everyone' | 'contacts' | 'nobody';
    status: 'everyone' | 'contacts' | 'nobody';
    readReceipts: boolean;
    blockedUsers: string[];
  };
  chat: {
    fontSize: 'small' | 'medium' | 'large';
    wallpaper: string;
    enterToSend: boolean;
    mediaAutoDownload: boolean;
  };
  security: {
    screenLock: boolean;
    fingerprint: boolean;
    twoFactorAuth: boolean;
  };
}

export interface Story {
  id: string;
  userId: string;
  type: 'image' | 'video' | 'text';
  content: string;
  caption?: string;
  timestamp: Date;
  viewers: string[];
  isViewed: boolean;
}

export type NavigationParamList = {
  Login: undefined;
  ChatList: undefined;
  Chat: {
    chatId: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    type: 'private' | 'group';
  };
  Profile: { userId?: string };
  EditProfile: undefined;
  Settings: undefined;
  Contacts: undefined;
  AddContact: undefined;
  Calls: undefined;
  Camera: undefined;
  MediaPicker: undefined;
  ChatInfo: { chatId: string };
  UserProfile: { userId: string };
};