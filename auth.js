import { account } from './js/appwrite-config.js';

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