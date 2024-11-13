self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('love-chat-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/chat-room.html',
                '/chat-styles.css',
                '/chat.js',
                '/appwrite-config.js'
            ]);
        })
    );
}); 