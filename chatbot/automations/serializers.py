# automations/serializers.py

from rest_framework import serializers
from .models import Automacao, Agente, Execucao

class AgenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agente
        # O token não é enviado para o frontend por segurança,
        # ele é usado apenas para a conexão do agente.
        fields = ['id', 'nome', 'entidade', 'is_online', 'last_seen']

class AutomacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Automacao
        fields = ['id', 'nome', 'descricao', 'entidade', 'created_at']

class ExecucaoSerializer(serializers.ModelSerializer):
    # Campo extra para enviar o nome da automação junto, facilitando para o frontend
    automacao_nome = serializers.CharField(source='automacao.nome', read_only=True)

    class Meta:
        model = Execucao
        fields = [
            'id', 
            'automacao', 
            'automacao_nome', # Nome legível
            'agente', 
            'status', 
            'log_output', 
            'started_at', 
            'finished_at'
        ]