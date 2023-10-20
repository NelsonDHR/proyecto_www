from django.urls import path, include
from .views import EventView
from rest_framework import routers

router= routers.DefaultRouter()
router.register(r'event',EventView,'event')

urlpatterns = [

    path("api/",include(router.urls)),
]
