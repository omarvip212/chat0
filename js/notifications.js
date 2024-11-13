class NotificationManager {
    constructor() {
        this.permission = false;
        this.setup();
    }

    async setup() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.permission = permission === 'granted';
        }
    }

    async notify(title, options = {}) {
        if (!this.permission) return;

        try {
            const notification = new Notification(title, {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
} 