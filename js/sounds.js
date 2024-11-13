class SoundManager {
    constructor() {
        this.messageSound = new Audio('/sounds/message.mp3');
        this.notificationSound = new Audio('/sounds/notification.mp3');
    }

    playMessageSound() {
        this.messageSound.play().catch(err => console.error('Error playing sound:', err));
    }

    playNotificationSound() {
        this.notificationSound.play().catch(err => console.error('Error playing sound:', err));
    }
} 