# chatbot/celery.py

import os
from celery import Celery

# O resto do seu arquivo continua igual.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot.settings')

app = Celery('chatbot')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()