from rest_framework import serializers
from .models import Event
from .models import *

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class Activity_serializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'