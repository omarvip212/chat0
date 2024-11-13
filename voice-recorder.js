import { storage } from './js/appwrite-config.js';

class VoiceRecorder {
    constructor(chatRoom) {
        this.chatRoom = chatRoom;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.recordingStartTime = null;
        this.recordingTimer = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const recordBtn = document.getElementById('voice-record-btn');
        const stopBtn = document.getElementById('stop-recording');
        const cancelBtn = document.getElementById('cancel-recording');

        recordBtn?.addEventListener('click', () => this.startRecording());
        stopBtn?.addEventListener('click', () => this.stopRecording());
        cancelBtn?.addEventListener('click', () => this.cancelRecording());
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            
            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                if (this.isRecording) {
                    this.processRecording();
                }
            };

            this.audioChunks = [];
            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            this.showRecordingUI();
            this.startTimer();
        } catch (error) {
            console.error('Error starting voice recording:', error);
            alert('لا يمكن الوصول إلى الميكروفون');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.hideRecordingUI();
            this.stopTimer();
        }
    }

    cancelRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.audioChunks = [];
            this.hideRecordingUI();
            this.stopTimer();
        }
    }

    async processRecording() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const duration = Math.round((Date.now() - this.recordingStartTime) / 1000);
        
        if (duration < 1) {
            alert('التسجيل قصير جداً');
            return;
        }

        try {
            const audioUrl = await this.uploadAudio(audioBlob);
            await this.chatRoom.sendVoiceMessage(audioUrl, duration);
        } catch (error) {
            console.error('Error processing voice recording:', error);
            alert('حدث خطأ في معالجة التسجيل');
        }
    }

    async uploadAudio(blob) {
        try {
            const file = await storage.createFile(
                'media-files',
                'unique()',
                blob
            );
            return file.$id;
        } catch (error) {
            console.error('Error uploading audio:', error);
            throw error;
        }
    }

    showRecordingUI() {
        document.querySelector('.message-input-wrapper').style.display = 'none';
        document.querySelector('.voice-recording-ui').style.display = 'flex';
    }

    hideRecordingUI() {
        document.querySelector('.message-input-wrapper').style.display = 'flex';
        document.querySelector('.voice-recording-ui').style.display = 'none';
    }

    startTimer() {
        const timerElement = document.querySelector('.recording-time');
        let seconds = 0;
        
        this.recordingTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }
} 