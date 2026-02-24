from django.urls import path
from .views import ChatMessageView, DocumentoUploadView, EntidadeListView

urlpatterns = [
    # Agora o Django sabe o que é EntidadeListView e esta linha funcionará
    path('entidades/', EntidadeListView.as_view(), name='entidade-list'),

    path('entidades/<int:entidade_id>/chat/', ChatMessageView.as_view(), name='chat-message'),
    path('entidades/<int:entidade_id>/documentos/', DocumentoUploadView.as_view(), name='documento-upload'),
]
