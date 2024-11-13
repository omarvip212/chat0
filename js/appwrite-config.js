import { Client, Account, Databases, Storage, Query } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.1/dist/esm/sdk.js";

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67326caa002eb5f7c285');

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '6732714e0015c2825b31';
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
    BUCKET_ID,
    Query
};

console.log('Appwrite تم تهيئة');
  