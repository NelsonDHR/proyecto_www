from django.utils import timezone
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ['date']  # Excluir el campo 'date' de los campos serializados

    def create(self, validated_data):
        validated_data['date'] = timezone.now()  # Importa timezone desde django.utils
        event = Event(**validated_data)
        event.save()
        return event

