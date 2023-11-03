from rest_framework import status, viewsets, generics
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import *
from .serializers import *


class SignUpView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = []
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
            contact = User.objects.get(email=serializer.validated_data['email'])
            request.user.contacts.add(contact)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact = User.objects.get(email=serializer.validated_data['email'])
            request.user.contacts.remove(contact)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    def create(self, request, *args, **kwargs):
        
        # Get current user
        request_data = request.data.copy()
        request_data["creator"] = request.user.id
        # Get current user
        
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class Activity_view(viewsets.ModelViewSet):
    serializer_class = Activity_serializer
    queryset = Activity.objects.all()
    
class UserDetailView(generics.RetrieveAPIView):
    serializer_class=UserSerializer
    permission_classes=[IsAuthenticated]
    
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