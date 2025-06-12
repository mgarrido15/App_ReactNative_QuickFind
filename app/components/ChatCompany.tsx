import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { socketService } from '../service/SocketService';
import { Socket } from 'socket.io-client';
import { styles } from '../styles';

// Esta interfaz define lo que recibe el componente
interface ChatCompanyProps {
    companyUser: {
        _id: string;
        name?: string;
        email?: string;
        [key: string]: any;
    };
    userId: string;
    onClose?: () => void;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: number;
}

const ChatCompany = ({ companyUser, userId, onClose }: ChatCompanyProps) => {
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(false);
    const chatSocketRef = useRef<Socket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    // Generamos un roomId basado en el userId y companyId
    useEffect(() => {
        if (companyUser?._id && userId) {
            // Crear un ID de sala único para esta conversación
            const generatedRoomId = [companyUser._id, userId].sort().join('-');
            setRoomId(generatedRoomId);
            console.log("Room ID generado:", generatedRoomId);
        }
    }, [companyUser, userId]);

    // Hacer scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [messages]);

    // Función para inicializar el socket
    const initSocket = async () => {
        if (!roomId) return;

        try {
            setConnecting(true);
            setError(null);
            setLoadingHistory(true);

            console.log("Iniciando conexión al socket...");
            const socket = await socketService.initChatSocket();
            chatSocketRef.current = socket;

            // Manejar la conexión existente o esperar a que se conecte
            if (socket.connected) {
                console.log("Socket ya conectado, uniéndose a sala:", roomId);
                socket.emit('join_room', roomId);
            } else {
                console.log("Socket no conectado, esperando conexión...");
                socket.on('connect', () => {
                    console.log("Socket conectado, uniéndose a sala:", roomId);
                    socket.emit('join_room', roomId);
                });
            }

            // Configurar listener para recibir historial de mensajes
            socket.off('message_history'); // Prevenir duplicados
            socket.on('message_history', (historyMessages: Message[]) => {
                console.log('Historial recibido:', historyMessages);
                if (Array.isArray(historyMessages) && historyMessages.length > 0) {
                    // Validar y formatear cada mensaje del historial
                    const validMessages = historyMessages.map(msg => ({
                        id: msg.id || `hist-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
                        text: msg.text || '',
                        sender: msg.sender || '',
                        timestamp: typeof msg.timestamp === 'number' ?
                            msg.timestamp :
                            (typeof msg.timestamp === 'string' ?
                                new Date(msg.timestamp).getTime() :
                                Date.now())
                    }));

                    // Ordenar mensajes por timestamp (del más antiguo al más reciente)
                    const sortedMessages = validMessages.sort((a, b) => a.timestamp - b.timestamp);
                    setMessages(sortedMessages);
                }
                setLoadingHistory(false);
            });

            // Configurar listener para recibir mensajes nuevos
            socket.off('receive_message'); // Prevenir duplicados
            socket.on('receive_message', (message: Message) => {
                console.log('Mensaje recibido:', message);

                // Ignorar mensajes propios para evitar duplicados
                if (message.sender === companyUser._id) {
                    console.log('Ignorando eco de mensaje propio');
                    return;
                }

                // Asegurar que el ID es único
                const uniqueMessage = {
                    ...message,
                    id: message.id || `server-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
                    timestamp: typeof message.timestamp === 'number' ?
                        message.timestamp :
                        (typeof message.timestamp === 'string' ?
                            new Date(message.timestamp).getTime() :
                            Date.now())
                };

                setMessages(prev => [...prev, uniqueMessage]);
            });

        } catch (error) {
            console.error('Error al inicializar el socket:', error);
            setError('No se pudo conectar al chat. Verifica tu conexión.');
        } finally {
            setConnecting(false);
        }
    };

    // Inicializar el socket cuando tenemos un roomId
    useEffect(() => {
        if (roomId) {
            initSocket();
        }

        // Limpieza al desmontar
        return () => {
            if (chatSocketRef.current) {
                console.log("Limpiando listeners del socket...");
                chatSocketRef.current.off('message_history');
                chatSocketRef.current.off('receive_message');
            }
        };
    }, [roomId]);

    // Manejar envío de mensajes
    const handleSendMessage = () => {
        if (!newMessage.trim() || !roomId) return;

        // Verificar que el socket esté conectado
        if (!chatSocketRef.current || !chatSocketRef.current.connected) {
            Alert.alert("Error", "No estás conectado al chat. Intentando reconectar...");
            initSocket();
            return;
        }

        const messageData = {
            text: newMessage,
            sender: companyUser._id,
            timestamp: Date.now(),
            id: `${companyUser._id}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
        };

        console.log("Enviando mensaje:", messageData);

        // Enviar mensaje a través del socket
        const success = socketService.sendMessage(roomId, messageData);

        if (success) {
            // Actualización optimista - añadir mensaje a la UI inmediatamente
            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
        } else {
            Alert.alert("Error", "No se pudo enviar el mensaje. Intentando reconectar...");
            initSocket();
        }
    };

    return (
        <SafeAreaView style={styles.chatContainer}>
            <View style={{ flex: 1, position: 'relative' }}>
                {(connecting || loadingHistory) && (
                    <View style={styles.chatStatusContainer}>
                        <ActivityIndicator size="large" color="#4c87af" />
                        <Text style={styles.chatStatusText}>
                            {connecting ? 'Conectando...' : 'Cargando mensajes...'}
                        </Text>
                    </View>
                )}

                {error && (
                    <View style={styles.chatErrorContainer}>
                        <Text style={styles.chatErrorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.chatRetryButton}
                            onPress={initSocket}
                        >
                            <Text style={styles.chatRetryButtonText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => item.id || `msg-${index}-${Date.now()}`}
                    style={styles.chatMessageList}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    renderItem={({ item }) => (
                        <View style={[
                            styles.chatMessageBubble,
                            item.sender === companyUser._id ? styles.chatSentBubble : styles.chatReceivedBubble
                        ]}>
                            <Text style={styles.chatMessageText}>{item.text || "Mensaje sin contenido"}</Text>
                            <Text style={styles.chatTimestamp}>
                                {item.timestamp ?
                                    new Date(item.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) :
                                    "Hora desconocida"
                                }
                            </Text>
                        </View>
                    )}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Barra de entrada para mensajes */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={100}
                    style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
                >
                    <View style={styles.chatInputContainer}>
                        <TextInput
                            style={styles.chatInput}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            placeholder="Escribe un mensaje..."
                            placeholderTextColor="#999"
                            multiline
                        />
                        <TouchableOpacity
                            style={styles.chatSendButton}
                            onPress={handleSendMessage}
                            disabled={connecting || loadingHistory || !!error}
                        >
                            <Text style={styles.chatSendButtonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default ChatCompany;