// MessageInput.tsx
import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Form,
  InputWrapper,
  TextArea,
  IconsRow,
  IconButton,
  FileInput,
} from './MessageInput.styles';

import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';

import {
  handleSubmitUtil,
  handleFileChange,
  handleKeyDown,
  validateMessage
} from './MessageInput.utils';


type MessageInputProps = {
  onSendMessage: (text: string, image: File | null) => Promise<void>;
  isSending: boolean;
};

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textAreaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`; 
    }
  }, [text]);

  // Função para enviar mensagem
  const submitFunction = () => {
    if (!validateMessage(text, image)) return;
    // Pode chamar o onSendMessage com texto e imagem
    onSendMessage(text, image).then(() => {
      setText('');
      setImage(null);
      setPreview(null);
      // Resetar input file manualmente
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    });
  };

  return (
    <Container>
      <Form
        onSubmit={(e) =>
          handleSubmitUtil(e, text, image, onSendMessage, setText, setImage, setPreview)
        }
      >
        <InputWrapper>
          {preview && (
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img
                src={preview}
                alt="Pré-visualização"
                style={{
                  maxWidth: '100%',
                  maxHeight: '150px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  borderRadius: '50%',
                  color: '#fff',
                  width: 24,
                  height: 24,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          )}

          <TextArea
            ref={textAreaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, text, image, submitFunction)}
            placeholder="Digite sua mensagem..."
          />
          
          <IconsRow>
            <label>
              <FileInput
                type="file"
                onChange={(e) => handleFileChange(e, setImage, setPreview)}
                accept="image/*"
              />
              <IconButton as="div">
                <FaPaperclip size={18} />
              </IconButton>
            </label>
            <IconButton type="submit">
              <FaPaperPlane size={18} />
            </IconButton>
          </IconsRow>
        </InputWrapper>

      </Form>
    </Container>
  );
};

