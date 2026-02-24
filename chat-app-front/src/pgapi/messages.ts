import axios from 'axios';
import type { Message } from '../types/message';
import type { Entidade } from '../types/entidade'; // Vamos criar este tipo
import type { Documento } from '../types/documento';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// --- Funções de Entidade ---

/**
 * Busca a lista de todas as entidades disponíveis.
 */
export async function fetchEntidades(): Promise<Entidade[]> {
  const response = await axios.get<Entidade[]>(`${API_URL}/entidades/`);
  return response.data;
}

// --- Funções de Documento ---

/**
 * Faz o upload de um arquivo para uma entidade específica.
 */
export async function uploadDocumento(entidadeId: number, arquivo: File): Promise<void> {
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  // A resposta será 202 Accepted, indicando que o processamento começou.
  await axios.post(`${API_URL}/entidades/${entidadeId}/documentos/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function fetchDocumentos(entidadeId: number): Promise<Documento[]> {
  const response = await axios.get<Documento[]>(`${API_URL}/entidades/${entidadeId}/documentos/`);
  return response.data;
}
// --- Funções de Chat ---

/**
 * Busca o histórico de mensagens para uma entidade específica.
 */
export async function fetchMessages(entidadeId: number): Promise<Message[]> {
  const response = await axios.get<Message[]>(`${API_URL}/entidades/${entidadeId}/chat/`);
  return response.data;
}

/**
 * Envia uma nova mensagem de texto ou imagem para uma entidade específica.
 */
export async function sendMessage(entidadeId: number, text: string, image: File | null): Promise<Message> {
  const formData = new FormData();
  formData.append('text', text);
  if (image) {
    formData.append('image', image);
  }

  // A API agora retorna a resposta do bot, então podemos capturá-la.
  const response = await axios.post<Message>(`${API_URL}/entidades/${entidadeId}/chat/`, formData);
  return response.data;
}