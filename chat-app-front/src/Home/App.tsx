// src/App.tsx
import NavbarSimple from '../components/navbar/NavbarSimple';
import { useEntidades } from './App.hook';
import * as styled from './App.styles';
import ContentTab from './ContentTab/ContentTab';

function App() {
  const {
    entidades,
    selectedEntidade,
    setSelectedEntidade,
  } = useEntidades();

  return (
    <styled.AppContainer>
      <NavbarSimple
        entidades={entidades}
        activeEntidade={selectedEntidade}
        onSelectEntidade={setSelectedEntidade}
      />

      <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
        {selectedEntidade ? (
          <ContentTab entidade={selectedEntidade} />
        ) : (
          <div style={{ padding: '1rem' }}>Selecione uma entidade para continuar.</div>
        )}
      </div>
    </styled.AppContainer>
  );
}

export default App;
