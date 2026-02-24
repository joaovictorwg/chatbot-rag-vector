# automations/tasks.py

import docker
from celery import shared_task
from django.utils import timezone
from .models import Execucao

@shared_task
def executar_automacao_task(execucao_id):
    """
    Esta tarefa é chamada para executar um script de automação em um container Docker isolado.
    """
    execucao = None # Definimos fora do try para usar no finally
    try:
        # 1. Pega a execução no banco e atualiza seu status para "Rodando"
        execucao = Execucao.objects.get(pk=execucao_id)
        execucao.status = 'RODANDO'
        execucao.started_at = timezone.now()
        execucao.save()

        # Pega o caminho do arquivo de script que o Django salvou
        # Ex: /app/media/automations_scripts/meu_script.py
        script_path_host = execucao.automacao.script.path

        # 2. Inicializa o cliente Docker para se comunicar com o motor Docker
        client = docker.from_env()

        print(f"Iniciando container para execução ID: {execucao_id}")
        # 3. Cria e roda um container temporário e isolado
        container = client.containers.run(
            image='python:3.11-slim', # Uma imagem Python leve
            command=f'python /app/script.py', # O comando a ser executado dentro do container
            volumes={
                # Mapeia o script do host para dentro do container
                script_path_host: {'bind': '/app/script.py', 'mode': 'ro'} # 'ro' = read-only (só leitura)
            },
            detach=True, # Roda o container em segundo plano
        )
        
        # 4. Espera o container terminar e pega o resultado
        result = container.wait(timeout=300) # Timeout de 5 minutos
        exit_code = result.get('StatusCode', 1)
        
        # Pega os logs (saída do console) do script
        logs = container.logs().decode('utf-8', errors='ignore')
        execucao.log_output = logs

        # Destrói o container temporário após o uso
        container.remove()
        print(f"Container para execução ID: {execucao_id} finalizado e removido.")

        # 5. Define o status final baseado no código de saída do script
        if exit_code == 0:
            execucao.status = 'CONCLUIDO'
        else:
            execucao.status = 'FALHOU'

    except Exception as e:
        print(f"ERRO CRÍTICO na tarefa de automação {execucao_id}: {e}")
        if execucao:
            execucao.status = 'FALHOU'
            execucao.log_output = f"Erro no orquestrador Celery: {str(e)}"
    
    finally:
        # Garante que a data de finalização seja sempre salva
        if execucao:
            execucao.finished_at = timezone.now()
            execucao.save()