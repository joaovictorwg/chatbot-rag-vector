// src/ChatPage/ChatPage.tsx

import React, { useEffect, useRef } from 'react';
import { useChatPage } from './ChatPage.hook';
import { MessageInput } from '../MessageInput/MessageInput';
import * as styled from './ChatPage.styles';

interface ChatPageProps {
  entidadeId: number;
}

function ChatPage({ entidadeId }: ChatPageProps) {
  const { messages, botStatus, connectionStatus, sendChatMessage } = useChatPage(entidadeId);

  // ... (useRef, useEffect de scroll, getImageUrl, handleSendMessage não mudam) ...
  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, botStatus]);

  const getImageUrl = (imagePath: string | null) => {
    if (imagePath) return `http://127.0.0.1:8000${imagePath}`;
    return '';
  };

  const handleSendMessage = async (text: string, image: File | null) => {
    if (text) {
      sendChatMessage(text);
    }
    if (image) {
      console.log("Lógica de upload de imagem a ser implementada.");
    }
  };

  return (
    <styled.ChatContainer>
      <styled.MessageContainer>
        <styled.MessageList ref={messageListRef}>
          {messages.length === 0 && !botStatus && (
            <p style={{ textAlign: 'center', color: '#888', margin: 'auto' }}>
              Envie uma mensagem para iniciar a conversa.
            </p>
          )}

          {messages.map((msg) => (
            <styled.Message key={msg.id} sender={msg.sender}>
              {msg.text && <p>{msg.text}</p>}
              {msg.image && (
                <img src={getImageUrl(msg.image)} alt="Imagem do chat" style={{ maxWidth: '200px', borderRadius: '8px' }} />
              )}
            </styled.Message>
          ))}

          {botStatus && (
            <styled.Message sender="bot">
              <p><i>{botStatus}</i></p>
            </styled.Message>
          )}

        </styled.MessageList>
      </styled.MessageContainer>

      {/* A InputArea continua sendo renderizada normalmente, o que é o correto */}
        <MessageInput onSendMessage={handleSendMessage} isSending={!!botStatus} />
        
    </styled.ChatContainer>
  );
}

export default ChatPage;