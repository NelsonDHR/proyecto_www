from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='avatars/users/', null=True, blank=True)

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
    event_type = models.CharField(max_length=2, choices=EVENT_TYPES)
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to='avatars/events/', null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    participants = models.ManyToManyField(UserProfile, blank=True, through='ParticipationEvent')

class Activity(models.Model):
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='created_activities')
    description = models.TextField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participants = models.ManyToManyField(UserProfile, through='ParticipationActivity')

class ParticipationEvent(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)

class ParticipationActivity(models.Model):
    PAYMENT_TYPES = (
        ('PR', 'Porcentaje'),
        ('VF', 'Valor fijo'),
    )
    payment_type = models.CharField(max_length=2, choices=PAYMENT_TYPES)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    value_type = models.DecimalField(max_digits=5, decimal_places=2)
    is_paid = models.BooleanField(default=False)

class Payment(models.Model):
    participation_activity = models.ForeignKey(ParticipationActivity, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
