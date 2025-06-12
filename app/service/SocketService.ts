import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './AxiosInstance';

class SocketService {
    private chatSocket: any = null;

    // Inicializar socket de chat con manejo de errores mejorado
    public async initChatSocket() {
        try {
            if (this.chatSocket && this.chatSocket.connected) {
                console.log("Socket ya está conectado, reutilizando conexión");
                return this.chatSocket;
            }

            const token = await AsyncStorage.getItem('token');
            console.log("Intentando conectar al socket con token:", token ? "Token presente" : "Sin token");

            // Usar la IP correcta, la misma que en AxiosInstance.ts
            this.chatSocket = io(`${BASE_URL}/chat`, {
                auth: {
                    token: token || ''
                },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            // Manejar eventos de conexión
            this.chatSocket.on('connect', () => {
                console.log('Socket conectado exitosamente');
            });

            this.chatSocket.on('connect_error', (error: any) => {
                console.error('Error al conectar socket:', error.message);
            });

            return this.chatSocket;
        } catch (error) {
            console.error('Error al inicializar socket:', error);
            throw error;
        }
    }

    // Métodos para gestionar salas de chat
    public joinChatRoom(roomId: string) {
        if (!this.chatSocket || !this.chatSocket.connected) {
            console.error('Chat socket not initialized or not connected');
            return false;
        }

        console.log('Uniendo a sala:', roomId);
        this.chatSocket.emit('join_room', roomId);
        return true;
    }

    // Método para enviar mensajes
    public sendMessage(roomId: string, messageData: any) {
        if (!this.chatSocket || !this.chatSocket.connected) {
            console.error('Chat socket not initialized or not connected');
            return false;
        }

        this.chatSocket.emit('send_message', {
            room: roomId,
            message: messageData
        });
        return true;
    }

    // Cerrar conexión
    public disconnect() {
        if (this.chatSocket) {
            this.chatSocket.disconnect();
            this.chatSocket = null;
        }
    }
}

// Singleton
export const socketService = new SocketService();