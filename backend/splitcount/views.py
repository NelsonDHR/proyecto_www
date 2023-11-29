from decimal import Decimal
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from .models import *
from .serializers import *
from django.db.models import Q
from django.shortcuts import get_object_or_404


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


class LogInView(ObtainAuthToken):
    authentication_classes = []
    permission_classes = [AllowAny]


class LogOutView(APIView):
    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class ContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        contacts = request.user.contacts.all()
        serializer = UserSerializer(contacts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = User.objects.get(
                email=serializer.validated_data['email'])
            request.user.contacts.add(contact)
            contact.contacts.add(request.user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = User.objects.get(
                email=serializer.validated_data['email'])
            request.user.contacts.remove(contact)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Event.objects.filter((Q(creator=user) | Q(
            participants=user)) & Q(is_active=True)).distinct()
        return queryset

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        print(request_data)
        request_data["creator"] = request.user.id
        participants_data = request_data.pop('participants', [])

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()

        # Add participants to the event
        for participant_id in participants_data:
            try:
                participant = User.objects.get(id=participant_id)
                ParticipationEvent.objects.create(
                    user=participant, event=event, is_active=True)
            except User.DoesNotExist:
                # Handle the case where the user with the provided ID doesn't exist
                # You might want to log a warning or take appropriate action
                pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        # Obtains all ParticipationEvent associated with this event
        participation_events = ParticipationEvent.objects.filter(
            event=instance)

        # Mark all ParticipationEvent as inactive
        for participation in participation_events:
            participation.is_active = False
            participation.save()

        # Obtains all Activity associated with this event
        activities = Activity.objects.filter(event=instance)

        # For each activity, mark all ParticipationActivity as inactive
        for activity in activities:
            participation_activities = ParticipationActivity.objects.filter(
                activity=activity)
            for participation in participation_activities:
                participation.is_active = False
                participation.save()

            # Mark the activity as inactive
            activity.is_active = False
            activity.save()

        # Performs soft deletion by setting is_active to False
        instance.is_active = False
        instance.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        request_data = request.data.copy()
        participants_data = request_data.pop('participants', [])

        # Update activity details
        serializer = self.get_serializer(
            instance, data=request_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update participants
        instance.participants.clear()
        for participant_id in participants_data:
            try:
                participant = User.objects.get(id=participant_id)
                ParticipationEvent.objects.create(
                    user=participant, event=instance, is_active=True)
            except User.DoesNotExist:
                pass

        # Update participants in all activities associated with this event
        for activity in instance.activities.all():
            activity.participants.set(instance.participants.filter(
                participation_events__is_active=True))
            activity.save()

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        event = self.get_object()
        participants = event.participants.all()
        serializer = UserSerializer(participants, many=True)
        return Response(serializer.data)


class ActivityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer

    def get_queryset(self):
        user = self.request.user
        event_id = self.request.query_params.get('event_id', None)
        # Obtén el ID de la actividad de la URL
        activity_id = self.kwargs.get('pk', None)

        if event_id is not None:
            queryset = Activity.objects.filter(
                (Q(event=event_id) & Q(is_active=True)) | Q(id=activity_id)).distinct()
        else:
            queryset = Activity.objects.filter(
                (Q(creator=user) | Q(participants=user)) & Q(is_active=True)).distinct()

        return queryset

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["creator"] = request.user.id
        participants_data = request_data.pop('participants', [])

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save()

        # Add participants to the activity
        for participant in participants_data:
            try:
                user = User.objects.get(id=participant['id'])
                if activity.payment_type == 'PR':
                    ParticipationActivity.objects.create(
                        user=user,
                        activity=activity,
                        percentage_to_pay=participant['percentage_to_pay'],
                        is_paid=False,
                        is_active=True
                    )
                else:
                    ParticipationActivity.objects.create(
                        user=user,
                        activity=activity,
                        value_to_pay=participant['value_to_pay'],
                        is_paid=False,
                        is_active=True
                    )
            except User.DoesNotExist:
                pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        # Obtains all ParticipationActivity associated with this activity
        participation_activities = ParticipationActivity.objects.filter(
            activity=instance)

        # Mark all ParticipationActivity as inactive
        for participation in participation_activities:
            participation.is_active = False
            participation.save()

        # Performs soft deletion by setting is_active to False
        instance.is_active = False
        instance.save()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        request_data = request.data.copy()
        participants_data = request_data.pop('participants', [])

        # Update activity details
        serializer = self.get_serializer(
            instance, data=request_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update participants
        instance.participants.clear()
        for participant in participants_data:
            try:
                user = User.objects.get(id=participant['id'])
                if instance.payment_type == 'PR':
                    ParticipationActivity.objects.create(
                        user=user,
                        activity=instance,
                        percentage_to_pay=participant['percentage_to_pay'],
                        is_paid=False,
                        is_active=True
                    )
                else:
                    ParticipationActivity.objects.create(
                        user=user,
                        activity=instance,
                        value_to_pay=participant['value_to_pay'],
                        is_paid=False,
                        is_active=True
                    )
            except User.DoesNotExist:
                pass

        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        activity = self.get_object()
        participants = ParticipationActivity.objects.filter(
            activity=activity, is_active=True)
        serializer = ParticipationActivitySerializer(participants, many=True)
        return Response(serializer.data)


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        # Obtiene el objeto de usuario que se está actualizando
        user = self.get_object()

        # Si 'is_active' está en los datos de la solicitud, actualiza el estado de actividad del usuario
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
            user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Actualiza los datos del usuario con los datos de la solicitud
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class UserDetailByIdView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs['user_id']
        return get_object_or_404(User, id=user_id)
    
class EventBalancesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id, *args, **kwargs):
        activities = ParticipationActivity.objects.filter(
            activity__event_id=event_id, is_active=True
        )

        balances = {}
        creator_balance = Decimal('0')

        for participation_activity in activities:
            user = participation_activity.user
            user_id = user.id
            creator_id = participation_activity.activity.creator.id

            if user_id not in balances:
                balances[user_id] = {'name': user.nickname, 'balance': Decimal('0')}

            activity_payment_type = participation_activity.activity.payment_type

            if activity_payment_type == 'PR':
                # Percentage
                balances[user_id]['balance'] += Decimal(participation_activity.activity.value) * (
                    participation_activity.percentage_to_pay / Decimal('100')
                )
            else:
                # Fixed value
                balances[user_id]['balance'] += Decimal(participation_activity.value_to_pay)

            # If the user is the creator of the activity, subtract the total value of the activity from their balance
            if creator_id == user_id:
                creator_balance += Decimal(participation_activity.activity.value)

        for user_id, data in balances.items():
            if user_id != creator_id:
                data['balance'] -= creator_balance / Decimal(len(balances) - 1)

        balances_list = [{'user_name': data['name'], 'balance': data['balance']}
                         for user_id, data in balances.items()]

        return Response(balances_list, status=status.HTTP_200_OK)