import api from './AxiosInstance';

export interface ChatMessage {
    _id: string;
    room: string;
    author: string;
    message: string;
    time: string;
}

export const getCompanyChats = async (companyId: string): Promise<string[]> => {
    try {
        const response = await api.get(`/chat/rooms/${companyId}`);
        return response.data.rooms;
    } catch (error) {
        console.error("Error fetching company chats:", error);
        throw error;
    }
};
export const getChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
    try {
        const response = await api.get(`/chat/messages/${roomId}`);
        console.log("Chat messages response:", response.data);

        // Extraemos el array de mensajes de la respuesta
        if (response.data && Array.isArray(response.data.messages)) {
            // Convertir los mensajes al formato esperado por el componente
            return response.data.messages.map((msg: any) => ({
                _id: msg.id || msg._id,
                author: msg.sender || msg.author,
                message: msg.text || msg.message,
                time: msg.timestamp || msg.time,
            }));
        }

        return []; // Devolver array vacío si no hay mensajes
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        return []; // Devolver array vacío en caso de error
    }
};