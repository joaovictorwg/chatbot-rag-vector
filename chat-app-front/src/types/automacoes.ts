// src/types/automacao.ts

export interface Agente {
  id: number;
  nome: string;
  entidade: number;
  is_online: boolean;
  last_seen: string | null;
}

export interface Automacao {
  id: number;
  nome: string;
  descricao: string;
  entidade: number;
  created_at: string;
}

export interface Execucao {
  id: number;
  automacao: number;
  automacao_nome: string; 
  agente: number | null;
  status: 'PENDENTE' | 'RODANDO' | 'CONCLUIDO' | 'FALHOU';
  log_output: string | null;
  started_at: string | null;
  finished_at: string | null;
}