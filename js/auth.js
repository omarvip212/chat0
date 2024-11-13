import { account } from './appwrite-config.js';
const { ID } = Appwrite;

// استمع لحدث تقديم النموذج
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // إنشاء حساب جديد
        await account.create(
            ID.unique(),
            email,
            password
        );
        
        // تسجيل الدخول مباشرة بعد التسجيل
        await account.createEmailSession(email, password);
        
        // توجيه المستخدم إلى الصفحة الرئيسية
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        alert('حدث خطأ في التسجيل. الرجاء المحاولة مرة أخرى.');
    }
});

// تسجيل الدخول
async function login(email, password) {
    try {
        await account.createEmailSession(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging in:', error);
        alert('خطأ في تسجيل الدخول');
    }
}

// تسجيل حساب جديد
async function register(email, password) {
    try {
        await account.create('unique()', email, password);
        await login(email, password);
    } catch (error) {
        console.error('Error registering:', error);
        alert('خطأ في إنشاء الحساب');
    }
}

// تسجيل الخروج
async function logout() {
    try {
        await account.deleteSession('current');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

export default { login, register, logout }; 