from django.contrib import admin
from .models import UserProfile, Contact, Event, Activity, Participation, Payment

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Contact)
admin.site.register(Event)
admin.site.register(Activity)
admin.site.register(Participation)
admin.site.register(Payment)
