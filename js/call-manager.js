class CallManager {
    constructor(chatRoom) {
        this.chatRoom = chatRoom;
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.isVideo = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('voice-call-btn')?.addEventListener('click', () => this.startCall(false));
        document.getElementById('video-call-btn')?.addEventListener('click', () => this.startCall(true));
        document.getElementById('end-call')?.addEventListener('click', () => this.endCall());
        document.getElementById('toggle-mic')?.addEventListener('click', () => this.toggleMic());
        document.getElementById('toggle-video')?.addEventListener('click', () => this.toggleVideo());
    }

    async startCall(isVideo) {
        try {
            this.isVideo = isVideo;
            const constraints = {
                audio: true,
                video: isVideo
            };

            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            document.getElementById('local-video').srcObject = this.localStream;

            this.setupPeerConnection();
            this.showCallModal('جاري الاتصال...');
            await this.createOffer();
        } catch (error) {
            console.error('Error starting call:', error);
            alert('حدث خطأ في بدء المكالمة');
        }
    }

    setupPeerConnection() {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };

        this.peerConnection = new RTCPeerConnection(configuration);

        this.localStream.getTracks().forEach(track => {
            this.peerConnection.addTrack(track, this.localStream);
        });

        this.peerConnection.ontrack = (event) => {
            this.remoteStream = event.streams[0];
            document.getElementById('remote-video').srcObject = this.remoteStream;
        };

        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignalingData({
                    type: 'candidate',
                    candidate: event.candidate
                });
            }
        };
    }

    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);

            this.sendSignalingData({
                type: 'offer',
                offer: offer
            });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    }

    async handleOffer(offer) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);

            this.sendSignalingData({
                type: 'answer',
                answer: answer
            });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    async handleAnswer(answer) {
        try {
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    async handleCandidate(candidate) {
        try {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error handling candidate:', error);
        }
    }

    sendSignalingData(data) {
        this.chatRoom.database.ref(`rooms/${this.chatRoom.roomId}/calls/${this.chatRoom.userId}`).set({
            ...data,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
        this.hideCallModal();
        this.sendSignalingData({ type: 'end' });
    }

    toggleMic() {
        const audioTrack = this.localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        document.getElementById('toggle-mic').classList.toggle('off');
    }

    toggleVideo() {
        if (this.isVideo) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            document.getElementById('toggle-video').classList.toggle('off');
        }
    }

    showCallModal(status) {
        const modal = document.getElementById('call-modal');
        document.getElementById('call-status').textContent = status;
        modal.style.display = 'block';
    }

    hideCallModal() {
        document.getElementById('call-modal').style.display = 'none';
    }
} 