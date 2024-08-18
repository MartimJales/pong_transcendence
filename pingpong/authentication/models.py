from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class PlayerProfile(models.Model):
    nick = models.CharField(max_length=50)
    #?image = models.ImageField(upload_to='profile_pics', default='default.jpg')
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    

class Match(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    opponent = models.CharField(max_length=100) # ou outro ForeignKey PlayerProfile?
    result = models.BooleanField()
    match_date = models.DateTimeField(default=datetime.now, blank=True) # auto_now_Add=True 


# instacia match nesse carai toda vez que jogar tipo um Match.objects.create?