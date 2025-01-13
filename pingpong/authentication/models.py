from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class PlayerProfile(models.Model):
    nick = models.CharField(max_length=50, default="Please choose a nick")
    userpic = models.ImageField(upload_to='static/images', default='profile_pics/default.jpg')
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_points = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    friends = models.ManyToManyField('PlayerProfile', through='Friendship', symmetrical=False) # friends = profile.friends.all()
    is_online = models.BooleanField(default=False)
    

class Match(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player') # releted name é para puxar nas views.py
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches_as_player2', null=True, blank=True) #deixa default a nao ser que seja online, dai pega id
    earned_points = models.PositiveIntegerField(default=0) #ai counts 15? 
    mode = models.CharField(max_length=100, default="local") # change if comes from online/tour url request 
    opponent = models.CharField(max_length=100) # ai p1, local challanger
    result = models.BooleanField()  
    match_date = models.DateTimeField(default=datetime.now, blank=True) # auto_now_Add=True 

class Friendship(models.Model):
    from_playerprofile_id = models.ForeignKey(PlayerProfile, related_name='friendships', on_delete=models.CASCADE) #relacaosinha aqui
    to_playerprofile_id = models.ForeignKey(PlayerProfile, related_name='friend_requests', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


#class Post(models.Model):
  #  author = models.ForeignKey(User, on_delete=models.CASCADE)
   # content = models.TextField()   

    #created_at = models.DateTimeField(auto_now_add=True)   
#user = User.objects.get(id=1)  # utilizar user id
#post = Post(author=user, content="Hello, world!")
#post.save()