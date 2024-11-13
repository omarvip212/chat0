import { account, databases, DATABASE_ID, ROOMS_COLLECTION_ID, USERS_COLLECTION_ID } from './appwrite-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // التحقق من حالة تسجيل الدخول
        const user = await account.get();
        
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // تحديث اسم المستخدم
        try {
            const userData = await databases.getDocument(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                user.$id
            );
            if (userData.username) {
                document.getElementById('username').textContent = `مرحباً، ${userData.username}`;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        // إعداد الأحداث
        setupEventListeners();
        
        // تحميل الغرف النشطة
        loadActiveRooms();

    } catch (error) {
        console.error('Error checking auth state:', error);
        window.location.href = 'login.html';
    }
});

function setupEventListeners() {
    // زر إنشاء غرفة
    document.getElementById('create-room')?.addEventListener('click', async () => {
        try {
            const roomId = await createChatRoom();
            showNotification('تم إنشاء الغرفة بنجاح!', 'success');
            window.location.href = `chat-room.html?id=${roomId}`;
        } catch (error) {
            showNotification('حدث خطأ في إنشاء الغرفة', 'error');
        }
    });

    // زر الانضمام للغرفة
    document.getElementById('join-room')?.addEventListener('click', () => {
        const roomCode = document.getElementById('room-code').value.trim();
        if (roomCode) {
            joinChatRoom(roomCode);
        } else {
            showNotification('الرجاء إدخال كود الغرفة', 'error');
        }
    });

    // زر تسجيل الخروج
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        try {
            await account.deleteSession('current');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error logging out:', error);
            showNotification('حدث خطأ في تسجيل الخروج', 'error');
        }
    });
}

async function loadActiveRooms() {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            ROOMS_COLLECTION_ID,
            [
                Query.equal('active', true),
                Query.orderDesc('createdAt'),
                Query.limit(10)
            ]
        );

        const roomsContainer = document.getElementById('active-rooms');
        roomsContainer.innerHTML = response.documents.map(room => `
            <div class="room-card">
                <h3>غرفة ${room.roomId}</h3>
                <button onclick="joinChatRoom('${room.$id}')" class="btn-secondary">
                    <i class="fas fa-sign-in-alt"></i>
                    انضمام
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading rooms:', error);
        showNotification('حدث خطأ في تحميل الغرف', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// دالة إنشاء غرفة جديدة
async function createChatRoom() {
    const roomId = Math.random().toString(36).substr(2, 9);
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            ROOMS_COLLECTION_ID,
            'unique()',
            {
                roomId: roomId,
                createdAt: new Date().toISOString(),
                active: true
            }
        );
        return response.$id;
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
} 