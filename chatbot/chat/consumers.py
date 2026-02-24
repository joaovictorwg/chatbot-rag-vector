# chat/consumers.py

import os
import json
from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Entidade

# Imports do LangChain e Google
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores.pgvector import PGVector
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate


# --- NOVA FUNÇÃO HELPER ---
# Esta função contém toda a lógica para configurar a cadeia RAG para uma entidade.
# Ela é síncrona, pois LangChain e o acesso ao DB são síncronos.
def setup_rag_chain_for_entity(entidade_id: int):
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
        print(f"✅ LOG: Cadeia RAG configurada com sucesso para entidade {entidade_id}.")
        return retrieval_chain
    except Exception as e:
        print(f"🚨 ERRO ao configurar RAG para entidade {entidade_id}: {e}")
        return None


class ChatConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        self.entidade_id = self.scope['url_route']['kwargs']['entidade_id']
        self.entidade_group_name = f'chat_{self.entidade_id}'
        await self.channel_layer.group_add(self.entidade_group_name, self.channel_name)
        await self.accept()
        print(f"WebSocket conectado para entidade {self.entidade_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.entidade_group_name, self.channel_name)
        print(f"WebSocket desconectado para entidade {self.entidade_id}")

    async def receive_json(self, content):
        message_text = content.get('message')
        if not message_text:
            return

        entidade = await self.get_entidade(self.entidade_id)
        await self.save_message(entidade, message_text, 'user')

        await self.send_json({
            'type': 'status',
            'message': 'Pesquisando na base de conhecimento...'
        })

        # --- LÓGICA CORRIGIDA ---
        # Chamamos nossa nova função helper de forma assíncrona
        rag_chain = await database_sync_to_async(setup_rag_chain_for_entity)(self.entidade_id)
        
        bot_response_text = "Desculpe, o sistema de IA não está disponível no momento."
        if rag_chain:
            try:
                # ainoke é a versão assíncrona, mas como a função inteira do RAG é síncrona,
                # vamos usar o database_sync_to_async para rodar o invoke em um thread separado.
                response = await database_sync_to_async(rag_chain.invoke)({"input": message_text})
                bot_response_text = response.get("answer", "Não consegui processar sua pergunta.")
            except Exception as e:
                bot_response_text = f"Ocorreu um erro na IA: {e}"
        
        bot_message_obj = await self.save_message(entidade, bot_response_text, 'bot')
        await self.send_json({
            'type': 'chat_message',
            'message': { 'id': bot_message_obj.id, 'text': bot_message_obj.text, 'sender': bot_message_obj.sender, 'created_at': bot_message_obj.created_at.isoformat(), }
        })

    @database_sync_to_async
    def get_entidade(self, entidade_id):
        return Entidade.objects.get(pk=entidade_id)

    @database_sync_to_async
    def save_message(self, entidade, text, sender):
        return Message.objects.create(entidade=entidade, text=text, sender=sender)