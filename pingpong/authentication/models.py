from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class PlayerProfile(models.Model):
    nick = models.CharField(max_length=50)
    #?image = models.ImageField(upload_to='profile_pics', default='default.jpg')
    user = models.OneToOneField(User, on_delete=models.CASCADE)
<<<<<<< HEAD
    total_points = models.PositiveIntegerField(default=0)
=======
    total_points = models.PositiveIntegerField(default=0) 
>>>>>>> c52369a12608c41eec1e2401682863e91f44b475
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
   
    

class Match(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2', null=True, blank=True) #deixa defaul a nao que seja onlie dai pega id
<<<<<<< HEAD
    earned_points = models.PositiveIntegerField(default=0) 
=======
    earn_points = models.PositiveIntegerField(default=0) 
>>>>>>> c52369a12608c41eec1e2401682863e91f44b475
    mode = models.CharField(max_length=100, default="local") # se nao locar ttrocar string - fodase
    opponent = models.CharField(max_length=100) # ai p1, local challanger
    result = models.BooleanField()
    match_date = models.DateTimeField(default=datetime.now, blank=True) # auto_now_Add=True 


# instacia match nesse carai toda vez que jogar tipo um Match.objects.create?

#class Post(models.Model):
  #  author = models.ForeignKey(User, on_delete=models.CASCADE)
   # content = models.TextField()   

    #created_at = models.DateTimeField(auto_now_add=True)   
#user = User.objects.get(id=1)  # utilizar user id
#post = Post(author=user, content="Hello, world!")
#post.save()