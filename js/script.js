import { account, databases, DATABASE_ID, ROOMS_COLLECTION_ID } from './appwrite-config.js';

// دالة إنشاء غرفة جديدة
async function createChatRoom() {
    try {
        const user = await account.get();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

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

        console.log('تم إنشاء الغرفة:', room);
        window.location.href = `chat-room.html?id=${room.$id}`;
        
    } catch (error) {
        console.error('خطأ في إنشاء الغرفة:', error);
        alert('حدث خطأ في إنشاء الغرفة');
    }
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
            console.error('خطأ في تسجيل الخروج:', error);
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
    } catch (error) {
        console.error('خطأ:', error);
        window.location.href = 'login.html';
    }
});

// إضافة دالة الانضمام للغرفة للنافذة العالمية
window.joinRoom = (roomId) => {
    window.location.href = `chat-room.html?id=${roomId}`;
}; 