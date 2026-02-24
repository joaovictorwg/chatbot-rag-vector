# automations/views.py (Exemplo do que você precisará)
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Automacao, Agente, Execucao
from .serializers import AutomacaoSerializer, AgenteSerializer, ExecucaoSerializer
from .tasks import executar_automacao_task

class AutomacaoListView(ListAPIView):
    serializer_class = AutomacaoSerializer
    def get_queryset(self):
        return Automacao.objects.filter(entidade_id=self.kwargs['entidade_id'])

class AgenteListView(ListAPIView):
    serializer_class = AgenteSerializer
    def get_queryset(self):
        return Agente.objects.filter(entidade_id=self.kwargs['entidade_id'])

class ExecucaoListView(ListAPIView):
    serializer_class = ExecucaoSerializer
    def get_queryset(self):
        return Execucao.objects.filter(automacao__entidade_id=self.kwargs['entidade_id']).order_by('-started_at')

class ExecutarAutomacaoView(APIView):
    def post(self, request, automacao_id, *args, **kwargs):
        try:
            automacao = Automacao.objects.get(pk=automacao_id)
            # Lógica para escolher um agente online
            agente_online = Agente.objects.filter(entidade=automacao.entidade, is_online=True).first()
            if not agente_online:
                return Response({"error": "Nenhum agente online disponível para esta entidade."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Cria o registro da execução e dispara a tarefa
            execucao = Execucao.objects.create(automacao=automacao, agente=agente_online, status='PENDENTE')
            
            # Lógica para enviar comando via WebSocket ao agente...
            # (Simplificado aqui, mas você enviaria o comando via Channel Layer)
            
            return Response(ExecucaoSerializer(execucao).data, status=status.HTTP_202_ACCEPTED)
        except Automacao.DoesNotExist:
            return Response({"error": "Automação não encontrada."}, status=status.HTTP_404_NOT_FOUND)