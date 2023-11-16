from rest_framework import status, viewsets, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import *
from .serializers import *
from django.db.models import Q

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
        queryset = Event.objects.filter((Q(creator=user) | Q(participants=user)) & Q(is_active=True))
        return queryset

    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["creator"] = request.user.id
        participants_data = request_data.pop('participants', [])

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()

        # Add participants to the event
        for participant_id in participants_data:
            try:
                participant = User.objects.get(id=participant_id)
                ParticipationEvent.objects.create(user=participant, event=event, is_active=True)
            except User.DoesNotExist:
                # Handle the case where the user with the provided ID doesn't exist
                # You might want to log a warning or take appropriate action
                pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def perform_destroy(self, instance):
        # Realiza la eliminación suave estableciendo is_active en False
        instance.is_active = False
        instance.save()
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        request_data = request.data.copy()
        participants_data = request_data.pop('participants', [])

        # Update event details
        serializer = self.get_serializer(instance, data=request_data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Update participants
        instance.participants.clear()
        for participant_id in participants_data:
            try:
                participant = User.objects.get(id=participant_id)
                ParticipationEvent.objects.create(user=participant, event=instance, is_active=True)
            except User.DoesNotExist:
                pass


        return Response(serializer.data)



class ActivityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivitySerializer
    # def get_queryset(self):
    #     user = self.request.user
    #     id = self.request.query_params.get('id', None)
    #     queryset = Activity.objects.filter((Q(creator=user) | Q(participants=user)) & Q(is_active=True) & Q(event=id))
    #     return queryset
    def get_queryset(self):
        user = self.request.user
        queryset = Activity.objects.filter(Q(creator=user) | Q(participants=user) & Q(is_active=True))

        if self.action == 'list':
            id = self.request.query_params.get('id', None)
            if id is not None:
                queryset = queryset.filter(event=id)

        return queryset

    
    def create(self, request, *args, **kwargs):
        request_data = request.data.copy()
        request_data["creator"] = request.user.id
        #request_data["event"] = request.event.id
        
        serializer = self.get_serializer(data=request_data)
        # print("AVer",serializer)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, pk=None):
        
        activity = self.get_object()
        serializer = ActivitySerializer(activity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        # Obtiene el objeto de usuario que se está actualizando
        user = self.get_object()

        # Actualiza los datos del usuario con los datos de la solicitud
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
