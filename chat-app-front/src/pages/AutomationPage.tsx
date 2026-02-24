import { useState, useEffect } from 'react';
import { Title, Card, Table, Badge, Button, Group, Text, Loader, Modal, Code } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlayerPlay, IconFileText } from '@tabler/icons-react';
import { executarAutomacao, fetchAgentes, fetchAutomacoes, fetchExecucoes } from '../pgapi/automacoes';
import type { Agente, Automacao, Execucao } from '../types/automacoes';
 
interface AutomationsPageProps {
  entidadeId: number;
}

export function AutomationsPage({ entidadeId }: AutomationsPageProps) {
  const [automacoes, setAutomacoes] = useState<Automacao[]>([]);
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [execucoes, setExecucoes] = useState<Execucao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLog, setSelectedLog] = useState('');

  // Função para carregar todos os dados
  const carregarDados = async () => {
    try {
      const [automacoesData, agentesData, execucoesData] = await Promise.all([
        fetchAutomacoes(entidadeId),
        fetchAgentes(entidadeId),
        fetchExecucoes(entidadeId),
      ]);
      setAutomacoes(automacoesData);
      setAgentes(agentesData);
      setExecucoes(execucoesData);
    } catch (error) {
      console.error("Falha ao carregar dados de automação", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling para atualizar o status das execuções a cada 5 segundos
  useEffect(() => {
    carregarDados(); // Carga inicial
    const interval = setInterval(() => {
      fetchExecucoes(entidadeId).then(setExecucoes);
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [entidadeId]);

  const handleExecutar = async (automacaoId: number) => {
    await executarAutomacao(automacaoId);
    carregarDados(); // Recarrega os dados para mostrar a nova execução "Pendente"
  };

  const handleViewLog = (log: string) => {
    setSelectedLog(log);
    open();
  };

  if (isLoading) return <Loader />;

  return (
    <div style={{ padding: '2rem' }}>
      <Modal opened={opened} onClose={close} title="Log de Execução" size="xl">
        <Code block>{selectedLog || 'Nenhum log disponível.'}</Code>
      </Modal>

      <Title order={2} mb="lg">Painel de Automações</Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Title order={4}>Agentes Disponíveis</Title>
        {agentes.map(agente => (
          <Group key={agente.id} justify="space-between" mt="sm">
            <Text>{agente.nome}</Text>
            <Badge color={agente.is_online ? 'teal' : 'gray'}>{agente.is_online ? 'Online' : 'Offline'}</Badge>
          </Group>
        ))}
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Title order={4}>Automações</Title>
        <Table mt="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Descrição</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {automacoes.map(auto => (
              <Table.Tr key={auto.id}>
                <Table.Td>{auto.nome}</Table.Td>
                <Table.Td>{auto.descricao}</Table.Td>
                <Table.Td>
                  <Button size="xs" leftSection={<IconPlayerPlay size={14} />} onClick={() => handleExecutar(auto.id)}>
                    Executar
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4}>Histórico de Execuções</Title>
        <Table mt="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Automação</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Início</Table.Th>
              <Table.Th>Fim</Table.Th>
              <Table.Th>Logs</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {execucoes.map(exec => (
              <Table.Tr key={exec.id}>
                <Table.Td>{exec.automacao_nome}</Table.Td>
                <Table.Td><Badge color={exec.status === 'CONCLUIDO' ? 'green' : 'orange'}>{exec.status}</Badge></Table.Td>
                <Table.Td>
                {exec.started_at ? new Date(exec.started_at).toLocaleString() : '—'}
                </Table.Td>
                <Table.Td>
                {exec.finished_at ? new Date(exec.finished_at).toLocaleString() : '—'}
                </Table.Td>
                <Table.Td>
                  <Button variant="outline" size="xs" leftSection={<IconFileText size={14} />} onClick={() => handleViewLog(exec.log_output ? new Date(exec.log_output).toLocaleString() : '—')}>
                    Ver Log
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </div>
  );
}