from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name',
                  'nickname', 'password', 'avatar_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data['email']
        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        return user


class LogInSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']


class ContactSerializer(serializers.Serializer):
    email = serializers.EmailField()


class EventSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        exclude = ['date']  # Excluye 'date' durante la creación

    def create(self, validated_data):
        validated_data['date'] = timezone.now()
        event = Event(**validated_data)
        event.save()
        return event

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['date'] = instance.date  # Incluye 'date' cuando se obtienen los eventos
        return representation


class ParticipationActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ParticipationActivity
        fields = ['user', 'value_to_pay', 'percentage_to_pay', 'is_paid', 'is_active']


class ActivitySerializer(serializers.ModelSerializer):
    participation_activities = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'

    def get_participation_activities(self, obj):
        participation_activities = ParticipationActivity.objects.filter(activity=obj)
        return ParticipationActivitySerializer(participation_activities, many=True).data
