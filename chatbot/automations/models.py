from django.db import models
import uuid
from chat.models import Entidade  

class Agente(models.Model):
    entidade = models.ForeignKey(Entidade, on_delete=models.CASCADE, related_name='agentes', help_text="A qual entidade este agente pertence?")
    nome = models.CharField(max_length=255, help_text="Ex: 'PC do Financeiro', 'Servidor de Testes'")
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, help_text="Token de autenticação gerado automaticamente para o agente.")
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = 'Online' if self.is_online else 'Offline'
        return f"{self.nome} ({self.entidade.nome}) - {status}"


class Automacao(models.Model):
    entidade = models.ForeignKey(Entidade, on_delete=models.CASCADE, related_name='automacoes')
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True)
    script = models.FileField(upload_to='automations_scripts/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.entidade.nome})"

class Execucao(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('RODANDO', 'Rodando'),
        ('CONCLUIDO', 'Concluído'),
        ('FALHOU', 'Falhou'),
    ]
    automacao = models.ForeignKey(Automacao, on_delete=models.CASCADE, related_name='execucoes')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    log_output = models.TextField(blank=True, null=True, help_text="Saída do console (stdout/stderr) da execução.")
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Execução de {self.automacao.nome} - {self.status}"