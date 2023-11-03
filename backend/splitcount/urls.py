from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'event', EventView, 'event')
router.register(r'activities', Activity_view, 'activities')

urlpatterns = [
    path('sign-up/', SignUpView.as_view()),
    path('log-in/', LogInView.as_view()),
    path('log-out/', LogOutView.as_view()),
    path('contacts/', ContactsView.as_view(), name='contacts'),
    path("api/", include(router.urls)),
    # path('sign-up/', sign_up, name='create-account'),
    # path('log-in/', log_in, name='log-in'),
]