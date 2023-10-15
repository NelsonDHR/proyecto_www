from django.contrib import admin
from .models import UserProfile, Event, Activity, ParticipationEvent, ParticipationActivity, Payment

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Event)
admin.site.register(Activity)
admin.site.register(ParticipationEvent)
admin.site.register(ParticipationActivity)
admin.site.register(Payment)
