const client = new Appwrite.Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67326caa002eb5f7c285');

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

const DATABASE_ID = 'love-chat-db';
const MESSAGES_COLLECTION_ID = 'messages';
const ROOMS_COLLECTION_ID = 'rooms';
const USERS_COLLECTION_ID = 'users';
const BUCKET_ID = 'media-files';

export { 
    client,
    account,
    databases,
    storage,
    DATABASE_ID,
    MESSAGES_COLLECTION_ID,
    ROOMS_COLLECTION_ID,
    USERS_COLLECTION_ID,
    BUCKET_ID
};

console.log('Appwrite تم تهيئة');
  