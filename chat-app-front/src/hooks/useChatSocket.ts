import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import type { Message } from '../types/message';
import { fetchMessages } from '../pgapi/messages'; // Usaremos a API antiga para buscar o histórico!

export function useChatSocket(entidadeId: number | null) {
  // Estado para a lista de mensagens da conversa
  const [messages, setMessages] = useState<Message[]>([]);
  // Estado para a mensagem de status do bot (ex: "Pesquisando...")
  const [botStatus, setBotStatus] = useState<string>('');

  // Constrói a URL do WebSocket. Se não houver entidadeId, a URL é nula e a conexão não é feita.
  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const apiHost = new URL(import.meta.env.VITE_API_URL || 'http://localhost:8000').hostname;
  const apiPort = new URL(import.meta.env.VITE_API_URL || 'http://localhost:8000').port || (window.location.protocol === 'https:' ? '443' : '80');
  const socketUrl = entidadeId ? `${wsProtocol}://${apiHost}:${apiPort}/ws/chat/${entidadeId}/` : null;

  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true, // Tenta reconectar em caso de queda
  });

  // Efeito para carregar o histórico de mensagens inicial via HTTP
  useEffect(() => {
    if (entidadeId) {
      setMessages([]); // Limpa mensagens antigas
      setBotStatus('Carregando histórico...');
      fetchMessages(entidadeId)
        .then(history => {
          setMessages(history);
          setBotStatus('');
        })
        .catch(err => {
          console.error("Falha ao buscar histórico", err);
          setBotStatus('Erro ao carregar histórico.');
        });
    }
  }, [entidadeId]); // Roda sempre que o ID da entidade mudar

  // Efeito para processar as mensagens recebidas via WebSocket
  useEffect(() => {
    if (lastJsonMessage) {
      const data = lastJsonMessage as any;

      if (data.type === 'status') {
        setBotStatus(data.message);
      } 
      else if (data.type === 'chat_message') {
        setBotStatus(''); // Limpa a mensagem de status
        // Adiciona a nova mensagem do bot à lista
        setMessages((prev) => [...prev, data.message as Message]);
      }
    }
  }, [lastJsonMessage]); // Roda sempre que uma nova mensagem JSON chegar

  // Função para o componente de input chamar quando o usuário envia uma mensagem
  const sendChatMessage = (text: string) => {
    // Adiciona a mensagem do usuário à UI imediatamente para uma sensação de rapidez
    const userMessage: Message = {
      id: Date.now(), // ID temporário para a key do React
      text: text,
      sender: 'user',
      created_at: new Date().toISOString(),
      image: null,
      entidade: entidadeId!
    };
    setMessages((prev) => [...prev, userMessage]);

    // Envia a mensagem para o backend via WebSocket
    sendMessage(JSON.stringify({ message: text }));
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Conectando...',
    [ReadyState.OPEN]: 'Conectado',
    [ReadyState.CLOSING]: 'Desconectando...',
    [ReadyState.CLOSED]: 'Desconectado',
    [ReadyState.UNINSTANTIATED]: 'Não instanciado',
  }[readyState];

  // Retorna tudo que o componente da UI precisa
  return { messages, botStatus, connectionStatus, sendChatMessage };
}