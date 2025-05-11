import { store } from '../store';
import { addNotification } from '../store/slices/notificationSlice';

class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout = 1000;

    constructor() {
        this.connect();
    }

    private connect() {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'notification') {
                    store.dispatch(addNotification(data.payload));
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.reconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), this.reconnectTimeout * this.reconnectAttempts);
        }
    }

    public send(message: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    public close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const websocketService = new WebSocketService(); 