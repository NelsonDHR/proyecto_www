from django.urls import path, include
from rest_framework import routers
from .views import *

app_name = 'splitcount'

router = routers.DefaultRouter()
router.register(r'event', EventView, 'event')
router.register(r'activities', ActivityView, 'activities')
#router.register(r'balance', BalanceView, 'balance')

urlpatterns = [
    path('sign-up/', SignUpView.as_view(), name='create-account'),
    path('log-in/', LogInView.as_view(), name='log-in'),
    path('log-out/', LogOutView.as_view(), name='log-out'),
    path('contacts/', ContactsView.as_view(), name='contacts'),
    path("user/", UserDetailView.as_view(), name='user-detail'),
    path("user/<int:user_id>/", UserDetailByIdView.as_view(), name='user-detail-by-id'),
    path('balance/<int:event_id>/', BalanceView.as_view()),
    path("api/", include(router.urls)),
]