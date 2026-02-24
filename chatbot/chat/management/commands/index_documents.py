import os
from django.core.management.base import BaseCommand
from django.conf import settings

# Imports do LangChain
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

# from .models import Entidade # Importe o novo modelo

# Import do Google para configurar a API Key
import google.generativeai as genai

# ... (imports) ...

class Command(BaseCommand):
    help = 'Cria um índice vetorial para uma entidade específica.'

    # 1. Adiciona um argumento para receber o ID da entidade
    def add_arguments(self, parser):
        parser.add_argument('entidade_id', type=int, help='O ID da Entidade para indexar os documentos.')

    def handle(self, *args, **options):
        entidade_id = options['entidade_id']
        try:
            entidade = Entidade.objects.get(pk=entidade_id)
            self.stdout.write(self.style.SUCCESS(f"Iniciando indexação para a entidade: '{entidade.nome}'"))
        except Entidade.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"Entidade com ID {entidade_id} não encontrada."))
            return

        # ... (configuração da API Key do Google) ...

        # 2. Caminho dos documentos agora é específico da entidade
        docs_path = os.path.join(settings.BASE_DIR, 'documents', f'entidade_{entidade_id}')
        if not os.path.isdir(docs_path):
            self.stderr.write(self.style.ERROR(f"Pasta de documentos não encontrada em: {docs_path}"))
            return
            
        loader = PyPDFDirectoryLoader(docs_path)
        documents = loader.load()
        # ... (resto da lógica de carregar e dividir os textos) ...

        # 3. O nome da coleção agora é único para cada entidade
        COLLECTION_NAME = f"entidade_{entidade.id}_docs"
        self.stdout.write(f"Usando a coleção do PGVector: '{COLLECTION_NAME}'")
        
        # ... (lógica da Connection String) ...

        # 4. Ao criar o Vector Store, passamos o nome da coleção dinâmico
        #    Usar pre_delete_collection=True é útil para re-indexar do zero.
        PGVector.from_documents(
            documents=texts,
            embedding=embeddings,
            collection_name=COLLECTION_NAME,
            connection_string=CONNECTION_STRING,
            pre_delete_collection=True, 
        )

        self.stdout.write(self.style.SUCCESS(f"Indexação para '{entidade.nome}' finalizada com sucesso!"))