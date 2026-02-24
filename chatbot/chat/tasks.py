# chat/tasks.py
import os
from celery import shared_task
from django.conf import settings
from .models import Documento

# Imports do LangChain
# --- LINHA A SER CORRIGIDA ---
from langchain_community.document_loaders import PyPDFLoader, TextLoader # Trocamos TextIOWrapper por TextLoader
# -----------------------------

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores.pgvector import PGVector
import google.generativeai as genai


@shared_task
def processar_documento_task(documento_id):
    try:
        documento = Documento.objects.get(pk=documento_id)
        documento.status = 'PROCESSANDO'
        documento.save()

        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

        file_path = documento.arquivo.path
        

        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".txt"):
            loader = TextLoader(file_path, encoding='utf-8')
        else:
            documento.status = 'FALHOU'
            documento.save()
            raise Exception("Formato de arquivo não suportado")
        
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        texts = text_splitter.split_documents(documents)

        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        connection_string = PGVector.connection_string_from_db_params(
            driver="psycopg2",
            host=os.getenv("POSTGRES_HOST", "db"),
            port=int(os.getenv("POSTGRES_PORT", 5432)),
            database=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
        )
        
        collection_name = f"entidade_{documento.entidade.id}_docs"

        PGVector.from_documents(
            documents=texts,
            embedding=embeddings,
            collection_name=collection_name,
            connection_string=connection_string,
        )
        
        documento.status = 'CONCLUIDO'
        documento.save()

    except Exception as e:
        if 'documento' in locals() and Documento.objects.filter(pk=documento_id).exists():
            documento.status = 'FALHOU'
            documento.save()
        print(f"Erro ao processar documento {documento_id}: {e}")