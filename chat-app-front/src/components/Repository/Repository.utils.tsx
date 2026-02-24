import type { Documento } from '../../types/documento';

export function getStatusBadge(status: Documento['status']) {
  const map = {
    PENDENTE: { label: 'Pendente', color: 'gray' },
    PROCESSANDO: { label: 'Processando', color: 'blue' },
    CONCLUIDO: { label: 'Concluído', color: 'green' },
    FALHOU: { label: 'Falhou', color: 'red' }
  };

  const { label, color } = map[status];
  return <span style={{
    padding: '2px 8px',
    borderRadius: '8px',
    fontSize: '12px',
    backgroundColor: color,
    color: '#fff',
  }}>{label}</span>;
}
