# chat/models.py
from django.db import models

# 1. Crie o novo modelo para as Entidades
class Entidade(models.Model):
    nome = models.CharField(max_length=200, unique=True)
    descricao = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Documento(models.Model):
    STATUS_CHOICES = [
        ('PENDENTE', 'Pendente'),
        ('PROCESSANDO', 'Processando'),
        ('CONCLUIDO', 'Concluído'),
        ('FALHOU', 'Falhou'),
    ]

    entidade = models.ForeignKey(Entidade, on_delete=models.CASCADE, related_name='documentos')
    arquivo = models.FileField(upload_to='documentos_entidades/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDENTE')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.arquivo.name} ({self.entidade.nome})"

# 2. Modifique o modelo Message para incluir a relação
class Message(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]

    # --- MUDANÇA IMPORTANTE ---
    # Cada mensagem agora pertence a uma entidade.
    # O related_name='messages' nos permite fazer entidade.messages.all()
    entidade = models.ForeignKey(
        Entidade, 
        on_delete=models.CASCADE, 
        related_name='messages',
        null=True,  # <-- ADICIONE ISSO
        blank=True  # <-- E ISSO
    )

    text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='chat_images/', blank=True, null=True)
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.entidade.nome} - {self.get_sender_display()}: {self.text[:50]}'