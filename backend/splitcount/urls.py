from django.urls import path, include
from .views import EventView
from .views import *
from rest_framework import routers

router= routers.DefaultRouter()
router.register(r'event',EventView,'event')
router.register(r'activities',Activity_view,'activities')

urlpatterns = [

    path("api/",include(router.urls)),
]
