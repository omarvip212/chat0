import { databases, storage } from './appwrite-config.js';
import { 
    DATABASE_ID, 
    MESSAGES_COLLECTION_ID, 
    ROOMS_COLLECTION_ID 
} from './appwrite-config.js';

class ChatRoom {
    constructor(roomId) {
        this.roomId = roomId;
        this.setupRoom();
    }

    async sendMessage(content, type = 'text') {
        try {
            await databases.createDocument(
                DATABASE_ID,
                MESSAGES_COLLECTION_ID,
                'unique()',
                {
                    content,
                    type,
                    roomId: this.roomId,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    async sendVoiceMessage(blob) {
        try {
            const file = await storage.createFile(
                'media-files',
                'unique()',
                blob
            );

            await this.sendMessage(file.$id, 'voice');
        } catch (error) {
            console.error('Error sending voice message:', error);
        }
    }
} 