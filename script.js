import { account, databases, DATABASE_ID, ROOMS_COLLECTION_ID } from './js/appwrite-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // التحقق من حالة تسجيل الدخول
    account.get().then(async (user) => {
        if (user) {
            try {
                const response = await databases.getDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    user.$id
                );
                if (response.username) {
                    document.getElementById('username').textContent = `مرحباً، ${response.username}`;
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            window.location.href = 'login.html';
        }
    }).catch(error => {
        console.error('Auth check error:', error);
        window.location.href = 'login.html';
    });

    // معالجة زر تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error logging out:', error);
            }
        });
    }

    // معالجة زر "لا"
    if (noBtn) {
        noBtn.addEventListener('mouseover', () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
            noBtn.style.position = 'absolute';
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        });
    }

    // معالجة زر "نعم"
    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            initialScreen.style.display = 'none';
            successScreen.style.display = 'block';
            document.querySelector('.cat').classList.add('happy');
        });
    }

    // معالجة زر إنشاء غرفة جديدة
    document.getElementById('create-room')?.addEventListener('click', async () => {
        try {
            const roomId = await createChatRoom();
            window.location.href = `chat-room.html?room=${roomId}`;
        } catch (error) {
            console.error('Error creating room:', error);
            alert('حدث خطأ في إنشاء الغرفة');
        }
    });

    // معالجة زر الانضمام للغرفة
    document.getElementById('join-room')?.addEventListener('click', () => {
        const roomId = prompt('أدخل كود الغرفة:');
        if (roomId) {
            window.location.href = `chat-room.html?room=${roomId}`;
        }
    });
});

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