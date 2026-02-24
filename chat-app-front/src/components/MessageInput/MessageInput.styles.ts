// MessageInput.styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  bottom: 0;
  width: 100%;
  max-width: 720px;
  padding: 16px;
  background: transparent;
  z-index: 10;
  padding-bottom: 80px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  max-height: 240px; /* opcional, limite máximo */
`;

export const TextArea = styled.textarea`
 width: 100%;
  resize: none;
  overflow-y: auto;   
  max-height: 160px;   
  font-size: 16px;
  line-height: 20px;
  border: none;
  outline: none;
  background: transparent;
  color: #000;
  font-family: inherit;
`;

export const IconsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #111;
  }
`;

export const FileInput = styled.input`
  display: none;
`;
