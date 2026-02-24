from django.contrib import admin
from .models import Agente, Automacao, Execucao

@admin.register(Agente)
class AgenteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'entidade', 'is_online', 'last_seen')
    list_filter = ('is_online', 'entidade')
    # Mostra o token apenas na página de detalhes e o torna não editável.
    # Isso é perfeito para que você possa copiar o token para usar no script do agente.
    readonly_fields = ('token',)

@admin.register(Automacao)
class AutomacaoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'entidade', 'created_at')
    list_filter = ('entidade',)

@admin.register(Execucao)
class ExecucaoAdmin(admin.ModelAdmin):
    list_display = ('automacao', 'agente', 'status', 'started_at', 'finished_at')
    list_filter = ('status', 'agente', 'automacao__entidade')
    readonly_fields = ('started_at', 'finished_at', 'log_output')