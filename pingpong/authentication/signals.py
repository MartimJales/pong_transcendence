from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Match, PlayerProfile, Friendship
from django.db import transaction
from django.contrib.auth.signals import user_logged_in, user_logged_out

@receiver(post_save, sender=User) # post_save is a signal, triggered after a model’s save() method is called.
def create_player_profile(sender, instance, created, **kwargs):
    if created:
        PlayerProfile.objects.create(user=instance) #player profile  instance with new user  instance

@receiver(post_save, sender=User)
def save_player_profile(sender, instance, **kwargs):
    instance.playerprofile.save() #save table instance

@receiver(post_save, sender=Match) # update no player profile table depois de salvar um match instance
def update_player_profile(sender, instance, created, **kwargs):
    if created:  # so quando cria
        with transaction.atomic(): #database stuff, 
            player_profile = PlayerProfile.objects.get(user=instance.player)
            player_profile.total_points += instance.earned_points
            if instance.result:
                player_profile.wins += 1
            else:
                player_profile.losses += 1
            player_profile.save()

            # Update opponent's profile if it's not a computer opponent
            if instance.player2:
                opponent_profile = PlayerProfile.objects.get(user=instance.player2)
                if not instance.result:
                    opponent_profile.wins += 1
                else:
                    opponent_profile.losses += 1
                opponent_profile.save()

@receiver(user_logged_in) #django stuff o do user_logged_in
def user_logged_in_handler(sender, request, user, **kwargs):
    PlayerProfile.objects.filter(user=user).update(is_online=True)

@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    PlayerProfile.objects.filter(user=user).update(is_online=False)