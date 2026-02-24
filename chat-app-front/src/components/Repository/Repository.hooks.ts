import { useState, useEffect } from 'react';
import { fetchDocumentos, uploadDocumento } from '../../pgapi';
import type { Documento } from '../../types/documento';
import { AxiosError } from 'axios';

export function useDocumentUploader(entidadeId: number) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const carregarDocumentos = () => {
    fetchDocumentos(entidadeId).then(setDocumentos).catch(console.error);
  };

  useEffect(() => {
    if (entidadeId) carregarDocumentos();
  }, [entidadeId]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    setError(null);

    try {
      await uploadDocumento(entidadeId, selectedFile);
      setUploadStatus('success');
      setSelectedFile(null);
      setTimeout(carregarDocumentos, 1000);
    } catch (err: unknown) {
      let message = 'Erro no upload.';
      if (err instanceof AxiosError && err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      setUploadStatus('error');
    }
  };

  const resetStatus = () => setUploadStatus('idle');

  return {
    documentos,
    selectedFile,
    uploadStatus,
    error,
    setSelectedFile,
    handleUpload,
    resetStatus
  };
}
