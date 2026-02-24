# chat/routing.py

from django.urls import re_path
from . import consumers

# Esta lista define para qual Consumer cada rota WebSocket deve ir.
websocket_urlpatterns = [
    # A rota espera um ID de entidade, assim como nossa URL da API.
    # ws://localhost:8000/ws/chat/1/
    re_path(r'ws/chat/(?P<entidade_id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]