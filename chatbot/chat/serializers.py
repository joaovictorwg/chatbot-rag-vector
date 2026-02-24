from rest_framework import serializers
from .models import Message, Documento, Entidade

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'text', 'image', 'sender', 'created_at']

# NOVO SERIALIZER para o upload de arquivos
class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = ['id', 'arquivo', 'status', 'uploaded_at']
        read_only_fields = ['status'] # O status é controlado pelo sistema


class EntidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entidade
        fields = ['id', 'nome', 'descricao', 'created_at']