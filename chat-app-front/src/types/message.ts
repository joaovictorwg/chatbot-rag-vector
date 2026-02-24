export interface Message {
  id: number;
  text: string | null;      // O texto pode ser nulo
  image: string | null;     // A imagem também pode ser nula
  sender: 'user' | 'bot'; // Assim garantimos que só pode ser um desses dois valores
  created_at: string;       // Geralmente uma string no formato ISO 8601
  entidade: number;         // ID da entidade associada a esta mensagem
}