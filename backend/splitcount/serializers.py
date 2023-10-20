from django.utils import timezone
from rest_framework import serializers
from .models import Event
from .models import *

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ['date']  # Excluir el campo 'date' de los campos serializados

    def create(self, validated_data):
        validated_data['date'] = timezone.now()  # Importa timezone desde django.utils
        event = Event(**validated_data)
        event.save()
        return event

class Activity_serializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'