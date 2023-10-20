from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    nickname = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to='avatars/users/', null=True, blank=True)
    avatar_name = models.CharField(max_length=255, null=True, blank=True)
    contacts = models.ManyToManyField('self', symmetrical=False, blank=True)
    last_login = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.nickname
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'nickname']

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_superuser

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
