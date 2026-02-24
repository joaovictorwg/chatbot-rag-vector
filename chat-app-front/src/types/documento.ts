export interface Documento {
  id: number;
  arquivo: string;  
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'FALHOU';
  uploaded_at: string;
}