from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'nickname', 'password', 'avatar_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data['email']
        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        return user

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