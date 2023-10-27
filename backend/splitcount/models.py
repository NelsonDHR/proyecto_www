from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    nickname = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to='avatars/users/', null=True, blank=True)
    avatar_name = models.CharField(max_length=255, null=True, blank=True)
    contacts = models.ManyToManyField('self', symmetrical=False, blank=True)
    
    def __str__(self):
        return self.nickname

class Event(models.Model):
    EVENT_TYPES = (
        ('TR', 'Viaje'),
        ('HM', 'Hogar'),
        ('PR', 'Pareja'),
        ('FD', 'Comida'),
        ('OT', 'Otro'),
    )
    event_type = models.CharField(max_length=2, choices=EVENT_TYPES)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    avatar = models.ImageField(upload_to='avatars/events/', null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    participants = models.ManyToManyField(User, blank=True, through='ParticipationEvent', related_name='events')
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} {self.creator}"

class Activity(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_activities')
    avatar = models.ImageField(upload_to='avatars/activities/', null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='activities')
    participants = models.ManyToManyField(User, through='ParticipationActivity', related_name='activities')
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} {self.creator}"

class ParticipationEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participation_events')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='participations')
    is_active = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.event.name} {self.user.nickname}"

class ParticipationActivity(models.Model):
    PAYMENT_TYPES = (
        ('PR', 'Porcentaje'),
        ('VF', 'Valor fijo'),
    )
    payment_type = models.CharField(max_length=2, choices=PAYMENT_TYPES)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='participations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participaton_activities')
    value_type = models.DecimalField(max_digits=5, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.activity.name} {self.user.nickname}"

class Payment(models.Model):
    participation_activity = models.ForeignKey(ParticipationActivity, on_delete=models.CASCADE, related_name='payments')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.participation_activity.activity.name} {self.participation_activity.user.nickname}"
