# chat/utils.py

import os
from django.conf import settings

# Imports do LangChain e Google
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores.pgvector import PGVector
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

def setup_rag_chain_for_entity(entidade_id: int):
    """
    Configura e retorna uma cadeia RAG completa para uma entidade específica.
    Esta função pode ser chamada por qualquer parte da aplicação (views, consumers, etc).
    """
    try:
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

        collection_name = f"entidade_{entidade_id}_docs"
        
        connection_string = PGVector.connection_string_from_db_params(
            driver="psycopg2",
            host=os.getenv("POSTGRES_HOST", "db"),
            port=int(os.getenv("POSTGRES_PORT", 5432)),
            database=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
        )
        
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        vector_store = PGVector(
            collection_name=collection_name,
            connection_string=connection_string,
            embedding_function=embeddings,
        )
        
        retriever = vector_store.as_retriever()
        
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
        
        prompt = ChatPromptTemplate.from_template("""
        Você é um assistente especialista. Responda à pergunta do usuário baseado exclusivamente no contexto fornecido.
        Se a informação não estiver no contexto, diga que você não sabe. Seja conciso e direto.

        Contexto:
        {context}

        Pergunta: {input}
        """)
        
        document_chain = create_stuff_documents_chain(llm, prompt)
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        print(f"✅ LOG: Cadeia RAG configurada com sucesso para a coleção '{collection_name}'.")
        return retrieval_chain
    
    except Exception as e:
        print(f"🚨 ERRO ao configurar RAG para entidade {entidade_id}: {e}")
        return None