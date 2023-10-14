from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

class Contact(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user')
    contact = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='contact')
    is_active = models.BooleanField(default=True)

class Event(models.Model):
    EVENT_TYPES = (
        ('TR', 'Viaje'),
        ('HM', 'Hogar'),
        ('PR', 'Pareja'),
        ('FD', 'Comida'),
        ('OT', 'Otro'),
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.CharField(max_length=2, choices=EVENT_TYPES)
    avatar = models.ImageField(upload_to='event_avatars/', null=True, blank=True)
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    participants = models.ManyToManyField(UserProfile, related_name='events')

class Activity(models.Model):
    description = models.TextField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participants = models.ManyToManyField(UserProfile, through='Participation')
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='created_activities')

class Participation(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

class Payment(models.Model):
    participation = models.ForeignKey(Participation, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
