# chat/admin.py

from django.contrib import admin
from .models import Entidade, Message, Documento

class EntidadeAdmin(admin.ModelAdmin):
    list_display = ('nome', 'descricao', 'created_at')
    search_fields = ('nome',)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('entidade', 'sender', 'text', 'created_at')
    list_filter = ('entidade', 'sender')
    search_fields = ('text',)

class DocumentoAdmin(admin.ModelAdmin):
    # Campos que aparecerão na lista
    list_display = ('entidade', 'arquivo', 'status', 'uploaded_at')
    # Filtros que aparecerão na barra lateral direita
    list_filter = ('status', 'entidade')
    # Permite buscar pelo nome do arquivo
    search_fields = ('arquivo',)

# Registra os modelos com suas respectivas classes de Admin
admin.site.register(Entidade, EntidadeAdmin)
admin.site.register(Message, MessageAdmin)
# Registra o novo modelo Documento
admin.site.register(Documento, DocumentoAdmin)