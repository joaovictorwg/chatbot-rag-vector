// src/hooks/App.hook.ts
import { useState, useEffect } from 'react';
import type { Entidade } from '../types/entidade';
import { fetchEntidades } from '../pgapi/messages';

export function useEntidades() {
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [selectedEntidade, setSelectedEntidade] = useState<Entidade | null>(null);

  useEffect(() => {
    const carregarEntidades = async () => {
      try {
        const data = await fetchEntidades();
        setEntidades(data);
        if (data.length > 0) setSelectedEntidade(data[0]);
      } catch (error) {
        console.error("Erro ao carregar entidades:", error);
      }
    };

    carregarEntidades();
  }, []);

  return {
    entidades,
    selectedEntidade,
    setSelectedEntidade,
  };
}
