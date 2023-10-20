from django.urls import path
from .views import sign_up, log_in

urlpatterns = [
    path('sign-up/', sign_up, name='create-account'),
    path('log-in/', log_in, name='log-in')
]
