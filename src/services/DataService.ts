import { User, Message, Chat, Call, Contact, Settings, Story } from '../types';

class DataServiceClass {
  private static instance: DataServiceClass;
  
  public static getInstance(): DataServiceClass {
    if (!DataServiceClass.instance) {
      DataServiceClass.instance = new DataServiceClass();
    }
    return DataServiceClass.instance;
  }

  // Current user
  public currentUser: User = {
    id: 'current-user',
    name: 'You',
    username: 'you',
    email: 'you@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    status: 'online',
    bio: 'Love coding and building amazing apps!'
  };

  // Sample users
  public users: User[] = [
    {
      id: '1',
      name: 'Sophia Bennett',
      username: 'sophia_b',
      email: 'sophia@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      status: 'online',
      bio: 'UX Designer & Digital Artist',
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Ethan Carter',
      username: 'ethan_dev',
      email: 'ethan@example.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      status: 'away',
      bio: 'Software Engineer at TechCorp',
      lastSeen: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      name: 'Liam Harper',
      username: 'liam_h',
      email: 'liam@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      status: 'offline',
      bio: 'Product Manager & Tech Enthusiast',
      lastSeen: new Date(Date.now() - 3600000)
    },
    {
      id: '4',
      name: 'Emma Wilson',
      username: 'emma_w',
      email: 'emma@example.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      status: 'busy',
      bio: 'Marketing Director',
      lastSeen: new Date(Date.now() - 1800000)
    },
    {
      id: '5',
      name: 'Noah Foster',
      username: 'noah_f',
      email: 'noah@example.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      status: 'online',
      bio: 'Graphic Designer & Photographer',
      lastSeen: new Date()
    }
  ];

  // Sample chats
  public chats: Chat[] = [
    {
      id: '1',
      type: 'private',
      participants: ['current-user', '1'],
      unreadCount: 0,
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 3600000),
      isArchived: false,
      isMuted: false,
      isPinned: true
    },
    {
      id: '2',
      type: 'private',
      participants: ['current-user', '2'],
      unreadCount: 2,
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 7200000),
      isArchived: false,
      isMuted: false,
      isPinned: false
    },
    {
      id: '3',
      type: 'group',
      name: 'Design Team',
      participants: ['current-user', '1', '3', '5'],
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      description: 'Team chat for design discussions',
      unreadCount: 5,
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 1800000),
      isArchived: false,
      isMuted: false,
      isPinned: false
    }
  ];

  // Sample calls
  public calls: Call[] = [
    {
      id: '1',
      type: 'video',
      status: 'incoming',
      participants: ['current-user', '1'],
      duration: 1245,
      timestamp: new Date(Date.now() - 3600000),
      isGroup: false
    },
    {
      id: '2',
      type: 'voice',
      status: 'outgoing',
      participants: ['current-user', '2'],
      duration: 625,
      timestamp: new Date(Date.now() - 7200000),
      isGroup: false
    },
    {
      id: '3',
      type: 'video',
      status: 'missed',
      participants: ['current-user', '3'],
      timestamp: new Date(Date.now() - 10800000),
      isGroup: false
    }
  ];

  // Sample contacts
  public contacts: Contact[] = [
    ...this.users.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      isRegistered: true,
      isFavorite: Math.random() > 0.5,
      isBlocked: false,
      lastSeen: user.lastSeen,
      status: user.bio
    })),
    {
      id: 'contact-1',
      name: 'Alex Johnson',
      phone: '+1 (555) 789-0123',
      email: 'alex@example.com',
      isRegistered: false,
      isFavorite: false,
      isBlocked: false
    },
    {
      id: 'contact-2',
      name: 'Sarah Davis',
      phone: '+1 (555) 890-1234',
      isRegistered: false,
      isFavorite: true,
      isBlocked: false
    }
  ];

  // Default settings
  public settings: Settings = {
    notifications: {
      enabled: true,
      messagePreview: true,
      sound: true,
      vibration: true,
      groupNotifications: true
    },
    privacy: {
      lastSeen: 'contacts',
      profilePhoto: 'everyone',
      status: 'contacts',
      readReceipts: true,
      blockedUsers: []
    },
    chat: {
      fontSize: 'medium',
      wallpaper: 'default',
      enterToSend: false,
      mediaAutoDownload: true
    },
    security: {
      screenLock: false,
      fingerprint: false,
      twoFactorAuth: false
    }
  };

  // Messages storage (organized by chat ID)
  private messages: Record<string, Message[]> = {};

  // API Methods
  async getChats(): Promise<Chat[]> {
    // Add last message to each chat
    return this.chats.map(chat => ({
      ...chat,
      lastMessage: this.getLastMessageForChat(chat.id)
    }));
  }

  async getMessages(chatId: string): Promise<Message[]> {
    // Return sample messages for demonstration
    return [
      {
        id: '1',
        chatId,
        senderId: '1',
        text: 'Hey, are you free for a quick chat?',
        timestamp: new Date(Date.now() - 600000),
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        chatId,
        senderId: 'current-user',
        text: 'Hi! Yes, I am. What\'s up?',
        timestamp: new Date(Date.now() - 540000),
        type: 'text',
        status: 'read'
      }
    ];
  }

  async sendMessage(chatId: string, text: string): Promise<Message> {
    const message: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: 'current-user',
      text,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };
    return message;
  }

  async getCalls(): Promise<Call[]> {
    return this.calls;
  }

  async getContacts(): Promise<Contact[]> {
    return this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getUserById(id: string): Promise<User | undefined> {
    if (id === 'current-user') return this.currentUser;
    return this.users.find(user => user.id === id);
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    this.currentUser = { ...this.currentUser, ...updates };
    return this.currentUser;
  }

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  async blockUser(userId: string): Promise<void> {
    const contact = this.contacts.find(c => c.id === userId);
    if (contact) {
      contact.isBlocked = true;
      this.settings.privacy.blockedUsers.push(userId);
    }
  }

  async unblockUser(userId: string): Promise<void> {
    const contact = this.contacts.find(c => c.id === userId);
    if (contact) {
      contact.isBlocked = false;
      this.settings.privacy.blockedUsers = this.settings.privacy.blockedUsers.filter(id => id !== userId);
    }
  }

  getAllMessages(): Message[] {
    const allMessages: Message[] = [];
    
    // Collect all messages from all chats
    this.chats.forEach(chat => {
      const chatMessages = this.messages[chat.id] || [];
      allMessages.push(...chatMessages);
    });
    
    return allMessages;
  }

  // Additional methods for Phase 6 screens
  async getStatusUpdates(): Promise<any[]> {
    // Mock status updates data
    return [];
  }

  async getCallHistory(): Promise<any[]> {
    // Mock call history data
    return [];
  }

  // Additional missing methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async getCurrentUser(): Promise<User> {
    return this.currentUser;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  private getLastMessageForChat(chatId: string): Message | undefined {
    const sampleMessages = [
      'Hey, are you free for a quick chat?',
      'The meeting is scheduled for 3 PM',
      'New mockups are ready for review',
      'Thanks for the help!',
      'Let\'s catch up soon',
      'How\'s the project going?'
    ];
    
    return {
      id: `last-${chatId}`,
      chatId,
      senderId: Math.random() > 0.5 ? 'current-user' : '1',
      text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000),
      type: 'text',
      status: 'read'
    };
  }
}

const DataService = DataServiceClass.getInstance();
export { DataService };
export default DataService;