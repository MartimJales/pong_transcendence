from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import PlayerProfile

@receiver(post_save, sender=User) # post_save is a signal, triggered after a model’s save() method is called.
def create_player_profile(sender, instance, created, **kwargs):
    if created:
        PlayerProfile.objects.create(user=instance) #player profile  instance with new user  instance

@receiver(post_save, sender=User)
def save_player_profile(sender, instance, **kwargs):
    instance.playerprofile.save() #save table instance