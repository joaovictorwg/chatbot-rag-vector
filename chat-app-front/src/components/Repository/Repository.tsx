import { useDocumentUploader } from './Repository.hooks';
import * as S from './Repository.styles';
import { getStatusBadge } from './Repository.utils';

interface DocumentUploaderProps {
  entidadeId: number;
}

export function DocumentUploader({ entidadeId }: DocumentUploaderProps) {
  const {
    documentos,
    selectedFile,
    uploadStatus,
    error,
    setSelectedFile,
    handleUpload,
    resetStatus
  } = useDocumentUploader(entidadeId);

  return (
    <S.Container>
      <S.Row>
        <S.Label htmlFor="file">Escolher arquivo:</S.Label>
        <S.FileInput
          id="file"
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
        />
        <S.Button onClick={handleUpload} disabled={!selectedFile || uploadStatus === 'uploading'}>
          {uploadStatus === 'uploading' ? 'Enviando...' : 'Enviar para IA'}
        </S.Button>
      </S.Row>

      {selectedFile && <S.Text>Arquivo selecionado: {selectedFile.name}</S.Text>}

      {uploadStatus === 'success' && (
        <S.Alert color="green">
          <S.AlertClose onClick={resetStatus}>x</S.AlertClose>
          Arquivo enviado com sucesso!
        </S.Alert>
      )}

      {uploadStatus === 'error' && (
        <S.Alert color="red">
          <S.AlertClose onClick={resetStatus}>x</S.AlertClose>
          {error}
        </S.Alert>
      )}

      <S.List>
        <S.ListTitle>Documentos na Base de Conhecimento:</S.ListTitle>
        {documentos.map((doc) => {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          return (
            <S.ListItem key={doc.id}>
              <S.Link href={`${apiUrl}${doc.arquivo}`} target="_blank">
                {doc.arquivo.split('/').pop()}
              </S.Link>
              {getStatusBadge(doc.status)}
            </S.ListItem>
          );
        })}
        {documentos.length === 0 && <S.Text>Nenhum documento encontrado.</S.Text>}
      </S.List>
    </S.Container>
  );
}
