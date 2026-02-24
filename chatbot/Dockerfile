# 1. Imagem Base: Começamos com uma imagem oficial do Python.
FROM python:3.11-slim

# 2. Variáveis de Ambiente: Melhora o funcionamento do Python no Docker.
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Diretório de Trabalho: Define o diretório padrão dentro do container.
WORKDIR /app

# 4. Instalar Dependências:
# Copiamos apenas o requirements.txt primeiro para aproveitar o cache do Docker.
# Se este arquivo não mudar, o Docker não reinstalará tudo a cada build.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiar o Código da Aplicação: Copia o resto do seu código para o container.
COPY . .

# A porta que o container vai expor (runserver roda na 8000 por padrão)
EXPOSE 8000