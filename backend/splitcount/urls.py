from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'event', EventView, 'event')
router.register(r'activities', ActivityView, 'activities')

urlpatterns = [
    path('sign-up/', SignUpView.as_view(), name='create-account'),
    path('log-in/', LogInView.as_view(), name='log-in'),
    path('log-out/', LogOutView.as_view(), name='log-out'),
    path('contacts/', ContactsView.as_view(), name='contacts'),
    path("user/", UserDetailView.as_view(), name='user-detail'),
    path("api/", include(router.urls)),
]