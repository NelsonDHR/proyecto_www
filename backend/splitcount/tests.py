from rest_framework.test import APITestCase, APIClient
from django.test import TestCase
from rest_framework import status
from django.urls import reverse
from .models import User

class SignUpViewTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        #self.url = reverse('splitcount:sign-up')
        self.url = 'http://127.0.0.1:8000/splitcount/sign-up/'
        self.payload = {
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'nickname': 'johndoe',
            'password': 'password123',
            'avatar_name': 'avatar.png'
        }

    def test_create_user(self):
        response = self.client.post(self.url, self.payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    
