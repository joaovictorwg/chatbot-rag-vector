import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import type { Message } from '../../types/message';
import { fetchMessages as fetchMessagesApi } from '../../pgapi/messages'; // Renomeamos para evitar conflito


// --- ADICIONE ESTES TIPOS ---
type StatusMessage = {
  type: 'status';
  message: string;
};

type ChatMessagePayload = {
  type: 'chat_message';
  message: Message;
};

type WebSocketMessage = StatusMessage | ChatMessagePayload;
// ----------------------------


export function useChatPage(entidadeId: number | null) {
  // --- Nossos Estados ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [botStatus, setBotStatus] = useState<string>(''); // Para "Pesquisando...", etc.
  
  // --- Configuração do WebSocket ---
  const socketUrl = entidadeId ? `ws://127.0.0.1:8000/ws/chat/${entidadeId}/` : null;
  
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => {
    console.log('WebSocket closed:', closeEvent.code);
    return true;
} // Adicionamos o underscore
  });

  // --- Lógica para Carregar Histórico Inicial (via HTTP) ---
  const fetchInitialHistory = useCallback(async () => {
    if (entidadeId) {
      setMessages([]); // Limpa o chat anterior
      setBotStatus('Carregando histórico...');
      try {
        const history = await fetchMessagesApi(entidadeId);
        setMessages(history);
        setBotStatus('');
      } catch (err) {
        console.error("Falha ao buscar histórico", err);
        setBotStatus('Erro ao carregar histórico.');
      }
    }
  }, [entidadeId]);

  useEffect(() => {
    fetchInitialHistory();
  }, [fetchInitialHistory]);

  // --- Lógica para Processar Mensagens do WebSocket ---
 
   useEffect(() => {
    if (lastJsonMessage) {
      // Linha antiga: const data = lastJsonMessage as any;
      // Linha CORRIGIDA:
      const data = lastJsonMessage as WebSocketMessage;

      if (data.type === 'status') {
        setBotStatus(data.message);
      } 
      else if (data.type === 'chat_message') {
        setBotStatus('');
        setMessages((prev) => [...prev, data.message]);
      }
    }
  }, [lastJsonMessage]);

  // --- Função para Enviar Mensagem (via WebSocket) ---
  const sendChatMessage = useCallback((text: string) => {
    if (text.trim().length > 0) {
      const userMessage: Message = {
        id: Date.now(),
        text: text,
        sender: 'user',
        created_at: new Date().toISOString(),
        image: null,
        entidade: entidadeId!,
      };
      setMessages((prev) => [...prev, userMessage]);
      sendMessage(JSON.stringify({ message: text }));
    }
  }, [sendMessage, entidadeId]);

  // Status da conexão para a UI
  const connectionStatus = ReadyState[readyState];

  return { messages, botStatus, connectionStatus, sendChatMessage };
}