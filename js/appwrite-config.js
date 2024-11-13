const { Client, Account, Databases, Storage } = Appwrite;

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67326caa002eb5f7c285');

console.log('Appwrite client initialized');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = 'love-chat-db';
export const MESSAGES_COLLECTION_ID = 'messages';
export const ROOMS_COLLECTION_ID = 'rooms';
export const USERS_COLLECTION_ID = 'users';
export const STORAGE_BUCKET = 'media-files'; 