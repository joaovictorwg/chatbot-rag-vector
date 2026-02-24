// src/services/api.ts
import axios from 'axios';
import type { Agente, Automacao, Execucao } from '../types/automacoes';
// Importe os novos tipos que você criará
 

const API_URL = 'http://127.0.0.1:8000/api';

export async function fetchAutomacoes(entidadeId: number): Promise<Automacao[]> {
  const response = await axios.get<Automacao[]>(`${API_URL}/entidades/${entidadeId}/automacoes/`);
  return response.data;
}

export async function fetchAgentes(entidadeId: number): Promise<Agente[]> {
  const response = await axios.get<Agente[]>(`${API_URL}/entidades/${entidadeId}/agentes/`);
  return response.data;
}

export async function fetchExecucoes(entidadeId: number): Promise<Execucao[]> {
  const response = await axios.get<Execucao[]>(`${API_URL}/entidades/${entidadeId}/execucoes/`);
  return response.data;
}

export async function executarAutomacao(automacaoId: number): Promise<Execucao> {
  const response = await axios.post<Execucao>(`${API_URL}/automacoes/${automacaoId}/run/`);
  return response.data;
}