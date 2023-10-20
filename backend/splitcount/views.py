from rest_framework import status,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event
from .models import *
from .serializers import EventSerializer
from .serializers import *

class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

class Activity_view(viewsets.ModelViewSet):
    serializer_class = Activity_serializer
    queryset = Activity.objects.all()