// ContentTab.tsx
import { useState } from 'react';
import type { Entidade } from '../../types/entidade';
import ChatPage from '../../components/ChatPage/ChatPage';
import { HeaderSimple } from '../../components/Header/HeaderSimple';
import { DocumentUploader } from '../../components/Repository/Repository';
import { AutomationsPage } from '../../pages/AutomationPage';

type Props = {
  entidade: Entidade;
};

function ContentTab({ entidade }: Props) {
  const [selectedTab, setSelectedTab] = useState('Chatbot');

  return (
    <div>
      <HeaderSimple active={selectedTab} onChange={setSelectedTab} />

      {selectedTab === 'Chatbot' && <ChatPage entidadeId={entidade.id} />}
      {selectedTab === 'Repositório' && <DocumentUploader entidadeId={entidade.id}/>}
      {selectedTab === 'Dados' && <AutomationsPage entidadeId={entidade.id}/>}
    </div>
  );
}

export default ContentTab;
