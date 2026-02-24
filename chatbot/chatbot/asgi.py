# chatbot/asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# 1. Deixe o Django fazer sua configuração inicial primeiro.
#    Esta linha garante que o Django carregue os settings e os apps.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot.settings')
django_asgi_app = get_asgi_application()

# 2. AGORA, com o Django já carregado, importe o roteamento do seu app.
#    Esta importação agora é segura, pois os modelos já foram registrados.
import chat.routing

application = ProtocolTypeRouter({
    # A aplicação HTTP usa a variável que já inicializou o Django.
    "http": django_asgi_app,
    
    # A aplicação WebSocket pode agora ser configurada com segurança.
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})