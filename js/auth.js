import { account } from './appwrite-config.js';

// دالة لعرض رسائل الخطأ
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// معالجة نموذج التسجيل
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // التحقق من وجود الحساب
        try {
            await account.get();
            showError('هذا البريد الإلكتروني مسجل مسبقاً');
            return;
        } catch {
            // إذا لم يكن الحساب موجوداً، نتابع التسجيل
        }

        // إنشاء حساب جديد
        await account.create(
            crypto.randomUUID(), // معرف فريد
            email,
            password
        );
        
        // تسجيل الدخول مباشرة
        await account.createEmailSession(email, password);
        
        // توجيه المستخدم للصفحة الرئيسية
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        
        // معالجة الأخطاء المختلفة
        if (error.code === 409) {
            showError('هذا البريد الإلكتروني مسجل مسبقاً');
        } else if (error.code === 400) {
            showError('بيانات غير صالحة. تأكد من صحة البريد الإلكتروني وكلمة المرور');
        } else {
            showError('حدث خطأ في التسجيل. الرجاء المحاولة مرة أخرى');
        }
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