import { storage } from './appwrite-config.js';

class MediaManager {
    constructor(chatRoom) {
        this.chatRoom = chatRoom;
        this.setupEventListeners();
    }

    async uploadMedia(file) {
        try {
            const result = await storage.createFile(
                BUCKET_ID,
                'unique()',
                file
            );
            return result.$id;
        } catch (error) {
            console.error('Error uploading media:', error);
            throw error;
        }
    }

    setupEventListeners() {
        const stickerBtn = document.getElementById('sticker-btn');
        const gifBtn = document.getElementById('gif-btn');
        
        stickerBtn?.addEventListener('click', () => this.showStickerModal());
        gifBtn?.addEventListener('click', () => this.showGifModal());
        
        // البحث عن GIF
        const gifSearch = document.getElementById('gif-search');
        let searchTimeout;
        gifSearch?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchGifs(e.target.value);
            }, 500);
        });

        // تصنيفات الملصقات
        document.querySelectorAll('.sticker-categories button').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.sticker-categories .active').classList.remove('active');
                btn.classList.add('active');
                this.loadStickers(btn.dataset.category);
            });
        });
    }

    async loadStickers(category = 'love') {
        const container = document.getElementById('sticker-container');
        if (!container) return;

        container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

        try {
            const response = await fetch(`/stickers/${category}.json`);
            const stickers = await response.json();
            
            container.innerHTML = stickers.map(sticker => `
                <div class="sticker-item" onclick="mediaManager.sendSticker('${sticker.url}')">
                    <img src="${sticker.url}" alt="sticker">
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading stickers:', error);
            container.innerHTML = '<p>حدث خطأ في تحميل الملصقات</p>';
        }
    }

    async searchGifs(query) {
        const container = document.getElementById('gif-container');
        if (!container) return;

        container.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=${this.GIPHY_API_KEY}&q=${query}&limit=15`
            );
            const data = await response.json();
            
            container.innerHTML = data.data.map(gif => `
                <div class="gif-item" onclick="mediaManager.sendGif('${gif.images.fixed_height.url}')">
                    <img src="${gif.images.fixed_height.url}" alt="gif">
                </div>
            `).join('');
        } catch (error) {
            console.error('Error searching GIFs:', error);
            container.innerHTML = '<p>حدث خطأ في البحث عن GIF</p>';
        }
    }

    async sendSticker(url) {
        await this.chatRoom.sendMedia('sticker', url);
        document.getElementById('sticker-modal').style.display = 'none';
    }

    async sendGif(url) {
        await this.chatRoom.sendMedia('gif', url);
        document.getElementById('gif-modal').style.display = 'none';
    }

    showStickerModal() {
        document.getElementById('sticker-modal').style.display = 'block';
    }

    showGifModal() {
        document.getElementById('gif-modal').style.display = 'block';
        this.searchGifs('love'); // البحث الافتراضي
    }
} 