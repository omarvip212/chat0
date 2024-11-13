import { account, databases, DATABASE_ID, ROOMS_COLLECTION_ID, Query } from './appwrite-config.js';

// التحقق من تسجيل الدخول عند تحميل الصفحة
async function checkAuth() {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.error('Error checking auth:', error);
        return null;
    }
}

// إنشاء غرفة جديدة
async function createChatRoom() {
    try {
        const user = await account.get();
        if (!user) throw new Error('User not authenticated');

        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const room = await databases.createDocument(
            DATABASE_ID,
            ROOMS_COLLECTION_ID,
            'unique()',
            {
                roomId: roomId,
                name: `غرفة ${roomId}`,
                createdBy: user.$id,
                createdAt: new Date().toISOString(),
                active: true,
                lastMessage: new Date().toISOString()
            }
        );

        console.log('Room created:', room);
        window.location.href = `chat-room.html?id=${room.$id}`;
        
    } catch (error) {
        console.error('Error creating room:', error);
        alert('حدث خطأ في إنشاء الغرفة');
    }
}

// تحميل الغرف النشطة
async function loadActiveRooms() {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            ROOMS_COLLECTION_ID,
            [
                Query.equal('active', true),
                Query.orderDesc('lastMessage')
            ]
        );
        
        const roomsContainer = document.getElementById('active-rooms');
        if (!roomsContainer) return;

        roomsContainer.innerHTML = response.documents.map(room => `
            <div class="room-card">
                <div class="room-info">
                    <h3>${room.name}</h3>
                    <p>كود الغرفة: ${room.roomId}</p>
                </div>
                <button onclick="joinRoom('${room.$id}')" class="btn-secondary">
                    انضمام
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

// إظهار الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    if (!notification || !messageElement) return;
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    const createRoomBtn = document.getElementById('create-room');
    const joinRoomBtn = document.getElementById('join-room');
    const logoutBtn = document.getElementById('logout-btn');
    const roomCodeInput = document.getElementById('room-code');

    createRoomBtn?.addEventListener('click', createChatRoom);

    joinRoomBtn?.addEventListener('click', () => {
        const code = roomCodeInput?.value.trim();
        if (!code) {
            alert('الرجاء إدخال كود الغرفة');
            return;
        }
        window.joinRoom(code);
    });

    logoutBtn?.addEventListener('click', async () => {
        try {
            await account.deleteSession('current');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
}

// تنفيذ الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user = await account.get();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        setupEventListeners();
        await loadActiveRooms();
    } catch (error) {
        console.error('Error:', error);
        window.location.href = 'login.html';
    }
});

// إضافة دالة الانضمام للغرفة للنافذة العالمية
window.joinRoom = (roomId) => {
    window.location.href = `chat-room.html?id=${roomId}`;
}; 