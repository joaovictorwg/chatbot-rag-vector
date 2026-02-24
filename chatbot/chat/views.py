# chat/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView

from .models import Message, Entidade, Documento
from .serializers import MessageSerializer, EntidadeSerializer, DocumentoSerializer
from .tasks import processar_documento_task
from .utils import setup_rag_chain_for_entity # <--- IMPORTAMOS A LÓGICA COMPARTILHADA


class EntidadeListView(ListAPIView):
    """
    View para listar todas as entidades. (Está correta, sem alterações)
    """
    queryset = Entidade.objects.all().order_by('nome')
    serializer_class = EntidadeSerializer


class DocumentoUploadView(APIView):
    def get(self, request, entidade_id, *args, **kwargs):
        """
        Este é o método GET que estava faltando.
        Ele lista todos os documentos para a entidade especificada.
        """
        documentos = Documento.objects.filter(entidade_id=entidade_id).order_by('-uploaded_at')
        serializer = DocumentoSerializer(documentos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
    """
    View para fazer upload de documentos para uma entidade. (Está correta, sem alterações)
    """
    def post(self, request, entidade_id, *args, **kwargs):
        try:
            Entidade.objects.get(pk=entidade_id)
        except Entidade.DoesNotExist:
            return Response({"error": "Entidade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        file_obj = request.data.get('arquivo')
        if not file_obj:
            return Response({"error": "Nenhum arquivo enviado."}, status=status.HTTP_400_BAD_REQUEST)

        documento = Documento.objects.create(entidade_id=entidade_id, arquivo=file_obj)
        processar_documento_task.delay(documento.id)
        serializer = DocumentoSerializer(documento)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)


class ChatMessageView(APIView):
    """
    View para o chat via HTTP, agora totalmente ciente das entidades.
    """
    def get(self, request, entidade_id, *args, **kwargs):
        messages = Message.objects.filter(entidade_id=entidade_id).order_by('created_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, entidade_id, *args, **kwargs):
        try:
            entidade = Entidade.objects.get(pk=entidade_id)
        except Entidade.DoesNotExist:
            return Response({"error": "Entidade não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        user_message_text = request.data.get('text')
        # A lógica de imagem não será usada com RAG por enquanto
        if not user_message_text:
            return Response({"error": "A mensagem de texto não pode estar vazia."}, status=status.HTTP_400_BAD_REQUEST)

        Message.objects.create(entidade=entidade, text=user_message_text, sender='user')

        # Carrega a cadeia de RAG específica para esta entidade, sob demanda
        retrieval_chain = setup_rag_chain_for_entity(entidade_id)

        if retrieval_chain:
            try:
                response = retrieval_chain.invoke({"input": user_message_text})
                bot_response_text = response.get("answer", "Não consegui encontrar uma resposta nos documentos.")
            except Exception as e:
                bot_response_text = f"Ocorreu um erro ao contatar a IA: {e}"
        else:
            bot_response_text = f"Olá de {entidade.nome}! O sistema de IA não está disponível para esta entidade."
        
        bot_message = Message.objects.create(entidade=entidade, text=bot_response_text, sender='bot')
        serializer = MessageSerializer(bot_message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)