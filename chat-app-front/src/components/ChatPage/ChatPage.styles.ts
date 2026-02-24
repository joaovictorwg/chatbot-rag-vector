import styled from 'styled-components';

// 1. O container principal vira a nossa "âncora" de posicionamento.
export const ChatContainer = styled.div`
  height: 100vh;
  background: #f0f2f5; 
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  position: relative; 
`;

// O MessageContainer pode continuar como está ou ser removido se MessageList for o único filho.
// Vou mantê-lo por consistência.
export const MessageContainer = styled.div`
  flex: 1; // Faz ele tentar ocupar todo o espaço disponível
  display: flex;
  flex-direction: column; // Para que a MessageList dentro dele possa crescer
  min-height: 0;
  width: 80%; 
  padding: 0px 10px 0px 10px;
`;

// 2. A lista de mensagens ganha um "respiro" no final para não ficar atrás do input.
export const MessageList = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  min-height: 0;
  padding: 20px 10px; 
  

  &::-webkit-scrollbar {
    width: 8px;
    background: #e9ecef; // Cor de fundo do scroll
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #adb5bd; // Cor do "polegar" do scroll
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #868e96;
  }
`;

// Message e Error não precisam de alterações.
export const Message = styled.div<{ sender: string }>`
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  align-self: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  background-color: ${({ sender }) => (sender === 'user' ? '#ff9800' : '#e4e6eb')};
  color: ${({ sender }) => (sender === 'user' ? 'white' : '#050505')};
`;

export const Error = styled.p`
  /* ... seu código ... */
`;

